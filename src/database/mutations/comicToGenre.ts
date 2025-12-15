import { database } from "@/database";
import { comicToGenre } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export async function addGenreToComic(comicId: number, genreId: number) {
  const [newRelation] = await database
    .insert(comicToGenre)
    .values({
      comicId,
      genreId,
    })
    .returning();
  return newRelation;
}

export async function addGenresToComic(comicId: number, genreIds: number[]) {
  const relations = await database
    .insert(comicToGenre)
    .values(genreIds.map((genreId) => ({ comicId, genreId })))
    .returning();
  return relations;
}

export async function removeGenreFromComic(comicId: number, genreId: number) {
  const [deletedRelation] = await database
    .delete(comicToGenre)
    .where(and(eq(comicToGenre.comicId, comicId), eq(comicToGenre.genreId, genreId)))
    .returning();
  return deletedRelation;
}

export async function removeAllGenresFromComic(comicId: number) {
  const deletedRelations = await database
    .delete(comicToGenre)
    .where(eq(comicToGenre.comicId, comicId))
    .returning();
  return deletedRelations;
}

export async function updateComicGenres(comicId: number, genreIds: number[]) {
  // Remove existing genres
  await database.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

  // Add new genres
  if (genreIds.length > 0) {
    return await addGenresToComic(comicId, genreIds);
  }
  return [];
}
