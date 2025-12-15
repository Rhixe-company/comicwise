import { database } from "@/database";
import { chapter, comic, comicToGenre } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

interface CreateComicData {
  title: string;
  description: string;
  coverImage: string;
  status?: "Ongoing" | "Hiatus" | "Completed" | "Dropped" | "Coming Soon";
  publicationDate: Date;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds?: number[];
  slug?: string;
}

export async function createComic(data: CreateComicData) {
  const { genreIds, ...comicData } = data;
  const { slug: providedSlug, title } = comicData as { slug?: string; title: string };
  const slugModule = await import("lib/utils");
  const slugify = slugModule.slugify;
  const slug = providedSlug ?? slugify(title);

  const [newComic] = await database
    .insert(comic)
    .values({
      ...comicData,
      slug,
      status: comicData.status || "Ongoing",
      rating: "0",
      views: 0,
    })
    .returning();

  if (!newComic) {
    throw new Error("Failed to create comic");
  }

  if (genreIds && genreIds.length > 0) {
    await database.insert(comicToGenre).values(
      genreIds.map((genreId) => ({
        comicId: newComic.id,
        genreId,
      }))
    );
  }

  return newComic;
}

interface UpdateComicData {
  title?: string;
  description?: string;
  coverImage?: string;
  status?: "Ongoing" | "Hiatus" | "Completed" | "Dropped" | "Coming Soon";
  publicationDate?: Date;
  authorId?: number;
  artistId?: number;
  typeId?: number;
  genreIds?: number[];
}

export async function updateComic(comicId: number, data: UpdateComicData) {
  const { genreIds, ...updateData } = data;

  const [updatedComic] = await database
    .update(comic)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(comic.id, comicId))
    .returning();

  if (genreIds !== undefined) {
    await database.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

    if (genreIds.length > 0) {
      await database.insert(comicToGenre).values(
        genreIds.map((genreId) => ({
          comicId,
          genreId,
        }))
      );
    }
  }

  return updatedComic;
}

export async function deleteComic(comicId: number) {
  await database.delete(chapter).where(eq(chapter.comicId, comicId));

  await database.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

  const [deletedComic] = await database.delete(comic).where(eq(comic.id, comicId)).returning();

  return deletedComic;
}

export async function incrementViews(comicId: number) {
  const [updated] = await database
    .update(comic)
    .set({
      views: sql`${comic.views} + 1`,
    })
    .where(eq(comic.id, comicId))
    .returning();

  return updated;
}

export async function updateComicRating(comicId: number, newRating: number) {
  const [updated] = await database
    .update(comic)
    .set({
      rating: newRating.toFixed(2),
    })
    .where(eq(comic.id, comicId))
    .returning();

  return updated;
}
