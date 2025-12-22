/**
 * Bookmark Data Transfer Objects
 */

import type { Bookmark } from '#types/database-auto';
import type { ComicCardDto } from './comicDto';

export interface BookmarkDto {
  id: string;
  userId: string;
  comicId: string;
  createdAt: Date;
}

export interface BookmarkDetailDto extends BookmarkDto {
  comic?: ComicCardDto;
}

export class BookmarkDtoMapper {
  static toDto(bookmark: Bookmark): BookmarkDto {
    return {
      id: bookmark.id,
      userId: bookmark.userId,
      comicId: bookmark.comicId,
      createdAt: bookmark.createdAt,
    };
  }

  static toDetailDto(bookmark: Bookmark, comic?: ComicCardDto): BookmarkDetailDto {
    return {
      ...BookmarkDtoMapper.toDto(bookmark),
      comic,
    };
  }

  static toDtoList(bookmarks: Bookmark[]): BookmarkDto[] {
    return bookmarks.map(BookmarkDtoMapper.toDto);
  }
}
