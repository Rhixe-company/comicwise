"use server";

/**
 * Data Transfer Objects for auth actions
 * Centralized exports for auth server actions
 */

export {
  registerUserAction,
  verifyEmailAction,
  resendVerificationEmailAction,
  forgotPasswordAction,
  resetPasswordAction,
  signInAction,
  signOutAction,
  type AuthActionResponse,
} from '#actions/auth';
