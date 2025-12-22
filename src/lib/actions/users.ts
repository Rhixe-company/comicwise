"use server";

import { error } from "#actions/utils";
import * as mutations from '#database/mutations';
import * as queries from '#database/queries';
import { sendPasswordResetEmail, sendWelcomeEmail } from '#lib/nodemailer';
import { signUpSchema } from '#lib/validations';
import type { ActionResponse } from "types";
import appConfig, { checkRateLimit } from "appConfig";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateUserAdminSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(["user", "admin", "moderator"]).optional(),
    image: z.string().url().optional().nullable(),
  })
  .strict();

export async function registerUser(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    // Rate limiting
    const email = formData.get("email") as string;
    const rateLimit = await checkRateLimit(`register:${email}`, {
      limit: appConfig.rateLimit.auth.requests,
      window: "30s"
    });
    if (!rateLimit.allowed) {
      return error("Too many registration attempts. Please try again later.");
    }

    const data = signUpSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Check if user already exists
    const existingUser = await queries.getUserByEmail(data.email);
    if (existingUser) {
      return error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await mutations.createUser({
      ...data,
      password: hashedPassword,
    });

    if (!user) {
      return error("Failed to create user");
    }

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || "User");

    return { success: true, data: { id: user.id } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Register user error:", err);
    return error("Failed to register user");
  }
}

export async function updateUser(userId: string, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateUserAdminSchema.parse({
      name: formData.get("name") || undefined,
      email: formData.get("email") || undefined,
      role: formData.get("role") || undefined,
      image: formData.get("image") || undefined,
    });

    await mutations.updateUser(userId, data);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${userId}`);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Update user error:", err);
    return error("Failed to update user");
  }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
  try {
    await mutations.deleteUser(userId);
    revalidatePath("/admin/users");

    return { success: true };
  } catch (err) {
    console.error("Delete user error:", err);
    return error("Failed to delete user");
  }
}

export async function requestPasswordReset(email: string): Promise<ActionResponse> {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(`password-reset:${email}`, {
      limit: appConfig.rateLimit.email.requests,
      window: "60s"
    });
    if (!rateLimit.allowed) {
      return error("Too many password reset requests. Please try again later.");
    }

    const user = await queries.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    // Delete any existing tokens for this email
    await mutations.deletePasswordResetTokensByEmail(email);

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await mutations.createPasswordResetToken({
      email,
      token,
      expires,
    });

    // Send reset email
    await sendPasswordResetEmail(email, user.name || "User", token);

    return { success: true };
  } catch (err) {
    console.error("Password reset request error:", err);
    return error("Failed to process password reset request");
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResponse> {
  try {
    const resetToken = await queries.getPasswordResetToken(token);

    if (!resetToken) {
      return error("Invalid or expired reset token");
    }

    if (new Date() > resetToken.expires) {
      return error("Reset token has expired");
    }

    const user = await queries.getUserByEmail(resetToken.email);
    if (!user) {
      return error("User not found");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await mutations.updateUserPassword(user.id, hashedPassword);

    // Delete the used token
    await mutations.deletePasswordResetToken(token);

    return { success: true };
  } catch (err) {
    console.error("Reset password error:", err);
    return error("Failed to reset password");
  }
}
