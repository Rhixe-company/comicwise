"use server";

// ═══════════════════════════════════════════════════
// AUTH ACTIONS - LEGACY EXPORTS
// ═══════════════════════════════════════════════════

// NOTE: For new auth actions, import directly from "@/lib/actions/auth/index"
// This file maintains backward compatibility for legacy imports

import { appConfig } from "@/app-config";
import { error } from "@/lib/actions/utils";
import { checkRateLimit } from "@/lib/ratelimit";
import { signInSchema } from "@/lib/validator";
import { signIn, signOut } from "auth";
import type { ActionResponse } from "src/types";
import { z } from "zod";

export async function signInWithCredentials(formData: FormData): Promise<ActionResponse> {
  try {
    const data = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Rate limiting
    const rateLimit = checkRateLimit(`signin:${data.email}`, appConfig.rateLimit.auth);
    if (!rateLimit.allowed) {
      return error("Too many sign in attempts. Please try again later.");
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return error("Invalid email or password");
    }

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Sign in error:", err);
    return error("Failed to sign in");
  }
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}

export async function handleSignOut() {
  try {
    await signOut({ redirectTo: "/sign-in" });
    return { success: true };
  } catch (err) {
    console.error("Sign out error:", err);
    return error("Failed to sign out");
  }
}
