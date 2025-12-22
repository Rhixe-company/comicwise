/**
 * Chapter Data Transfer Objects
 * Handles data transformation for chapter entities
 */

import type { Chapter } from '#types/database-auto';

export interface ChapterDto {
  id: string;
  comicId: string;
  title: string;
  slug: string;
  number: number;
  images: string[] | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ChapterListDto {
  id: string;
  title: string;
  slug: string;
  number: number;
  publishedAt: Date | null;
  createdAt: Date;
}

export interface ChapterDetailDto extends ChapterDto {
  comicTitle?: string;
  previousChapter?: {
    id: string;
    slug: string;
    number: number;
  } | null;
  nextChapter?: {
    id: string;
    slug: string;
    number: number;
  } | null;
}

export class ChapterDtoMapper {
  static toDto(chapter: Chapter): ChapterDto {
    return {
      id: chapter.id,
      comicId: chapter.comicId,
      title: chapter.title,
      slug: chapter.slug,
      number: chapter.number,
      images: chapter.images,
      publishedAt: chapter.publishedAt,
      createdAt: chapter.createdAt,
      updatedAt: chapter.updatedAt,
    };
  }

  static toListDto(chapter: Chapter): ChapterListDto {
    return {
      id: chapter.id,
      title: chapter.title,
      slug: chapter.slug,
      number: chapter.number,
      publishedAt: chapter.publishedAt,
      createdAt: chapter.createdAt,
    };
  }

  static toDetailDto(
    chapter: Chapter,
    metadata?: {
      comicTitle?: string;
      previousChapter?: { id: string; slug: string; number: number } | null;
      nextChapter?: { id: string; slug: string; number: number } | null;
    }
  ): ChapterDetailDto {
    return {
      ...ChapterDtoMapper.toDto(chapter),
      comicTitle: metadata?.comicTitle,
      previousChapter: metadata?.previousChapter,
      nextChapter: metadata?.nextChapter,
    };
  }

  static toDtoList(chapters: Chapter[]): ChapterDto[] {
    return chapters.map(ChapterDtoMapper.toDto);
  }

  static toListDtoList(chapters: Chapter[]): ChapterListDto[] {
    return chapters.map(ChapterDtoMapper.toListDto);
  }
}
