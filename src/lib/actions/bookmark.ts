"use server";

import { auth } from "auth";
import {
  addBookmark as addBookmarkMutation,
  removeBookmark as removeBookmarkMutation,
  updateReadingProgress as updateReadingProgressMutation,
} from "database/mutations";
import { getUserBookmarks } from "database/queries";
import { revalidatePath } from "next/cache";

export async function addBookmark(comicId: number, chapterId?: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await addBookmarkMutation(session.user.id, comicId, chapterId);
  revalidatePath("/bookmarks");
  revalidatePath(`/comics/${comicId}`);

  return { success: true };
}

export async function removeBookmark(comicId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await removeBookmarkMutation(session.user.id, comicId);
  revalidatePath("/bookmarks");
  revalidatePath(`/comics/${comicId}`);

  return { success: true };
}

export async function updateProgress(comicId: number, chapterId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await updateReadingProgressMutation(session.user.id, comicId, chapterId);
  revalidatePath("/bookmarks");

  return { success: true };
}

export async function getBookmarks() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return await getUserBookmarks(session.user.id);
}
