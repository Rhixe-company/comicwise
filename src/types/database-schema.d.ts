// Ambient module declarations for `database/schema` using `typeof import(...)`
// This avoids top-level imports and prevents duplicate symbol declarations
// while allowing the compiler to infer accurate types from the implementation.

declare module "database/schema" {
  export const users: typeof import("../database/schema").users;
  export const comics: typeof import("../database/schema").comics;
  export const chapters: typeof import("../database/schema").chapters;

  export const tsvector: typeof import("../database/schema").tsvector;

  export const userRole: typeof import("../database/schema").userRole;
  export const comicStatus: typeof import("../database/schema").comicStatus;

  export const user: typeof import("../database/schema").user;
  export const account: typeof import("../database/schema").account;
  export const session: typeof import("../database/schema").session;
  export const verificationToken: typeof import("../database/schema").verificationToken;
  export const authenticator: typeof import("../database/schema").authenticator;
  export const passwordResetToken: typeof import("../database/schema").passwordResetToken;

  export const type: typeof import("../database/schema").type;
  export const author: typeof import("../database/schema").author;
  export const artist: typeof import("../database/schema").artist;
  export const genre: typeof import("../database/schema").genre;
  export const comic: typeof import("../database/schema").comic;
  export const chapter: typeof import("../database/schema").chapter;
  export const comicImage: typeof import("../database/schema").comicImage;
  export const chapterImage: typeof import("../database/schema").chapterImage;
  export const comicToGenre: typeof import("../database/schema").comicToGenre;

  export const bookmark: typeof import("../database/schema").bookmark;
  export const comment: typeof import("../database/schema").comment;
  export const readingProgress: typeof import("../database/schema").readingProgress;

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
