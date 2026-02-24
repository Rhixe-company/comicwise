/**
 * Users DTOs
 * Data Transfer Objects for user operations
 */

import type { user } from "@/database/schema";

export type UserDto = typeof user.$inferSelect;
export type CreateUserDto = typeof user.$inferInsert;
export type UpdateUserDto = Partial<CreateUserDto>;

export interface UserListDto {
  limit: number;
  page: number;
  total: number;
  users: UserDto[];
}

export type UserWithBookmarksDto = UserDto & {
  bookmarks?: Array<{
    comicId: number;
    createdAt: Date;
    lastReadChapterId?: null | number;
  }>;
};

export type SafeUserDto = Omit<UserDto, "password">;

export {
  deleteUserAdmin as deleteUser,
  createUserAdmin as registerUser,
  updateUserAdmin as updateUser,
} from "@/actions/usersManagement";
