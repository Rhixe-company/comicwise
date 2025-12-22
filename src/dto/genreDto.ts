/**
 * Genre Data Transfer Objects
 */

import type { Genre } from '#types/database-auto';

export interface GenreDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export class GenreDtoMapper {
  static toDto(genre: Genre): GenreDto {
    return {
      id: genre.id,
      name: genre.name,
      slug: genre.slug,
      description: genre.description,
      createdAt: genre.createdAt,
      updatedAt: genre.updatedAt,
    };
  }

  static toDtoList(genres: Genre[]): GenreDto[] {
    return genres.map(GenreDtoMapper.toDto);
  }
}
