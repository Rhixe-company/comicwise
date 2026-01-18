import { pgTable, serial, text, timestamp, index, foreignKey, unique, numeric, integer, boolean, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const comicStatus = pgEnum("comic_status", ['Ongoing', 'Hiatus', 'Completed', 'Dropped', 'Season End', 'Coming Soon'])
export const userRole = pgEnum("user_role", ['user', 'admin', 'moderator'])


export const artist = pgTable("artist", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	bio: text(),
	image: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	searchVector: text(),
});

export const comic = pgTable("comic", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	description: text().notNull(),
	coverImage: text().notNull(),
	status: comicStatus().default('Ongoing').notNull(),
	publicationDate: timestamp({ mode: 'string' }).notNull(),
	rating: numeric({ precision: 10, scale:  1 }).default('0'),
	views: integer().default(0).notNull(),
	authorId: integer(),
	artistId: integer(),
	typeId: integer(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	searchVector: text(),
}, (table) => [
	index("comicArtistIdx").using("btree", table.artistId.asc().nullsLast().op("int4_ops")),
	index("comicAuthorIdx").using("btree", table.authorId.asc().nullsLast().op("int4_ops")),
	index("comicCreatedAtIdx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("comicRatingIdx").using("btree", table.rating.asc().nullsLast().op("numeric_ops")),
	index("comicSlugIdx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("comicStatusIdx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("comicTitleIdx").using("btree", table.title.asc().nullsLast().op("text_ops")),
	index("comicTypeIdx").using("btree", table.typeId.asc().nullsLast().op("int4_ops")),
	index("comicViewsIdx").using("btree", table.views.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [author.id],
			name: "comic_authorId_author_id_fk"
		}),
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artist.id],
			name: "comic_artistId_artist_id_fk"
		}),
	foreignKey({
			columns: [table.typeId],
			foreignColumns: [type.id],
			name: "comic_typeId_type_id_fk"
		}),
	unique("comic_title_unique").on(table.title),
	unique("comic_slug_unique").on(table.slug),
]);

export const chapterImage = pgTable("chapterImage", {
	id: serial().primaryKey().notNull(),
	chapterId: integer().notNull(),
	imageUrl: text().notNull(),
	pageNumber: integer().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("chapterImageChapterIdIdx").using("btree", table.chapterId.asc().nullsLast().op("int4_ops")),
	index("chapterImagePageNumberIdx").using("btree", table.pageNumber.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapter.id],
			name: "chapterImage_chapterId_chapter_id_fk"
		}).onDelete("cascade"),
]);

export const author = pgTable("author", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	bio: text(),
	image: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	searchVector: text(),
});

export const chapter = pgTable("chapter", {
	id: serial().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	chapterNumber: integer().notNull(),
	releaseDate: timestamp({ mode: 'string' }).notNull(),
	comicId: integer().notNull(),
	views: integer().default(0).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("chapterComicChapterIdx").using("btree", table.comicId.asc().nullsLast().op("int4_ops"), table.chapterNumber.asc().nullsLast().op("int4_ops")),
	index("chapterComicIdIdx").using("btree", table.comicId.asc().nullsLast().op("int4_ops")),
	index("chapterNumberIdx").using("btree", table.chapterNumber.asc().nullsLast().op("int4_ops")),
	index("chapterReleaseDateIdx").using("btree", table.releaseDate.asc().nullsLast().op("timestamp_ops")),
	index("chapterSlugIdx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.comicId],
			foreignColumns: [comic.id],
			name: "chapter_comicId_comic_id_fk"
		}).onDelete("cascade"),
]);

export const comment = pgTable("comment", {
	id: serial().primaryKey().notNull(),
	content: text().notNull(),
	userId: text().notNull(),
	chapterId: integer().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("commentChapterIdIdx").using("btree", table.chapterId.asc().nullsLast().op("int4_ops")),
	index("commentCreatedAtIdx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("commentUserIdIdx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "comment_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapter.id],
			name: "comment_chapterId_chapter_id_fk"
		}).onDelete("cascade"),
]);

