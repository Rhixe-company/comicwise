/**
 * Comics DTOs
 * Data Transfer Objects for comic operations
 */

import type { comic } from "@/database/schema";

export type ComicDto = typeof comic.$inferSelect;
export type CreateComicDto = typeof comic.$inferInsert;
export type UpdateComicDto = Partial<CreateComicDto>;

export interface ComicListDto {
  comics: ComicDto[];
  limit: number;
  page: number;
  total: number;
}

export type ComicWithRelationsDto = ComicDto & {
  artist?: {
    id: number;
    name: string;
  };
  author?: {
    id: number;
    name: string;
  };
  chapters?: Array<{
    chapterNumber: number;
    id: number;
    slug: string;
    title: string;
  }>;
  genres?: Array<{
    id: number;
    name: string;
  }>;
  type?: {
    id: number;
    name: string;
  };
};

export interface ComicFiltersDto {
  artistId?: number;
  authorId?: number;
  genreIds?: number[];
  limit?: number;
  page?: number;
  rating?: number;
  search?: string;
  sortBy?: "createdAt" | "rating" | "title" | "updatedAt" | "views";
  sortOrder?: "asc" | "desc";
  status?: string;
  typeId?: number;
}

export { createComic } from "@/actions/comics";
