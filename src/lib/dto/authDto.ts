"use server";

/**
 * Data Transfer Objects for auth actions
 * Centralized exports for auth server actions
 */

export {
  forgotPasswordAction,
  registerUserAction,
  resendVerificationEmailAction,
  resetPasswordAction,
  signInAction,
  signOutAction,
  verifyEmailAction,
  type AuthActionResponse,
} from "#actions/auth";
