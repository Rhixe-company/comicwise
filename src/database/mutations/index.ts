// ═══════════════════════════════════════════════════
// AUTH MUTATIONS
// ═══════════════════════════════════════════════════
export * from "mutations/accounts";
export * from "mutations/authenticators";
export * from "mutations/passwordResetToken";
export * from "mutations/sessions";
export * from "mutations/verificationTokens";

// ═══════════════════════════════════════════════════
// USER MUTATIONS
// ═══════════════════════════════════════════════════
export * from "mutations/users";

// ═══════════════════════════════════════════════════
// COMIC CONTENT MUTATIONS
// ═══════════════════════════════════════════════════
export * from "mutations/artists";
export * from "mutations/authors";
export * from "mutations/chapterImages";
export {
  addChapterImage,
  addChapterImages,
  createChapter,
  deleteChapter,
  incrementChapterViews,
  updateChapter,
} from "mutations/chapters";
export * from "mutations/comicImages";
export * from "mutations/comics";
export * from "mutations/comicToGenre";
export * from "mutations/genres";
export * from "mutations/types";

// ═══════════════════════════════════════════════════
// INTERACTION MUTATIONS
// ═══════════════════════════════════════════════════
export * from "mutations/bookmarks";
export * from "mutations/comments";
