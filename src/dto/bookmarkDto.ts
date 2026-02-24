/**
 * Bookmark DTOs
 * Data Transfer Objects for bookmark operations
 */

import type { bookmark } from "@/database/schema";

export type BookmarkDto = typeof bookmark.$inferSelect;
export type CreateBookmarkDto = typeof bookmark.$inferInsert;
export type UpdateBookmarkDto = Partial<CreateBookmarkDto>;

export interface BookmarkListDto {
  bookmarks: BookmarkDto[];
  limit: number;
  page: number;
  total: number;
}

export type BookmarkWithComicDto = BookmarkDto & {
  comic?: {
    author?: {
      id: number;
      name: string;
    };
    coverImage: string;
    id: number;
    slug: string;
    title: string;
  };
  lastReadChapter?: {
    chapterNumber: number;
    id: number;
    title: string;
  };
};
