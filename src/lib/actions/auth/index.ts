"use server";

// ═══════════════════════════════════════════════════
// COMPREHENSIVE AUTH ACTIONS (Next.js 16)
// ═══════════════════════════════════════════════════

import { appConfig } from "@/app-config";
import { database } from "@/database";
import { passwordResetToken, user, verificationToken } from "@/database/schema";
import { checkRateLimit } from "@/lib/ratelimit";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
  UpdateProfileInput,
  VerifyEmailInput,
} from "@/lib/validations/schemas";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from "@/lib/validations/schemas";
import { executeWorkflow } from "@/lib/workflow";
import { signIn } from "auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

export interface ActionResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
  field?: string;
}

// ═══════════════════════════════════════════════════
// SIGN UP / REGISTER
// ═══════════════════════════════════════════════════

export async function signUpAction(data: SignUpInput): Promise<ActionResponse> {
  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(`signup:${data.email}`, appConfig.rateLimit.auth);

    if (!rateLimitResult.allowed) {
      return {
        error: "Too many registration attempts. Please try again later.",
      };
    }

    // Validate input
    const validatedData = signUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, validatedData.email.toLowerCase()),
    });

    if (existingUser) {
      return {
        error: "A user with this email already exists.",
        field: "email",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      appConfig.security.bcryptRounds
    );

    // Create user
    const [newUser] = await database
      .insert(user)
      .values({
        name: validatedData.name.trim(),
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        role: "user",
        emailVerified: null, // Not verified yet
      })
      .returning();

    if (!newUser) {
      return { error: "Failed to create user account." };
    }

    // Generate verification token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + appConfig.security.tokenExpiry.emailVerification);

    await database.insert(verificationToken).values({
      identifier: newUser.email,
      token,
      expires,
    });

    // Send verification email via workflow
    await executeWorkflow({
      type: "user.verification",
      recipientEmail: newUser.email,
      recipientName: newUser.name || undefined,
      data: {
        userId: newUser.id,
        verificationToken: token,
        verificationUrl: `${appConfig.url}/verify-email?token=${token}`,
      },
    });

    // Send welcome email (async, don't wait)
    executeWorkflow({
      type: "user.welcome",
      recipientEmail: newUser.email,
      recipientName: newUser.name || undefined,
      data: {
        userId: newUser.id,
      },
    }).catch((error) => console.error("Failed to send welcome email:", error));

    return {
      success: true,
      data: {
        email: newUser.email,
        name: newUser.name,
      },
    };
  } catch (error: unknown) {
    console.error("Sign up error:", error);

    if (error instanceof Error && error.message.includes("duplicate")) {
      return { error: "An account with this email already exists.", field: "email" };
    }

    return { error: "Failed to create account. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// SIGN IN / LOGIN
// ═══════════════════════════════════════════════════

export async function signInAction(data: SignInInput): Promise<ActionResponse> {
  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(`signin:${data.email}`, appConfig.rateLimit.auth);

    if (!rateLimitResult.allowed) {
      return {
        error: "Too many login attempts. Please try again later.",
      };
    }

    // Validate input
    const validatedData = signInSchema.parse(data);

    // Find user
    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, validatedData.email.toLowerCase()),
    });

    if (!existingUser?.password) {
      return {
        error: "Invalid email or password.",
        field: "email",
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(validatedData.password, existingUser.password);

    if (!passwordMatch) {
      return {
        error: "Invalid email or password.",
        field: "password",
      };
    }

    // Sign in using NextAuth
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Failed to sign in. Please try again." };
    }

    return {
      success: true,
      data: {
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      },
    };
  } catch (error: unknown) {
    console.error("Sign in error:", error);

    if (error instanceof Error && error.message.includes("Invalid")) {
      return {
        error: "Invalid email or password.",
        field: "email",
      };
    }

    return { error: "Failed to sign in. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════════════

export async function forgotPasswordAction(data: ForgotPasswordInput): Promise<ActionResponse> {
  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(
      `forgot-password:${data.email}`,
      appConfig.rateLimit.email
    );

    if (!rateLimitResult.allowed) {
      return {
        error: "Too many password reset requests. Please try again later.",
      };
    }

    // Validate input
    const validatedData = forgotPasswordSchema.parse(data);

    // Find user
    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, validatedData.email.toLowerCase()),
    });

    // Always return success to prevent email enumeration
    if (!existingUser) {
      return {
        success: true,
        data: {
          message: "If an account exists with this email, you will receive a password reset link.",
        },
      };
    }

    // Generate reset token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + appConfig.security.tokenExpiry.passwordReset);

    // Delete any existing tokens for this email
    await database
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.email, existingUser.email));

    // Create new token
    await database.insert(passwordResetToken).values({
      email: existingUser.email,
      token,
      expires,
    });

    // Send password reset email via workflow
    await executeWorkflow({
      type: "user.password-reset",
      recipientEmail: existingUser.email,
      recipientName: existingUser.name || undefined,
      data: {
        userId: existingUser.id,
        resetToken: token,
        resetUrl: `${appConfig.url}/reset-password?token=${token}`,
      },
    });

    return {
      success: true,
      data: {
        message: "If an account exists with this email, you will receive a password reset link.",
      },
    };
  } catch (error: unknown) {
    console.error("Forgot password error:", error);

    return { error: "Failed to process request. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// RESET PASSWORD
// ═══════════════════════════════════════════════════

export async function resetPasswordAction(data: ResetPasswordInput): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = resetPasswordSchema.parse(data);

    // Find valid token
    const resetToken = await database.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, validatedData.token),
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return {
        error: "Invalid or expired reset token. Please request a new one.",
      };
    }

    // Find user
    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, resetToken.email),
    });

    if (!existingUser) {
      return { error: "User not found." };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      appConfig.security.bcryptRounds
    );

    // Update password
    await database
      .update(user)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(user.id, existingUser.id));

    // Delete used token
    await database
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, validatedData.token));

    // Send confirmation email (async, don't wait)
    executeWorkflow({
      type: "user.account-updated",
      recipientEmail: existingUser.email,
      recipientName: existingUser.name || undefined,
      data: {
        userId: existingUser.id,
        changeType: "password",
      },
    }).catch((error) => console.error("Failed to send confirmation email:", error));

    return {
      success: true,
      data: {
        message: "Your password has been reset successfully.",
      },
    };
  } catch (error: unknown) {
    console.error("Reset password error:", error);

    return { error: "Failed to reset password. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// VERIFY EMAIL
// ═══════════════════════════════════════════════════

export async function verifyEmailAction(data: VerifyEmailInput): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = verifyEmailSchema.parse(data);

    // Find valid token
    const token = await database.query.verificationToken.findFirst({
      where: eq(verificationToken.token, validatedData.token),
    });

    if (!token || token.expires < new Date()) {
      return {
        error: "Invalid or expired verification token.",
      };
    }

    // Find user
    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, token.identifier),
    });

    if (!existingUser) {
      return { error: "User not found." };
    }

    // Update email verification status
    await database
      .update(user)
      .set({
        emailVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(user.id, existingUser.id));

    // Delete used token
    await database
      .delete(verificationToken)
      .where(eq(verificationToken.token, validatedData.token));

    return {
      success: true,
      data: {
        message: "Your email has been verified successfully.",
      },
    };
  } catch (error: unknown) {
    console.error("Verify email error:", error);

    return { error: "Failed to verify email. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// RESEND VERIFICATION EMAIL
// ═══════════════════════════════════════════════════

export async function resendVerificationEmailAction(
  data: { email: string } | string
): Promise<ActionResponse> {
  try {
    // Handle both object and string input for backward compatibility
    const email = typeof data === "string" ? data : data.email;

    // Rate limiting
    const rateLimitResult = checkRateLimit(
      `resend-verification:${email}`,
      appConfig.rateLimit.email
    );

    if (!rateLimitResult.allowed) {
      return {
        error: "Too many requests. Please try again later.",
      };
    }

    // Find user
    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, email.toLowerCase()),
    });

    if (!existingUser) {
      // Don't reveal if user exists
      return {
        success: true,
        data: {
          message: "If an account exists, a verification email has been sent.",
        },
      };
    }

    // Check if already verified
    if (existingUser.emailVerified) {
      return {
        error: "This email is already verified.",
      };
    }

    // Delete old tokens
    await database
      .delete(verificationToken)
      .where(eq(verificationToken.identifier, existingUser.email));

    // Generate new token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + appConfig.security.tokenExpiry.emailVerification);

    await database.insert(verificationToken).values({
      identifier: existingUser.email,
      token,
      expires,
    });

    // Send verification email
    await executeWorkflow({
      type: "user.verification",
      recipientEmail: existingUser.email,
      recipientName: existingUser.name || undefined,
      data: {
        userId: existingUser.id,
        verificationToken: token,
        verificationUrl: `${appConfig.url}/verify-email?token=${token}`,
      },
    });

    return {
      success: true,
      data: {
        message: "Verification email has been sent.",
      },
    };
  } catch (error: unknown) {
    console.error("Resend verification error:", error);
    return { error: "Failed to send verification email. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// UPDATE PROFILE
// ═══════════════════════════════════════════════════

export async function updateProfileAction(
  userId: string,
  data: UpdateProfileInput
): Promise<ActionResponse> {
  try {
    // Validate input
    const validatedData = updateProfileSchema.parse(data);

    // Update user
    const [updatedUser] = await database
      .update(user)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId))
      .returning();

    if (!updatedUser) {
      return { error: "Failed to update profile." };
    }

    // Send notification email (async, don't wait)
    if (updatedUser.email) {
      executeWorkflow({
        type: "user.account-updated",
        recipientEmail: updatedUser.email,
        recipientName: updatedUser.name || undefined,
        data: {
          userId: updatedUser.id,
          changeType: "profile",
        },
      }).catch((error) => console.error("Failed to send notification:", error));
    }

    return {
      success: true,
      data: {
        name: updatedUser.name,
        image: updatedUser.image,
      },
    };
  } catch (error: unknown) {
    console.error("Update profile error:", error);

    return { error: "Failed to update profile. Please try again." };
  }
}

// ═══════════════════════════════════════════════════
// BACKWARD COMPATIBILITY EXPORTS
// ═══════════════════════════════════════════════════

export async function registerUser(formData: FormData): Promise<ActionResponse> {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };
  return signUpAction(data);
}

export async function requestPasswordReset(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  return forgotPasswordAction({ email });
}

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
  const data = {
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };
  return resetPasswordAction(data);
}
