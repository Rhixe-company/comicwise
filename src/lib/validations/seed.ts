import { z } from "zod";

// ═══════════════════════════════════════════════════
// USER VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const userSeedSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    emailVerified: z.coerce.date().nullable().optional(),
    image: z.string().nullable().optional(),
    password: z.string().optional(),
    role: z.enum(["user", "admin", "moderator"]).default("user"),
    status: z.boolean().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    lastActivityDate: z.coerce.date().nullable().optional(),
  })
  .strict();

export const userArraySchema = z.array(userSeedSchema);

// ═══════════════════════════════════════════════════
// METADATA VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const typeSeedSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
  })
  .strict();

export const authorSeedSchema = z
  .object({
    name: z.string().min(1),
    bio: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
  })
  .strict();

export const artistSeedSchema = z
  .object({
    name: z.string().min(1),
    bio: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
  })
  .strict();

export const genreSeedSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
  })
  .strict();

// ═══════════════════════════════════════════════════
// COMIC VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const imageSchema = z
  .object({
    url: z.string().url(),
    path: z.string().optional(),
    checksum: z.string().optional(),
    status: z.string().optional(),
  })
  .strict();

export const comicSeedSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().optional(),
    description: z.string().default(""),
    serialization: z.string().optional(),
    author: z
      .union([
        z.string(),
        z
          .object({
            name: z.string(),
          })
          .strict(),
      ])
      .optional(),
    artist: z
      .union([
        z.string(),
        z
          .object({
            name: z.string(),
          })
          .strict(),
      ])
      .optional(),
    rating: z.coerce.number().min(0).max(10).optional(),
    status: z.enum(["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"]).default("Ongoing"),
    category: z.string().optional(),
    type: z
      .union([
        z.string(),
        z
          .object({
            name: z.string(),
          })
          .strict(),
      ])
      .optional(),
    genres: z
      .array(
        z.union([
          z.string(),
          z
            .object({
              name: z.string(),
            })
            .strict(),
        ])
      )
      .default([]),
    updated_at: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    url: z.string().url().optional(),
    image_urls: z.array(z.string().url()).optional(),
    images: z
      .array(
        z.union([
          imageSchema,
          z
            .object({
              url: z.string().url(),
            })
            .strict(),
        ])
      )
      .optional(),
    numchapters: z.number().optional(),
    publicationDate: z.coerce.date().optional(),
    coverImage: z.string().optional(),
    spider: z.string().optional(),
  })
  .strict();

export const comicArraySchema = z.array(comicSeedSchema);

// ═══════════════════════════════════════════════════
// CHAPTER VALIDATION SCHEMAS
// ═══════════════════════════════════════════════════

export const chapterSeedSchema = z
  .object({
    url: z.string().url().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    chaptertitle: z.string().optional(),
    chaptername: z.string().optional(),
    chapterslug: z.string().optional(),
    updated_at: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    spider: z.string().optional(),
    releaseDate: z.coerce.date().optional(),
    comic: z
      .union([
        z
          .object({
            title: z.string(),
            slug: z.string().optional(),
          })
          .strict(),
        z
          .object({
            comictitle: z.string(),
            comicslug: z.string().optional(),
          })
          .strict(),
      ])
      .optional(),
    comictitle: z.string().optional(),
    comicslug: z.string().optional(),
    image_urls: z.array(z.string().url()).optional(),
    images: z
      .array(
        z.union([
          imageSchema,
          z
            .object({
              url: z.string().url(),
            })
            .strict(),
        ])
      )
      .optional(),
  })
  .strict();

export const chapterArraySchema = z.array(chapterSeedSchema);

// ═══════════════════════════════════════════════════
// TYPE GUARDS
// ═══════════════════════════════════════════════════

export type UserSeed = z.infer<typeof userSeedSchema>;
export type ComicSeed = z.infer<typeof comicSeedSchema>;
export type ChapterSeed = z.infer<typeof chapterSeedSchema>;
export type TypeSeed = z.infer<typeof typeSeedSchema>;
export type AuthorSeed = z.infer<typeof authorSeedSchema>;
export type ArtistSeed = z.infer<typeof artistSeedSchema>;
export type GenreSeed = z.infer<typeof genreSeedSchema>;
