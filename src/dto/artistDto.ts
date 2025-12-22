/**
 * Artist Data Transfer Objects
 */

import type { Artist } from '#types/database-auto';

export interface ArtistDto {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ArtistDetailDto extends ArtistDto {
  comicCount?: number;
}

export class ArtistDtoMapper {
  static toDto(artist: Artist): ArtistDto {
    return {
      id: artist.id,
      name: artist.name,
      slug: artist.slug,
      bio: artist.bio,
      image: artist.image,
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt,
    };
  }

  static toDetailDto(artist: Artist, comicCount?: number): ArtistDetailDto {
    return {
      ...ArtistDtoMapper.toDto(artist),
      comicCount,
    };
  }

  static toDtoList(artists: Artist[]): ArtistDto[] {
    return artists.map(ArtistDtoMapper.toDto);
  }
}
