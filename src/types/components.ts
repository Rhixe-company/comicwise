// ═══════════════════════════════════════════════════
// COMPONENT TYPES - React Component Prop Types
// ═══════════════════════════════════════════════════

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

// ═══════════════════════════════════════════════════
// BASE COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

export interface BaseButtonProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?(): void;
  type?: "button" | "reset" | "submit";
}

export interface BaseInputProps extends BaseComponentProps {
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  onChange?(value: string): void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
}

// ═══════════════════════════════════════════════════
// LAYOUT COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface PageProps<T = Record<string, unknown>> {
  params: T;
  searchParams?: Record<string, string | string[] | undefined>;
}

export interface LayoutProps {
  children: ReactNode;
  params?: Record<string, string>;
}

export interface ErrorProps {
  error: Error & { digest?: string };
  reset(): void;
}

// ═══════════════════════════════════════════════════
// CARD COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface CardProps extends BaseComponentProps {
  description?: string;
  footer?: ReactNode;
  href?: string;
  image?: string;
  imageAlt?: string;
  onClick?(): void;
  title?: string;
}

// ═══════════════════════════════════════════════════
// TABLE COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface TableColumn<T = unknown> {
  align?: "center" | "left" | "right";
  key: string;
  label: string;
  render?(value: unknown, row: T): ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?(row: T): void;
  onSort?(column: string): void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ═══════════════════════════════════════════════════
// FORM COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface FormFieldProps extends BaseInputProps {
  error?: string;
  helperText?: string;
  label?: string;
}

export interface FormProps extends BaseComponentProps {
  error?: string;
  loading?: boolean;
  onSubmit(data: FormData): Promise<void> | void;
  success?: boolean;
}

// ═══════════════════════════════════════════════════
// MODAL/DIALOG COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface ModalProps extends BaseComponentProps {
  description?: string;
  footer?: ReactNode;
  onOpenChange(open: boolean): void;
  open: boolean;
  title?: string;
}

export interface DialogProps extends ModalProps {
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  showClose?: boolean;
}

// ═══════════════════════════════════════════════════
// PAGINATION COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface PaginationProps {
  currentPage: number;
  onPageChange(page: number): void;
  onPageSizeChange?(size: number): void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ═══════════════════════════════════════════════════
// SEARCH COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface SearchProps {
  debounce?: number;
  loading?: boolean;
  onChange(value: string): void;
  onSearch?(value: string): void;
  placeholder?: string;
  value: string;
}

// ═══════════════════════════════════════════════════
// FILTER COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterProps {
  label?: string;
  multiple?: boolean;
  onChange(value: string | string[]): void;
  options: FilterOption[];
  searchable?: boolean;
  value?: string | string[];
}

// ═══════════════════════════════════════════════════
// IMAGE COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface ImageProps {
  alt: string;
  className?: string;
  fill?: boolean;
  height?: number;
  loading?: "eager" | "lazy";
  onError?(): void;
  onLoad?(): void;
  priority?: boolean;
  src: string;
  width?: number;
}

// ═══════════════════════════════════════════════════
// POLYMORPHIC COMPONENT PROPS
// ═══════════════════════════════════════════════════

export type PolymorphicComponentProps<E extends ElementType> = ComponentPropsWithoutRef<E> & {
  as?: E;
};

// ═══════════════════════════════════════════════════
// COMIC-SPECIFIC COMPONENT PROPS
// ═══════════════════════════════════════════════════

export interface ComicCardProps {
  artist?: string;
  author?: string;
  coverImage: string;
  description?: string;
  genres?: string[];
  id: number;
  onClick?(): void;
  rating?: number;
  slug: string;
  status?: string;
  title: string;
  views?: number;
}

export interface ChapterListProps {
  chapters: Array<{
    chapterNumber: number;
    id: number;
    releaseDate: Date | string;
    slug: string;
    title: string;
    views?: number;
  }>;
  comicId: number;
  onChapterClick?(chapterId: number): void;
}

export interface ChapterReaderProps {
  chapterId: number;
  currentPage?: number;
  images: Array<{
    id: number;
    imageUrl: string;
    pageNumber: number;
  }>;
  onPageChange?(page: number): void;
}

export interface BookmarkButtonProps {
  comicId: number;
  isBookmarked?: boolean;
  onToggle?(bookmarked: boolean): void;
}

export interface CommentListProps {
  comments: Array<{
    content: string;
    createdAt: Date | string;
    id: number;
    userId: string;
    userImage?: string;
    userName?: string;
  }>;
  onDelete?(commentId: number): void;
  onEdit?(commentId: number, content: string): void;
  onReply?(commentId: number): void;
}

export interface ReadingProgressProps {
  chapterId: number;
  comicId: number;
  currentPage: number;
  progress: number;
  totalPages: number;
}
