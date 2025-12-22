"use server";

/**
 * Data Transfer Objects for chapters actions
 * Centralized exports for chapters server actions
 */

export {
  addChapterImages,
  createChapter,
  deleteChapter,
  getAdjacentChapters,
  getChapterById,
  getChapterImages,
  getChaptersByComic,
  getLatestChapters,
  listChapters,
  updateChapter,
} from "#actions/chapters";
