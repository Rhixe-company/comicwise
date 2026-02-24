/**
 * Authentication DTOs
 * Data Transfer Objects for authentication operations
 */

import type { user } from "@/database/schema";

export type UserDto = typeof user.$inferSelect;
export type CreateUserDto = typeof user.$inferInsert;
export type UpdateUserDto = Partial<CreateUserDto>;

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  name?: string;
  password: string;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ResetPasswordDto {
  password: string;
  token: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface AuthResponseDto {
  error?: string;
  message?: string;
  success: boolean;
  user?: UserDto;
}

export interface SessionDto {
  expires: string;
  user: UserDto;
}
