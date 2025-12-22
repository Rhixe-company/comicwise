"use server";

/**
 * Data Transfer Objects for chapters actions
 * Centralized exports for chapters server actions
 */

export {
  createChapter,
  updateChapter,
  deleteChapter,
  getChapterById,
  listChapters,
  getChaptersByComic,
  addChapterImages,
  getChapterImages,
  getLatestChapters,
  getAdjacentChapters,
} from '#actions/chapters';
