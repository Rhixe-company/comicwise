"use server";

/**
 * Centralized DTO exports
 * Re-export all DTO modules for easy importing
 */

export * from "./artistsDto";
export * from "./authDto";
export * from "./authorsDto";
export * from "./bookmarkDto";
export {
  createComment as createBookmarkComment,
  deleteComment as deleteBookmarkComment,
  updateComment as updateBookmarkComment,
} from "./bookmarksCommentsDto";
export * from "./chaptersDto";
export * from "./comicsDto";
export * from "./commentsDto";
export {
  createType as createContentType,
  createGenre as createGenreType,
  deleteType as deleteContentType,
  deleteGenre as deleteGenreType,
  updateType as updateContentType,
  updateGenre as updateGenreType,
} from "./genresTypesDto";
export * from "./typesDto";
export * from "./usersDto";
export * from "./usersManagementDto";
export * from "./workflowDto";
