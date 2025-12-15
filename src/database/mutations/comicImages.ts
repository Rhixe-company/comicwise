import { database } from "@/database";
import { comicImage } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function createComicImage(data: {
  comicId: number;
  imageUrl: string;
  imageOrder: number;
}) {
  const [newImage] = await database
    .insert(comicImage)
    .values({
      comicId: data.comicId,
      imageUrl: data.imageUrl,
      imageOrder: data.imageOrder,
      createdAt: new Date(),
    })
    .returning();
  return newImage;
}

export async function createComicImages(
  images: Array<{
    comicId: number;
    imageUrl: string;
    imageOrder: number;
  }>
) {
  const newImages = await database
    .insert(comicImage)
    .values(
      images.map((img) => ({
        ...img,
        createdAt: new Date(),
      }))
    )
    .returning();
  return newImages;
}

export async function updateComicImage(
  imageId: number,
  data: {
    imageUrl?: string;
    imageOrder?: number;
  }
) {
  const [updatedImage] = await database
    .update(comicImage)
    .set(data)
    .where(eq(comicImage.id, imageId))
    .returning();
  return updatedImage;
}

export async function deleteComicImage(imageId: number) {
  const [deletedImage] = await database
    .delete(comicImage)
    .where(eq(comicImage.id, imageId))
    .returning();
  return deletedImage;
}

export async function deleteComicImages(comicId: number) {
  const deletedImages = await database
    .delete(comicImage)
    .where(eq(comicImage.comicId, comicId))
    .returning();
  return deletedImages;
}
