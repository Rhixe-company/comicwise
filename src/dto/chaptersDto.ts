/**
 * Chapters DTOs
 * Data Transfer Objects for chapter operations
 */

import type { chapter } from "@/database/schema";

export type ChapterDto = typeof chapter.$inferSelect;
export type CreateChapterDto = typeof chapter.$inferInsert;
export type UpdateChapterDto = Partial<CreateChapterDto>;

export interface ChapterListDto {
  chapters: ChapterDto[];
  limit: number;
  page: number;
  total: number;
}

export type ChapterWithImagesDto = ChapterDto & {
  images?: Array<{
    id: number;
    imageUrl: string;
    pageNumber: number;
  }>;
};

export interface ChapterNavigationDto {
  current: ChapterDto;
  next?: ChapterDto;
  previous?: ChapterDto;
}

export { deleteChapter, updateChapter } from "@/actions/chapters";
