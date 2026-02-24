/**
 * Types DTOs
 * Data Transfer Objects for type operations
 */

import type { type as typeTable } from "@/database/schema";

export type TypeDto = typeof typeTable.$inferSelect;
export type CreateTypeDto = typeof typeTable.$inferInsert;
export type UpdateTypeDto = Partial<CreateTypeDto>;

export interface TypeListDto {
  limit: number;
  page: number;
  total: number;
  types: TypeDto[];
}

export type TypeWithComicsDto = TypeDto & {
  comicCount?: number;
  comics?: Array<{
    coverImage: string;
    id: number;
    slug: string;
    title: string;
  }>;
};

export { deleteType, updateType } from "@/lib/actions/genresTypes";
