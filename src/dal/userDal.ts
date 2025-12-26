/**
 * User Data Access Layer
 * Handles all database operations for users
 */

import { db } from "@/database/db";
import * as mutations from "@/database/mutations";
import * as queries from "@/database/queries";
import { logger } from "@/lib/logger";
import { user } from "schema";
import type { User } from "/typesdatabase";

export class UserDal {
  private static instance: UserDal;
  private logger = logger.child({ context: "UserDal" });

  private constructor() {}

  static getInstance(): UserDal {
    if (!UserDal.instance) {
      UserDal.instance = new UserDal();
    }
    return UserDal.instance;
  }

  async create(data: {
    name: string;
    email: string;
    hashedPassword?: string;
    image?: string | null;
    role?: string;
  }): Promise<User | undefined> {
    try {
      this.logger.debug({ data }, "Creating user");
      const result = await mutations.createUser({
        email: data.email,
        name: data.name,
        password: data.hashedPassword,
        image: data.image ?? undefined,
        role: data.role as "user" | "admin" | "moderator" | undefined,
      });
      this.logger.info({ userId: result?.id }, "User created successfully");
      return result;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create user");
      throw error;
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      this.logger.debug({ id }, "Finding user by ID");
      return await queries.getUserById(id);
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find user by ID");
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      this.logger.debug({ email }, "Finding user by email");
      return await queries.getUserByEmail(email);
    } catch (error) {
      this.logger.error({ error, email }, "Failed to find user by email");
      throw error;
    }
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating user");
      const updateData = {
        name: data.name ?? undefined,
        email: data.email,
        image: data.image === null ? null : data.image,
        role: data.role,
        emailVerified: data.emailVerified ?? undefined,
      };
      const result = await mutations.updateUser(id, updateData);
      this.logger.info({ userId: id }, "User updated successfully");
      return result;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update user");
      throw error;
    }
  }

  async delete(id: string): Promise<User | undefined> {
    try {
      this.logger.debug({ id }, "Deleting user");
      const result = await mutations.deleteUser(id);
      this.logger.info({ userId: id }, "User deleted successfully");
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete user");
      throw error;
    }
  }

  async findByResetToken(token: string): Promise<User | undefined> {
    try {
      this.logger.debug({ token: "***" }, "Finding user by reset token");
      // Note: This functionality needs to be implemented in the queries
      return undefined;
    } catch (error) {
      this.logger.error({ error }, "Failed to find user by reset token");
      throw error;
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User | undefined> {
    try {
      this.logger.debug({ id }, "Updating user password");
      const result = await mutations.updateUserPassword(id, hashedPassword);
      this.logger.info({ userId: id }, "Password updated successfully");
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to update password");
      throw error;
    }
  }

  async setResetToken(
    id: string,
    resetToken: string,
    resetTokenExpiry: Date
  ): Promise<User | undefined> {
    try {
      this.logger.debug({ id }, "Setting reset token");
      // Note: User mutations don't support resetToken - this should use passwordResetToken table
      return undefined;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to set reset token");
      throw error;
    }
  }

  async list(limit = 50, offset = 0): Promise<User[]> {
    try {
      this.logger.debug({ limit, offset }, "Listing users");
      const users = await db.select().from(user).limit(limit).offset(offset);
      return users;
    } catch (error) {
      this.logger.error({ error, limit, offset }, "Failed to list users");
      throw error;
    }
  }
}

export const userDal = UserDal.getInstance();
