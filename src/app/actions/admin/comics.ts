"use server";

import { db } from "@/database/db";
import { comic, comicToGenre } from '#schema';
import { slugify } from 'utils';
import { comicFormSchema, type ComicFormData } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createComicAction(data: ComicFormData) {
  try {
    const validated = comicFormSchema.parse(data);

    const slug = validated.slug || slugify(validated.title);

    // Check if slug already exists
    const existing = await db
      .select({ id: comic.id })
      .from(comic)
      .where(eq(comic.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "A comic with this slug already exists" };
    }

    const [newComic] = await db
      .insert(comic)
      .values({
        title: validated.title,
        slug,
        description: validated.description,
        coverImage: validated.coverImage,
        status: validated.status,
        publicationDate: validated.publicationDate,
        authorId: validated.authorId ? parseInt(validated.authorId) : null,
        artistId: validated.artistId ? parseInt(validated.artistId) : null,
        typeId: validated.typeId ? parseInt(validated.typeId) : null,
        views: 0,
        rating: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newComic) {
      return { success: false, error: "Failed to create comic" };
    }

    // Handle genres if provided
    if (validated.genreIds && validated.genreIds.length > 0) {
      await db.insert(comicToGenre).values(
        validated.genreIds.map((genreId) => ({
          comicId: newComic.id,
          genreId: parseInt(genreId),
        }))
      );
    }

    redirect(`/admin/comics/${newComic.id}`);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create comic",
    };
  }
}

export async function updateComicAction(comicId: number, data: ComicFormData) {
  try {
    const validated = comicFormSchema.parse(data);

    const slug = validated.slug || slugify(validated.title);

    // Check if slug already exists (but exclude current comic)
    const existing = await db
      .select({ id: comic.id })
      .from(comic)
      .where(eq(comic.slug, slug))
      .limit(1);

    if (existing.length > 0 && existing[0]?.id !== comicId) {
      return { success: false, error: "A comic with this slug already exists" };
    }

    const [updated] = await db
      .update(comic)
      .set({
        title: validated.title,
        slug,
        description: validated.description,
        coverImage: validated.coverImage,
        status: validated.status,
        publicationDate: validated.publicationDate,
        authorId: validated.authorId ? parseInt(validated.authorId) : null,
        artistId: validated.artistId ? parseInt(validated.artistId) : null,
        typeId: validated.typeId ? parseInt(validated.typeId) : null,
        updatedAt: new Date(),
      })
      .where(eq(comic.id, comicId))
      .returning();

    if (!updated) {
      return { success: false, error: "Comic not found" };
    }

    // Update genres if provided
    if (validated.genreIds !== undefined) {
      await db.delete(comicToGenre).where(eq(comicToGenre.comicId, comicId));

      if (validated.genreIds.length > 0) {
        await db.insert(comicToGenre).values(
          validated.genreIds.map((genreId) => ({
            comicId,
            genreId: parseInt(genreId),
          }))
        );
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update comic",
    };
  }
}

export async function deleteComicAction(comicId: number) {
  try {
    const [deleted] = await db.delete(comic).where(eq(comic.id, comicId)).returning();

    if (!deleted) {
      return { success: false, error: "Comic not found" };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comic",
    };
  }
}

export async function deleteComicsAction(comicIds: number[]) {
  try {
    const firstId = comicIds[0];
    if (!firstId) {
      return { success: false, error: "No IDs provided" };
    }
    const result = await db.delete(comic).where(eq(comic.id, firstId)).returning();

    if (result.length === 0) {
      return { success: false, error: "No comics deleted" };
    }

    return { success: true, deletedCount: result.length };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comics",
    };
  }
}
