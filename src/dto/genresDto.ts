/**
 * Genres DTOs
 * Data Transfer Objects for genre operations
 */

import type { genre } from "@/database/schema";

export type GenreDto = typeof genre.$inferSelect;
export type CreateGenreDto = typeof genre.$inferInsert;
export type UpdateGenreDto = Partial<CreateGenreDto>;

export interface GenreListDto {
  genres: GenreDto[];
  limit: number;
  page: number;
  total: number;
}

export type GenreWithComicsDto = GenreDto & {
  comicCount?: number;
  comics?: Array<{
    coverImage: string;
    id: number;
    slug: string;
    title: string;
  }>;
};

export { deleteGenre, updateGenre } from "@/actions/genresTypes";
