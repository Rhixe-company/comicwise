import { z } from "zod";

export const comicFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(512, "Title must not exceed 512 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(512, "Slug must not exceed 512 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only")
    .optional(),
  coverImage: z.string().url("Cover image must be a valid URL"),
  status: z.enum(["Ongoing", "Hiatus", "Completed", "Dropped", "Coming Soon"]),
  publicationDate: z.instanceof(Date).or(z.string().pipe(z.coerce.date())),
  authorId: z.string().optional(),
  artistId: z.string().optional(),
  typeId: z.string().optional(),
  genreIds: z.array(z.string()).optional().default([]),
});

export type ComicFormData = z.infer<typeof comicFormSchema>;
