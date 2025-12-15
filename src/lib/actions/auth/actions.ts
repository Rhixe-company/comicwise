"use server";

import { database } from "@/database";
import { passwordResetToken, user } from "@/database/schema";
import { error } from "@/lib/actions/utils";
import { signIn } from "auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import type { ActionResponse } from "src/types";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .strict();

const newPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

export async function registerUser(formData: FormData): Promise<ActionResponse> {
  try {
    const data = registerSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, data.email),
    });

    if (existingUser) {
      return error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await database.insert(user).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "user",
    });

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues?.[0]?.message || "Validation error");
    }
    return error("Failed to register user");
  }
}

export async function requestPasswordReset(formData: FormData): Promise<ActionResponse> {
  try {
    const data = resetPasswordSchema.parse({
      email: formData.get("email"),
    });

    const existingUser = await database.query.user.findFirst({
      where: eq(user.email, data.email),
    });

    if (!existingUser) {
      return error("User not found");
    }

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await database.insert(passwordResetToken).values({
      email: data.email,
      token,
      expires,
    });

    // TODO: Send email with token
    // await sendPasswordResetEmail(data.email, token);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues?.[0]?.message || "Validation error");
    }
    return error("Failed to request password reset");
  }
}

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
  try {
    const data = newPasswordSchema.parse({
      token: formData.get("token"),
      password: formData.get("password"),
    });

    const resetToken = await database.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, data.token),
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return error("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await database
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.email, resetToken.email));

    await database.delete(passwordResetToken).where(eq(passwordResetToken.token, data.token));

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues?.[0]?.message || "Validation error");
    }
    return error("Failed to reset password");
  }
}

export async function signInUser(formData: FormData): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch {
    return error("Invalid email or password");
  }
}
