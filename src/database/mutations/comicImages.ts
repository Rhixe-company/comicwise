import { eq } from "drizzle-orm";

import { db } from "@/database/db";
import { comicImage } from "@/database/schema";

import type { InferSelectModel } from "drizzle-orm";

/**
 *
 * param data
 * param data.comicId
 * param data.imageUrl
 * param data.imageOrder
 * @param data
 * @param data.comicId
 * @param data.imageUrl
 * @param data.imageOrder
 */
export async function createComicImage(data: {
  comicId: number;
  imageOrder: number;
  imageUrl: string;
}): Promise<InferSelectModel<typeof comicImage>> {
  const [newImage] = await db
    .insert(comicImage)
    .values({
      comicId: data.comicId,
      imageUrl: data.imageUrl,
      imageOrder: data.imageOrder,
      createdAt: new Date(),
    })
    .returning();
  return newImage!;
}

/**
 *
 * param images
 * @param images
 */
export async function createComicImages(
  images: Array<{
    comicId: number;
    imageOrder: number;
    imageUrl: string;
  }>
): Promise<InferSelectModel<typeof comicImage>[]> {
  return await db
    .insert(comicImage)
    .values(
      images.map((img) => ({
        ...img,
        createdAt: new Date(),
      }))
    )
    .returning();
}

/**
 *
 * param imageId
 * param data
 * param data.imageUrl
 * param data.imageOrder
 * @param imageId
 * @param data
 * @param data.imageUrl
 * @param data.imageOrder
 */
export async function updateComicImage(
  imageId: number,
  data: {
    imageOrder?: number;
    imageUrl?: string;
  }
): Promise<InferSelectModel<typeof comicImage> | undefined> {
  const [updatedImage] = await db
    .update(comicImage)
    .set(data)
    .where(eq(comicImage.id, imageId))
    .returning();
  return updatedImage;
}

/**
 *
 * param imageId
 * @param imageId
 */
export async function deleteComicImage(
  imageId: number
): Promise<InferSelectModel<typeof comicImage> | undefined> {
  const [deletedImage] = await db.delete(comicImage).where(eq(comicImage.id, imageId)).returning();
  return deletedImage;
}

/**
 *
 * param comicId
 * @param comicId
 */
export async function deleteComicImages(
  comicId: number
): Promise<InferSelectModel<typeof comicImage>[]> {
  return await db.delete(comicImage).where(eq(comicImage.comicId, comicId)).returning();
}
