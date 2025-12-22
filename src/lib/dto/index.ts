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
  updateComment as updateBookmarkComment,
  deleteComment as deleteBookmarkComment,
} from "./bookmarksCommentsDto";
export * from "./chaptersDto";
export * from "./comicsDto";
export * from "./commentsDto";
export {
  createGenre as createGenreType,
  updateGenre as updateGenreType,
  deleteGenre as deleteGenreType,
  createType as createContentType,
  updateType as updateContentType,
  deleteType as deleteContentType,
} from "./genresTypesDto";
export * from "./typesDto";
export * from "./usersDto";
export * from "./typesDto";
export * from "./usersDto";
export * from "./usersManagementDto";
export * from "./workflowDto";
