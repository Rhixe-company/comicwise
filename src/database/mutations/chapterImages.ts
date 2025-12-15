import { database } from "@/database";
import { chapterImage } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function createChapterImage(data: {
  chapterId: number;
  imageUrl: string;
  pageNumber: number;
}) {
  const [newImage] = await database
    .insert(chapterImage)
    .values({
      chapterId: data.chapterId,
      imageUrl: data.imageUrl,
      pageNumber: data.pageNumber,
      createdAt: new Date(),
    })
    .returning();
  return newImage;
}

export async function createChapterImages(
  images: Array<{
    chapterId: number;
    imageUrl: string;
    pageNumber: number;
  }>
) {
  const newImages = await database
    .insert(chapterImage)
    .values(
      images.map((img) => ({
        ...img,
        createdAt: new Date(),
      }))
    )
    .returning();
  return newImages;
}

export async function updateChapterImage(
  imageId: number,
  data: {
    imageUrl?: string;
    pageNumber?: number;
  }
) {
  const [updatedImage] = await database
    .update(chapterImage)
    .set(data)
    .where(eq(chapterImage.id, imageId))
    .returning();
  return updatedImage;
}

export async function deleteChapterImage(imageId: number) {
  const [deletedImage] = await database
    .delete(chapterImage)
    .where(eq(chapterImage.id, imageId))
    .returning();
  return deletedImage;
}

export async function deleteChapterImages(chapterId: number) {
  const deletedImages = await database
    .delete(chapterImage)
    .where(eq(chapterImage.chapterId, chapterId))
    .returning();
  return deletedImages;
}
