"use server";

/**
 * Data Transfer Objects for comics actions
 * Centralized exports for comics server actions
 */

export {
  createComic,
  updateComic,
  deleteComic,
  getComicById,
  listComics,
  assignGenresToComic,
  getComicGenres,
  getPopularComics,
  getLatestComics,
} from '#actions/comics';
