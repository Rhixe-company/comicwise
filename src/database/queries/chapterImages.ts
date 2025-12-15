import { database } from "@/database";
import { chapterImage } from "@/database/schema";
import { asc, eq } from "drizzle-orm";

export async function getChapterImageById(imageId: number) {
  return await database.query.chapterImage.findFirst({
    where: eq(chapterImage.id, imageId),
  });
}

export async function getChapterImages(chapterId: number) {
  return await database.query.chapterImage.findMany({
    where: eq(chapterImage.chapterId, chapterId),
    orderBy: asc(chapterImage.pageNumber),
  });
}

export async function getChapterImageCount(chapterId: number) {
  const images = await database
    .select()
    .from(chapterImage)
    .where(eq(chapterImage.chapterId, chapterId));
  return images.length;
}
