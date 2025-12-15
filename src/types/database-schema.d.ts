// Ambient module declarations for `database/schema` using explicit type imports
// This avoids top-level imports and prevents duplicate symbol declarations
// while allowing the compiler to infer accurate types from the implementation.

import type {
  account as AccountType,
  artist as ArtistType,
  authenticator as AuthenticatorType,
  author as AuthorType,
  bookmark as BookmarkType,
  chapterImage as ChapterImageType,
  chapters as ChaptersType,
  chapter as ChapterType,
  comicImage as ComicImageType,
  comicStatus as ComicStatusType,
  comics as ComicsType,
  comicToGenre as ComicToGenreType,
  comic as ComicType,
  comment as CommentType,
  genre as GenreType,
  passwordResetToken as PasswordResetTokenType,
  readingProgress as ReadingProgressType,
  session as SessionType,
  tsvector as TsvectorType,
  type as TypeType,
  userRole as UserRoleType,
  users as UsersType,
  user as UserType,
  verificationToken as VerificationTokenType,
} from "../database/schema";

declare module "database/schema" {
  export const users: typeof UsersType;
  export const comics: typeof ComicsType;
  export const chapters: typeof ChaptersType;

  export const tsvector: typeof TsvectorType;

  export const userRole: typeof UserRoleType;
  export const comicStatus: typeof ComicStatusType;

  export const user: typeof UserType;
  export const account: typeof AccountType;
  export const session: typeof SessionType;
  export const verificationToken: typeof VerificationTokenType;
  export const authenticator: typeof AuthenticatorType;
  export const passwordResetToken: typeof PasswordResetTokenType;

  export const type: typeof TypeType;
  export const author: typeof AuthorType;
  export const artist: typeof ArtistType;
  export const genre: typeof GenreType;
  export const comic: typeof ComicType;
  export const chapter: typeof ChapterType;
  export const comicImage: typeof ComicImageType;
  export const chapterImage: typeof ChapterImageType;
  export const comicToGenre: typeof ComicToGenreType;

  export const bookmark: typeof BookmarkType;
  export const comment: typeof CommentType;
  export const readingProgress: typeof ReadingProgressType;

  // Utility relation types (keep permissive until we derive full relation types)
  export type ComicWithRelations = any;
  export type ChapterWithRelations = any;
  export type UserWithRelations = any;
}

// Note: The `database` / `db` modules are implemented in `src/database/index.ts` and
// `src/database/db.ts` respectively. They export the concrete `database` instance and
// `Database` type — ambient declarations for those modules are not added here to avoid
// redeclaration conflicts. If you still need lightweight aliases, create `src/types/database.ts`
// which imports the real types from `src/database/db` and re-exports them.
