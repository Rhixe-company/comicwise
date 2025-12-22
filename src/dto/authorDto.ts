/**
 * Author Data Transfer Objects
 */

import type { Author } from '#types/database-auto';

export interface AuthorDto {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface AuthorDetailDto extends AuthorDto {
  comicCount?: number;
}

export class AuthorDtoMapper {
  static toDto(author: Author): AuthorDto {
    return {
      id: author.id,
      name: author.name,
      slug: author.slug,
      bio: author.bio,
      image: author.image,
      createdAt: author.createdAt,
      updatedAt: author.updatedAt,
    };
  }

  static toDetailDto(author: Author, comicCount?: number): AuthorDetailDto {
    return {
      ...AuthorDtoMapper.toDto(author),
      comicCount,
    };
  }

  static toDtoList(authors: Author[]): AuthorDto[] {
    return authors.map(AuthorDtoMapper.toDto);
  }
}
