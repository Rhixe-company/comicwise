// ═══════════════════════════════════════════════════
// FORM TYPES - Form Input & Validation Types
// ═══════════════════════════════════════════════════

import type { z } from "zod";

// ═══════════════════════════════════════════════════
// AUTHENTICATION FORMS
// ═══════════════════════════════════════════════════

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpFormData {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  confirmPassword: string;
  password: string;
  token: string;
}

export interface VerifyEmailFormData {
  token: string;
}

export interface ChangePasswordFormData {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
}

// ═══════════════════════════════════════════════════
// COMIC FORMS
// ═══════════════════════════════════════════════════

export interface ComicFormData {
  artistId: null | number;
  authorId: null | number;
  coverImage: string;
  description: string;
  genreIds?: number[];
  publicationDate: Date | string;
  slug: string;
  status: "Coming Soon" | "Completed" | "Dropped" | "Hiatus" | "Ongoing";
  title: string;
  typeId: null | number;
}

export interface ChapterFormData {
  chapterNumber: number;
  comicId: number;
  images?: ChapterImageFormData[];
  releaseDate: Date | string;
  slug: string;
  title: string;
}

export interface ChapterImageFormData {
  imageUrl: string;
  pageNumber: number;
}

export interface ComicImageFormData {
  imageOrder: number;
  imageUrl: string;
}

// ═══════════════════════════════════════════════════
// METADATA FORMS
// ═══════════════════════════════════════════════════

export interface AuthorFormData {
  bio?: string;
  image?: string;
  name: string;
}

export interface ArtistFormData {
  bio?: string;
  image?: string;
  name: string;
}

export interface GenreFormData {
  description?: string;
  name: string;
}

export interface TypeFormData {
  description?: string;
  name: string;
}

// ═══════════════════════════════════════════════════
// USER INTERACTION FORMS
// ═══════════════════════════════════════════════════

export interface CommentFormData {
  chapterId: number;
  content: string;
}

export interface BookmarkFormData {
  comicId: number;
  lastReadChapterId?: null | number;
  notes?: string;
}

export interface ReadingProgressFormData {
  chapterId: number;
  comicId: number;
  completedAt?: Date | null | string;
  pageNumber: number;
  progressPercent: number;
  scrollPosition: number;
  totalPages: number;
}

// ═══════════════════════════════════════════════════
// USER MANAGEMENT FORMS
// ═══════════════════════════════════════════════════

export interface UserProfileFormData {
  email?: string;
  image?: string;
  name?: string;
}

export interface UserManagementFormData {
  email?: string;
  name?: string;
  password?: string;
  role?: "admin" | "moderator" | "user";
}

// ═══════════════════════════════════════════════════
// SEARCH & FILTER FORMS
// ═══════════════════════════════════════════════════

export interface ComicSearchFormData {
  artistIds?: number[];
  authorIds?: number[];
  genreIds?: number[];
  query?: string;
  sortBy?: "createdAt" | "rating" | "title" | "updatedAt" | "views";
  sortOrder?: "asc" | "desc";
  status?: string[];
  typeIds?: number[];
}

export interface ComicFilterFormData {
  artistId?: number;
  authorId?: number;
  genreId?: number;
  status?: string;
  typeId?: number;
}

// ═══════════════════════════════════════════════════
// UPLOAD FORMS
// ═══════════════════════════════════════════════════

export interface ImageUploadFormData {
  file: File;
  folder?: string;
  public_id?: string;
}

export interface BulkUploadFormData {
  files: File[];
  folder?: string;
  provider?: "aws" | "cloudinary" | "imagekit" | "local";
}

// ═══════════════════════════════════════════════════
// ZOD SCHEMA INFERENCE HELPER
// ═══════════════════════════════════════════════════

export type InferZodSchema<T extends z.ZodTypeAny> = z.infer<T>;

// ═══════════════════════════════════════════════════
// FORM STATE TYPES
// ═══════════════════════════════════════════════════

export interface FormState<T = unknown> {
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
}

export type FormAction<TInput, TOutput = void> = (
  previousState: FormState<TOutput>,
  formData: FormData | TInput
) => Promise<FormState<TOutput>>;
