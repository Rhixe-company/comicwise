"use server";

/**
 * Data Transfer Objects for comics actions
 * Centralized exports for comics server actions
 */

export {
  assignGenresToComic,
  createComic,
  deleteComic,
  getComicById,
  getComicGenres,
  getLatestComics,
  getPopularComics,
  listComics,
  updateComic,
} from "#actions/comics";
