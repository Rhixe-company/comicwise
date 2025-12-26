/**
 * Type Data Access Layer
 * Handles all database operations for types
 */

import { db } from "@/database/db";
import { asc, eq } from "drizzle-orm";
import { logger } from "lib/logger";
import { type as typeTable } from "schema";
import type { Type } from "@/types/database";

export class TypeDal {
  private static instance: TypeDal;
  private logger = logger.child({ context: "TypeDal" });

  private constructor() {}

  static getInstance(): TypeDal {
    if (!TypeDal.instance) {
      TypeDal.instance = new TypeDal();
    }
    return TypeDal.instance;
  }

  async create(data: typeof typeTable.$inferInsert): Promise<Type | undefined> {
    try {
      this.logger.debug({ data }, "Creating type");
      const [newType] = await db.insert(typeTable).values(data).returning();
      this.logger.info({ typeId: newType?.id }, "Type created successfully");
      return newType;
    } catch (error) {
      this.logger.error({ error, data }, "Failed to create type");
      throw error;
    }
  }

  async findById(id: number): Promise<Type | undefined> {
    try {
      this.logger.debug({ id }, "Finding type by ID");
      const [result] = await db.select().from(typeTable).where(eq(typeTable.id, id));
      return result;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to find type by ID");
      throw error;
    }
  }

  async findByName(name: string): Promise<Type | undefined> {
    try {
      this.logger.debug({ name }, "Finding type by name");
      const [result] = await db.select().from(typeTable).where(eq(typeTable.name, name));
      return result;
    } catch (error) {
      this.logger.error({ error, name }, "Failed to find type by name");
      throw error;
    }
  }

  async update(
    id: number,
    data: Partial<typeof typeTable.$inferInsert>
  ): Promise<Type | undefined> {
    try {
      this.logger.debug({ id, data }, "Updating type");
      const [updated] = await db
        .update(typeTable)
        .set(data)
        .where(eq(typeTable.id, id))
        .returning();
      this.logger.info({ typeId: id }, "Type updated successfully");
      return updated;
    } catch (error) {
      this.logger.error({ error, id, data }, "Failed to update type");
      throw error;
    }
  }

  async delete(id: number): Promise<Type | undefined> {
    try {
      this.logger.debug({ id }, "Deleting type");
      const [deleted] = await db.delete(typeTable).where(eq(typeTable.id, id)).returning();
      this.logger.info({ typeId: id }, "Type deleted successfully");
      return deleted;
    } catch (error) {
      this.logger.error({ error, id }, "Failed to delete type");
      throw error;
    }
  }

  async list(): Promise<Type[]> {
    try {
      this.logger.debug("Listing all types");
      const results = await db.select().from(typeTable).orderBy(asc(typeTable.name));
      return results;
    } catch (error) {
      this.logger.error({ error }, "Failed to list types");
      throw error;
    }
  }
}

export const typeDal = TypeDal.getInstance();
