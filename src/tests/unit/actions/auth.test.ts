// ═══════════════════════════════════════════════════
// AUTH ACTIONS - UNIT TESTS
// ═══════════════════════════════════════════════════

import { handleSignOut, signInWithCredentials, signOutAction } from "@/lib/actions/auth";
import * as ratelimitLib from "@/lib/ratelimit";
import * as authLib from "auth";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock dependencies
vi.mock("auth");
vi.mock("lib/ratelimit");
vi.mock("appConfig", () => ({
  appConfig: {
    rateLimit: {
      auth: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000,
      },
    },
  },
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════
  // SIGN IN WITH CREDENTIALS TESTS
  // ═══════════════════════════════════════════════════

  describe("signInWithCredentials", () => {
    const validEmail = "test@example.com";
    const validPassword = "Password123!";

    it("should successfully sign in with valid credentials", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", validPassword);
      (ratelimitLib.checkRateLimit as Mock).mockReturnValue({
        allowed: true,
        remaining: 4,
      });
      (authLib.signIn as Mock).mockResolvedValue({ error: null });

      const result = await signInWithCredentials(formData);

      expect(ratelimitLib.checkRateLimit).toHaveBeenCalledWith(
        `signin:${validEmail}`,
        expect.any(Object)
      );
      expect(authLib.signIn).toHaveBeenCalledWith("credentials", {
        email: validEmail,
        password: validPassword,
        redirect: false,
      });
      expect(result).toEqual({ success: true });
    });

    it("should return error when rate limit is exceeded", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", validPassword);
      (ratelimitLib.checkRateLimit as Mock).mockReturnValue({
        allowed: false,
        remaining: 0,
      });

      const result = await signInWithCredentials(formData);

      expect(result).toEqual({
        success: false,
        error: "Too many sign in attempts. Please try again later.",
      });
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when credentials are invalid", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", validPassword);
      (ratelimitLib.checkRateLimit as Mock).mockReturnValue({
        allowed: true,
        remaining: 4,
      });
      (authLib.signIn as Mock).mockResolvedValue({
        error: "Invalid credentials",
      });

      const result = await signInWithCredentials(formData);

      expect(result).toEqual({
        success: false,
        error: "Invalid email or password",
      });
    });

    it("should return error when email is empty", async () => {
      const formData = new FormData();
      formData.append("email", "");
      formData.append("password", validPassword);

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when password is empty", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", "");

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when email format is invalid", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", validPassword);

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when password is too short", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", "short");

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when password lacks uppercase", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", "password123!");

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when password lacks lowercase", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", "PASSWORD123!");

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should return error when password lacks number", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", "Password!");

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(authLib.signIn).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors gracefully", async () => {
      const formData = new FormData();
      formData.append("email", validEmail);
      formData.append("password", validPassword);
      (ratelimitLib.checkRateLimit as Mock).mockReturnValue({
        allowed: true,
        remaining: 4,
      });
      (authLib.signIn as Mock).mockRejectedValue(new Error("Network error"));

      const result = await signInWithCredentials(formData);

      expect(result).toEqual({
        success: false,
        error: "Failed to sign in",
      });
    });

    it("should handle ZodError with first issue message", async () => {
      const formData = new FormData();
      formData.append("email", "");
      formData.append("password", "");

      const result = await signInWithCredentials(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  // ═══════════════════════════════════════════════════
  // SIGN OUT ACTION TESTS
  // ═══════════════════════════════════════════════════

  describe("signOutAction", () => {
    it("should successfully sign out user", async () => {
      (authLib.signOut as Mock).mockResolvedValue(undefined);

      await signOutAction();

      expect(authLib.signOut).toHaveBeenCalledWith({
        redirectTo: "/sign-in",
      });
    });

    it("should handle sign out errors gracefully", async () => {
      (authLib.signOut as Mock).mockRejectedValue(new Error("Sign out error"));

      // signOutAction doesn't catch errors, so it should throw
      await expect(signOutAction()).rejects.toThrow("Sign out error");
    });
  });

  // ═══════════════════════════════════════════════════
  // HANDLE SIGN OUT TESTS
  // ═══════════════════════════════════════════════════

  describe("handleSignOut", () => {
    it("should successfully sign out user and return success", async () => {
      (authLib.signOut as Mock).mockResolvedValue(undefined);

      const result = await handleSignOut();

      expect(authLib.signOut).toHaveBeenCalledWith({
        redirectTo: "/sign-in",
      });
      expect(result).toEqual({ success: true });
    });

    it("should return error when sign out fails", async () => {
      (authLib.signOut as Mock).mockRejectedValue(new Error("Sign out error"));

      const result = await handleSignOut();

      expect(result).toEqual({
        success: false,
        error: "Failed to sign out",
      });
    });

    it("should handle network errors gracefully", async () => {
      (authLib.signOut as Mock).mockRejectedValue(new Error("Network error"));

      const result = await handleSignOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Failed to sign out");
    });
  });
});
