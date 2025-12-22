/**
 * User Data Transfer Objects
 * Handles data transformation and sanitization for user entities
 */

import type { User } from '#types/database-auto';

export interface UserDto {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface UserPublicDto {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

export interface UserProfileDto extends UserDto {
  totalBookmarks?: number;
  totalComments?: number;
}

export class UserDtoMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toPublicDto(user: User): UserPublicDto {
    return {
      id: user.id,
      name: user.name,
      image: user.image,
      role: user.role,
    };
  }

  static toProfileDto(user: User, metadata?: { totalBookmarks?: number; totalComments?: number }): UserProfileDto {
    return {
      ...UserDtoMapper.toDto(user),
      totalBookmarks: metadata?.totalBookmarks,
      totalComments: metadata?.totalComments,
    };
  }

  static toDtoList(users: User[]): UserDto[] {
    return users.map(UserDtoMapper.toDto);
  }

  static toPublicDtoList(users: User[]): UserPublicDto[] {
    return users.map(UserDtoMapper.toPublicDto);
  }
}
