/**
 * Comic Data Transfer Objects
 * Handles data transformation for comic entities
 */

import type { Comic, Genre, Author, Artist } from '#types/database-auto';

export interface ComicDto {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  status: string;
  type: string;
  rating: string;
  views: number;
  releaseYear: number | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ComicDetailDto extends ComicDto {
  genres?: Genre[];
  authors?: Author[];
  artists?: Artist[];
  chapterCount?: number;
  latestChapter?: {
    id: string;
    title: string;
    number: number;
    slug: string;
  };
}

export interface ComicCardDto {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  rating: string;
  views: number;
  latestChapterNumber?: number;
}

export class ComicDtoMapper {
  static toDto(comic: Comic): ComicDto {
    return {
      id: comic.id,
      title: comic.title,
      slug: comic.slug,
      description: comic.description,
      coverImage: comic.coverImage,
      status: comic.status,
      type: comic.type,
      rating: comic.rating,
      views: comic.views,
      releaseYear: comic.releaseYear,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
    };
  }

  static toDetailDto(
    comic: Comic,
    relations?: {
      genres?: Genre[];
      authors?: Author[];
      artists?: Artist[];
      chapterCount?: number;
      latestChapter?: { id: string; title: string; number: number; slug: string };
    }
  ): ComicDetailDto {
    return {
      ...ComicDtoMapper.toDto(comic),
      genres: relations?.genres,
      authors: relations?.authors,
      artists: relations?.artists,
      chapterCount: relations?.chapterCount,
      latestChapter: relations?.latestChapter,
    };
  }

  static toCardDto(comic: Comic, latestChapterNumber?: number): ComicCardDto {
    return {
      id: comic.id,
      title: comic.title,
      slug: comic.slug,
      coverImage: comic.coverImage,
      rating: comic.rating,
      views: comic.views,
      latestChapterNumber,
    };
  }

  static toDtoList(comics: Comic[]): ComicDto[] {
    return comics.map(ComicDtoMapper.toDto);
  }

  static toCardDtoList(comics: Comic[]): ComicCardDto[] {
    return comics.map((comic) => ComicDtoMapper.toCardDto(comic));
  }
}
