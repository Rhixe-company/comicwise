/**
 * Genres and Types Combined DTOs
 * Data Transfer Objects for combined genre and type operations
 */

import type { GenreDto } from "./genresDto";
import type { TypeDto } from "./typesDto";

export type GenresTypesDto = {
  genres: GenreDto[];
  types: TypeDto[];
};

export type GenresTypesWithCountsDto = {
  genres: Array<GenreDto & { comicCount: number }>;
  types: Array<TypeDto & { comicCount: number }>;
};

export type { GenreDto, TypeDto };
export type { CreateGenreDto, UpdateGenreDto } from "./genresDto";
export type { CreateTypeDto, UpdateTypeDto } from "./typesDto";

export { getAllGenres, getAllTypes } from "#lib/actions/genresTypes";
