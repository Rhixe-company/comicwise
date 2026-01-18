import { relations } from "drizzle-orm/relations";
import { author, comic, artist, type, chapter, chapterImage, user, comment, comicImage, session, readingProgress, comicToGenre, genre, bookmark, authenticator, account } from "./schema";

export const comicRelations = relations(comic, ({one, many}) => ({
	author: one(author, {
		fields: [comic.authorId],
		references: [author.id]
	}),
	artist: one(artist, {
		fields: [comic.artistId],
		references: [artist.id]
	}),
	type: one(type, {
		fields: [comic.typeId],
		references: [type.id]
	}),
	chapters: many(chapter),
	comicImages: many(comicImage),
	readingProgresses: many(readingProgress),
	comicToGenres: many(comicToGenre),
	bookmarks: many(bookmark),
}));

export const authorRelations = relations(author, ({many}) => ({
	comics: many(comic),
}));

export const artistRelations = relations(artist, ({many}) => ({
	comics: many(comic),
}));

export const typeRelations = relations(type, ({many}) => ({
	comics: many(comic),
}));

export const chapterImageRelations = relations(chapterImage, ({one}) => ({
	chapter: one(chapter, {
		fields: [chapterImage.chapterId],
		references: [chapter.id]
	}),
}));

export const chapterRelations = relations(chapter, ({one, many}) => ({
	chapterImages: many(chapterImage),
	comic: one(comic, {
		fields: [chapter.comicId],
		references: [comic.id]
	}),
	comments: many(comment),
	readingProgresses: many(readingProgress),
	bookmarks: many(bookmark),
}));

export const commentRelations = relations(comment, ({one}) => ({
	user: one(user, {
		fields: [comment.userId],
		references: [user.id]
	}),
	chapter: one(chapter, {
		fields: [comment.chapterId],
		references: [chapter.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	comments: many(comment),
	sessions: many(session),
	readingProgresses: many(readingProgress),
	bookmarks: many(bookmark),
	authenticators: many(authenticator),
	accounts: many(account),
}));

export const comicImageRelations = relations(comicImage, ({one}) => ({
	comic: one(comic, {
		fields: [comicImage.comicId],
		references: [comic.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const readingProgressRelations = relations(readingProgress, ({one}) => ({
	user: one(user, {
		fields: [readingProgress.userId],
		references: [user.id]
	}),
	comic: one(comic, {
		fields: [readingProgress.comicId],
		references: [comic.id]
	}),
	chapter: one(chapter, {
		fields: [readingProgress.chapterId],
		references: [chapter.id]
	}),
}));

export const comicToGenreRelations = relations(comicToGenre, ({one}) => ({
	comic: one(comic, {
		fields: [comicToGenre.comicId],
		references: [comic.id]
	}),
	genre: one(genre, {
		fields: [comicToGenre.genreId],
		references: [genre.id]
	}),
}));

export const genreRelations = relations(genre, ({many}) => ({
	comicToGenres: many(comicToGenre),
}));

export const bookmarkRelations = relations(bookmark, ({one}) => ({
	user: one(user, {
		fields: [bookmark.userId],
		references: [user.id]
	}),
	comic: one(comic, {
		fields: [bookmark.comicId],
		references: [comic.id]
	}),
	chapter: one(chapter, {
		fields: [bookmark.lastReadChapterId],
		references: [chapter.id]
	}),
}));

export const authenticatorRelations = relations(authenticator, ({one}) => ({
	user: one(user, {
		fields: [authenticator.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));