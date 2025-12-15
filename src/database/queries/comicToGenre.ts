import { database } from "@/database";
import { comicToGenre } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function getComicGenres(comicId: number) {
  return await database.query.comicToGenre.findMany({
    where: eq(comicToGenre.comicId, comicId),
    with: {
      genre: true,
    },
  });
}

export async function getGenreComics(genreId: number) {
  return await database.query.comicToGenre.findMany({
    where: eq(comicToGenre.genreId, genreId),
    with: {
      comic: true,
    },
  });
}
