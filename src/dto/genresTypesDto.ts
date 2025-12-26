/**
 * Genres and Types Combined DTOs
 * Data Transfer Objects for combined genre and type operations
 */

import type { GenreDto } from "dto/genresDto";
import type { TypeDto } from "dto/typesDto";

export type GenresTypesDto = {
  genres: GenreDto[];
  types: TypeDto[];
};

export type GenresTypesWithCountsDto = {
  genres: Array<GenreDto & { comicCount: number }>;
  types: Array<TypeDto & { comicCount: number }>;
};

export type { CreateGenreDto, UpdateGenreDto } from "dto/genresDto";
export type { CreateTypeDto, UpdateTypeDto } from "dto/typesDto";
export type { GenreDto, TypeDto };

export { getAllGenres, getAllTypes } from "actions/genresTypes";