export const comicImage = pgTable("comicImage", {
	id: serial().primaryKey().notNull(),
	comicId: integer().notNull(),
	imageUrl: text().notNull(),
	imageOrder: integer().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.comicId],
			foreignColumns: [comic.id],
			name: "comicImage_comicId_comic_id_fk"
		}).onDelete("cascade"),
]);

export const genre = pgTable("genre", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("genre_name_unique").on(table.name),
]);

export const passwordResetToken = pgTable("passwordResetToken", {
	id: text().primaryKey().notNull(),
	email: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	unique("passwordResetToken_token_unique").on(table.token),
]);

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
	role: userRole().default('user').notNull(),
	status: boolean().default(false).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("userEmailIdx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("userRoleIdx").using("btree", table.role.asc().nullsLast().op("enum_ops")),
	unique("user_email_unique").on(table.email),
]);

export const type = pgTable("type", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("type_name_unique").on(table.name),
]);

export const readingProgress = pgTable("readingProgress", {
	id: serial().primaryKey().notNull(),
	userId: text().notNull(),
	comicId: integer().notNull(),
	chapterId: integer().notNull(),
	pageNumber: integer().default(0).notNull(),
	scrollPosition: integer().default(0).notNull(),
	totalPages: integer().default(0).notNull(),
	progressPercent: integer().default(0).notNull(),
	completedAt: timestamp({ mode: 'string' }),
	lastReadAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("readingProgressChapterIdIdx").using("btree", table.chapterId.asc().nullsLast().op("int4_ops")),
	index("readingProgressComicIdIdx").using("btree", table.comicId.asc().nullsLast().op("int4_ops")),
	index("readingProgressLastReadIdx").using("btree", table.lastReadAt.asc().nullsLast().op("timestamp_ops")),
	index("readingProgressUserComicIdx").using("btree", table.userId.asc().nullsLast().op("int4_ops"), table.comicId.asc().nullsLast().op("text_ops")),
	index("readingProgressUserIdIdx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "readingProgress_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.comicId],
			foreignColumns: [comic.id],
			name: "readingProgress_comicId_comic_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapter.id],
			name: "readingProgress_chapterId_chapter_id_fk"
		}).onDelete("cascade"),
]);

export const comicToGenre = pgTable("comicToGenre", {
	comicId: integer().notNull(),
	genreId: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.comicId],
			foreignColumns: [comic.id],
			name: "comicToGenre_comicId_comic_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.genreId],
			foreignColumns: [genre.id],
			name: "comicToGenre_genreId_genre_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.genreId, table.comicId], name: "comicToGenre_comicId_genreId_pk"}),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.token, table.identifier], name: "verificationToken_identifier_token_pk"}),
]);

export const bookmark = pgTable("bookmark", {
	userId: text().notNull(),
	comicId: integer().notNull(),
	lastReadChapterId: integer(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("bookmarkComicIdIdx").using("btree", table.comicId.asc().nullsLast().op("int4_ops")),
	index("bookmarkUserIdIdx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "bookmark_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.comicId],
			foreignColumns: [comic.id],
			name: "bookmark_comicId_comic_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.lastReadChapterId],
			foreignColumns: [chapter.id],
			name: "bookmark_lastReadChapterId_chapter_id_fk"
		}),
	primaryKey({ columns: [table.userId, table.comicId], name: "bookmark_userId_comicId_pk"}),
]);

export const authenticator = pgTable("authenticator", {
	credentialId: text().notNull(),
	userId: text().notNull(),
	providerAccountId: text().notNull(),
	credentialPublicKey: text().notNull(),
	counter: integer().notNull(),
	credentialDeviceType: text().notNull(),
	credentialBackedUp: boolean().notNull(),
	transports: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "authenticator_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.credentialId], name: "authenticator_userId_credentialID_pk"}),
	unique("authenticator_credentialID_unique").on(table.credentialId),
]);

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.providerAccountId, table.provider], name: "account_provider_providerAccountId_pk"}),
]);
