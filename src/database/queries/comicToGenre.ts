import { eq } from "drizzle-orm";

import { comicToGenre } from "#schema";
import { db as database } from "@/database/db";

/**
 *
 * @param comicId
 */
export async function getComicGenres(comicId: number) {
  return await database.query.comicToGenre.findMany({
    where: eq(comicToGenre.comicId, comicId),
    with: {
      genre: true,
    },
  });
}

/**
 *
 * @param genreId
 */
export async function getGenreComics(genreId: number) {
  return await database.query.comicToGenre.findMany({
    where: eq(comicToGenre.genreId, genreId),
    with: {
      comic: true,
    },
  });
}
