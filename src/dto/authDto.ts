/**
 * Authentication DTOs
 * Data Transfer Objects for authentication operations
 */

import type { user } from "schema";

export type UserDto = typeof user.$inferSelect;
export type CreateUserDto = typeof user.$inferInsert;
export type UpdateUserDto = Partial<CreateUserDto>;

export type SignInDto = {
  email: string;
  password: string;
};

export type SignUpDto = {
  email: string;
  password: string;
  name?: string;
};

export type VerifyEmailDto = {
  token: string;
};

export type ResetPasswordDto = {
  token: string;
  password: string;
};

export type RequestPasswordResetDto = {
  email: string;
};

export type AuthResponseDto = {
  success: boolean;
  message?: string;
  user?: UserDto;
  error?: string;
};

export type SessionDto = {
  user: UserDto;
  expires: string;
};

export { signOut as signOutAction } from "auth";
export {
  forgotPassword as forgotPasswordAction,
  registerUserAction,
  resendVerificationEmailAction,
  resetPassword as resetPasswordAction,
  signInAction,
  verifyEmail as verifyEmailAction,
} from "lib/actions/auth";
