import type * as schema from "@/database/schema";
import type { InferModel } from "drizzle-orm";

// Per-table model types (read / insert)
export type Users = InferModel<typeof schema.users>;
export type NewUsers = InferModel<typeof schema.users, "insert">;

export type Comics = InferModel<typeof schema.comics>;
export type NewComics = InferModel<typeof schema.comics, "insert">;

export type Chapters = InferModel<typeof schema.chapters>;
export type NewChapters = InferModel<typeof schema.chapters, "insert">;

export type User = InferModel<typeof schema.user>;
export type NewUser = InferModel<typeof schema.user, "insert">;

export type Account = InferModel<typeof schema.account>;
export type NewAccount = InferModel<typeof schema.account, "insert">;

export type Session = InferModel<typeof schema.session>;
export type NewSession = InferModel<typeof schema.session, "insert">;

export type VerificationToken = InferModel<typeof schema.verificationToken>;
export type NewVerificationToken = InferModel<typeof schema.verificationToken, "insert">;

export type Authenticator = InferModel<typeof schema.authenticator>;
export type NewAuthenticator = InferModel<typeof schema.authenticator, "insert">;

export type PasswordResetToken = InferModel<typeof schema.passwordResetToken>;
export type NewPasswordResetToken = InferModel<typeof schema.passwordResetToken, "insert">;

export type Type = InferModel<typeof schema.type>;
export type NewType = InferModel<typeof schema.type, "insert">;

export type Author = InferModel<typeof schema.author>;
export type NewAuthor = InferModel<typeof schema.author, "insert">;

export type Artist = InferModel<typeof schema.artist>;
export type NewArtist = InferModel<typeof schema.artist, "insert">;

export type Genre = InferModel<typeof schema.genre>;
export type NewGenre = InferModel<typeof schema.genre, "insert">;

export type Comic = InferModel<typeof schema.comic>;
export type NewComic = InferModel<typeof schema.comic, "insert">;

export type Chapter = InferModel<typeof schema.chapter>;
export type NewChapter = InferModel<typeof schema.chapter, "insert">;

export type ComicImage = InferModel<typeof schema.comicImage>;
export type NewComicImage = InferModel<typeof schema.comicImage, "insert">;

export type ChapterImage = InferModel<typeof schema.chapterImage>;
export type NewChapterImage = InferModel<typeof schema.chapterImage, "insert">;

export type ComicToGenre = InferModel<typeof schema.comicToGenre>;
export type NewComicToGenre = InferModel<typeof schema.comicToGenre, "insert">;

export type Bookmark = InferModel<typeof schema.bookmark>;
export type NewBookmark = InferModel<typeof schema.bookmark, "insert">;

export type Comment = InferModel<typeof schema.comment>;
export type NewComment = InferModel<typeof schema.comment, "insert">;

export type ReadingProgress = InferModel<typeof schema.readingProgress>;
export type NewReadingProgress = InferModel<typeof schema.readingProgress, "insert">;

// Re-export Database and Schema types for opt-in usage
export type Database = import("db").Database;
export type Schema = typeof import("database/schema");

// Convenience mapping of table names to model types
export interface TableModelMap {
  users: Users;
  comics: Comics;
  chapters: Chapters;
  user: User;
  account: Account;
  session: Session;
  verificationToken: VerificationToken;
  authenticator: Authenticator;
  passwordResetToken: PasswordResetToken;
  type: Type;
  author: Author;
  artist: Artist;
  genre: Genre;
  comic: Comic;
  chapter: Chapter;
  comicImage: ComicImage;
  chapterImage: ChapterImage;
  comicToGenre: ComicToGenre;
  bookmark: Bookmark;
  comment: Comment;
  readingProgress: ReadingProgress;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {};
