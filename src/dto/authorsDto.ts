/**
 * Authors DTOs
 * Data Transfer Objects for author operations
 */

import type { author } from "@/database/schema";

export type AuthorDto = typeof author.$inferSelect;
export type CreateAuthorDto = typeof author.$inferInsert;
export type UpdateAuthorDto = Partial<CreateAuthorDto>;

export interface AuthorListDto {
  authors: AuthorDto[];
  limit: number;
  page: number;
  total: number;
}

export type AuthorWithComicsDto = AuthorDto & {
  comics?: Array<{
    coverImage: string;
    id: number;
    slug: string;
    title: string;
  }>;
};

export { deleteAuthor, updateAuthor } from "@/actions/authors";
