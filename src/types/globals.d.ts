/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL TYPE DEFINITIONS - ComicWise Project
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Comprehensive type definitions ensuring type safety and consistency
 * across the entire codebase.
 *
 * version 1.0.0
 * author ComicWise Team
 * license MIT
 */

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL NAMESPACE AUGMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// REACT & COMPONENT TYPES
// ═══════════════════════════════════════════════════════════════════════════

import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from "react";

declare global {
  // Extend Window interface for browser globals
  interface Window {
    __INITIAL_DATA__?: unknown;
    __THEME__?: "dark" | "light" | "system";
    dataLayer?: unknown[];
    gtag?(command: string, ...arguments_: unknown[]): void;
  }

  // Node.js global types
  namespace NodeJS {
    interface ProcessEnvironment {
      AUTH_GITHUB_CLIENT_ID?: string;
      AUTH_GITHUB_CLIENT_SECRET?: string;

      AUTH_GOOGLE_CLIENT_ID?: string;
      AUTH_GOOGLE_CLIENT_SECRET?: string;
      // Authentication
      AUTH_SECRET: string;
      AUTH_URL: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_REGION?: string;

      AWS_S3_BUCKET_NAME?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      CLOUDINARY_API_KEY?: string;
      CLOUDINARY_API_SECRET?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      CUSTOM_PASSWORD?: string;
      // Database
      DATABASE_URL: string;
      EMAIL_FROM?: string;
      EMAIL_SECURE?: string;
      // Email
      EMAIL_SERVER_HOST?: string;
      EMAIL_SERVER_PASSWORD?: string;

      EMAIL_SERVER_PORT?: string;
      EMAIL_SERVER_USER?: string;
      IMAGEKIT_PRIVATE_KEY?: string;
      IMAGEKIT_PUBLIC_KEY?: string;
      IMAGEKIT_URL_ENDPOINT?: string;
      NEON_DATABASE_URL?: string;

      NEXT_PUBLIC_APP_URL?: string;
      // Application
      NODE_ENV: "development" | "production" | "test";
      PORT?: string;
      QSTASH_CURRENT_SIGNING_KEY?: string;

      QSTASH_NEXT_SIGNING_KEY?: string;
      // Background Jobs
      QSTASH_TOKEN?: string;
      QSTASH_URL?: string;
      REDIS_DB?: string;
      // Redis
      REDIS_HOST?: string;
      REDIS_PASSWORD?: string;
      REDIS_PORT?: string;
      REDIS_TLS_ENABLED?: string;

      REDIS_URL?: string;
      // Upload Services
      UPLOAD_PROVIDER?: "aws" | "cloudinary" | "imagekit" | "local";
      UPSTASH_REDIS_REST_TOKEN?: string;
      UPSTASH_REDIS_REST_URL?: string;
    }

    interface Global {
      db: unknown;
      prisma: unknown;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY TYPES - SUPPLEMENTARY ONLY
// ═══════════════════════════════════════════════════════════════════════════
// NOTE: Import core utilities from './Utility' instead

/**
 * Get all values of an object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Get all keys of an object type as a union
 */
export type KeyOf<T> = keyof T;

/**
 * Extract entries type from object
 */
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];

/**
 * Async function return type extractor
 */
export type AsyncReturnType<T extends (...arguments_: never[]) => Promise<unknown>> = T extends (
  ...arguments_: never[]
) => Promise<infer R>
  ? R
  : never;

/**
 * Awaited type - Unwrap Promise
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * At least one element array
 */
export type AtLeastOne<T> = [T, ...T[]];

/**
 * Exact type matching
 */
export type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

/**
 * Pick required properties
 */
export type PickRequired<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

/**
 * Pick optional properties
 */
export type PickOptional<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
};

/**
 * Mutable type - Remove readonly
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Deep mutable - Remove readonly recursively
 */
export type DeepMutable<T> = T extends object ? { -readonly [P in keyof T]: DeepMutable<T[P]> } : T;

/**
 * Primitive types
 */
export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

/**
 * Built-in types
 */
export type Builtin = Date | Error | Function | Primitive | RegExp;

/**
 * JSON-serializable types
 */
export type JsonValue = boolean | JsonArray | JsonObject | null | number | string;
export interface JsonObject {
  [key: string]: JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}

/**
 * Make specific keys required
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Make specific keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Replace property type
 */
export type Replace<T, K extends keyof T, V> = Omit<T, K> & { [P in K]: V };

/**
 * Union to intersection
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

/**
 * Base component props with className and children
 */
export interface BaseComponentProperties {
  children?: ReactNode;
  className?: string;
}

/**
 * Polymorphic component props
 */
export type PolymorphicComponentProps<E extends ElementType, P = { Poly }> = P &
  Omit<ComponentPropsWithoutRef<E>, keyof P> & {
    as?: E;
  };

/**
 * Polymorphic component with ref
 */
export type PolymorphicComponentPropsWithRef<E extends ElementType, P = { Ploy }> = P &
  Omit<ComponentPropsWithRef<E>, keyof P> & {
    as?: E;
  };

/**
 * Component with children
 */
export interface WithChildren {
  children?: ReactNode;
}

/**
 * Component with className
 */
export interface WithClassName {
  className?: string;
}

/**
 * Component with both children and className
 */
export interface ComponentProperties extends WithChildren, WithClassName {}

/**
 * Async component type
 */
export type AsyncComponent<P = { "" }> = (properties: P) => Promise<ReactNode>;

/**
 * Server component type
 */
export type ServerComponent<P = { "" }> = (properties: P) => Promise<ReactNode> | ReactNode;

// ═══════════════════════════════════════════════════════════════════════════
// FORM & INPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Select option type
 */
export interface SelectOption<T = number | string> {
  description?: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: T;
}

/**
 * File upload result
 */
export interface FileUploadResult {
  filename: string;
  height?: number;
  metadata?: Record<string, unknown>;
  mimeType: string;
  provider?: "aws" | "cloudinary" | "imagekit" | "local";
  publicId?: string;
  size: number;
  url: string;
  width?: number;
}

/**
 * Image upload options
 */
export interface ImageUploadOptions {
  allowedTypes?: string[];
  filename?: string;
  folder?: string;
  maxSize?: number;
  transformation?: {
    [key: string]: unknown;
    crop?: string;
    format?: string;
    height?: number;
    quality?: number;
    width?: number;
  };
}

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  autoComplete?: string;
  defaultValue?: unknown;
  description?: string;
  disabled?: boolean;
  label: string;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  type:
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "search"
    | "select"
    | "tel"
    | "text"
    | "textarea"
    | "time"
    | "url"
    | "week";
  validation?: Record<string, unknown>;
}

/**
 * Form validation error
 */
export interface FormValidationError {
  code?: string;
  field: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState<T = unknown> {
  errors: Record<string, string[]>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
  touched: Record<string, boolean>;
  values: T;
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVER ACTION & API TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Server action state
 */
export interface ActionState<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  success: boolean;
  timestamp?: Date;
}

/**
 * Server action response
 */
export interface ActionResponse<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
  metadata?: Record<string, unknown>;
  redirect?: string;
  success: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    details?: unknown;
    message: string;
    stack?: string;
  };
  message?: string;
  metadata?: Record<string, unknown>;
  pagination?: PaginationInfo;
  success: boolean;
  timestamp?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
    stack?: string;
  };
  success: false;
  timestamp: string;
}

/**
 * Server action function type
 */
export type ServerAction<T = unknown, R = unknown> = (data: T) => Promise<ActionState<R>>;

/**
 * Server action with FormData
 */
export type ServerActionWithFormData<R = unknown> = (formData: FormData) => Promise<ActionState<R>>;

/**
 * API handler function type
 */
export type ApiHandler<T = unknown, R = unknown> = (
  request: Request,
  context?: T
) => Promise<ApiResponse<R> | Response>;

// ═══════════════════════════════════════════════════════════════════════════
// PAGINATION & LISTING TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pagination information
 */
export interface PaginationInfo {
  endIndex: number;
  hasNext: boolean;
  hasPrev: boolean;
  page: number;
  pageSize: number;
  startIndex: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

/**
 * Cursor-based pagination info
 */
export interface CursorPaginationInfo {
  cursor?: string;
  hasMore: boolean;
  limit: number;
  nextCursor?: string;
  prevCursor?: string;
  total: number;
}

/**
 * Cursor-based paginated response
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: CursorPaginationInfo;
}

/**
 * List query options
 */
export interface ListOptions {
  cursor?: string;
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Sort option
 */
export interface SortOption {
  field: string;
  label?: string;
  order: "asc" | "desc";
}

/**
 * Filter option
 */
export interface FilterOption {
  field: string;
  label?: string;
  operator?: "eq" | "gt" | "gte" | "in" | "like" | "lt" | "lte" | "ne";
  value: unknown;
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION & ROUTING TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Navigation item
 */
export interface NavItem {
  active?: boolean;
  badge?: number | string;
  children?: NavItem[];
  description?: string;
  disabled?: boolean;
  external?: boolean;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: string[];
  title: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
}

/**
 * Route configuration
 */
export interface RouteConfig {
  component: React.ComponentType<Record<string, unknown>>;
  layout?: "admin" | "auth" | "default" | "minimal";
  metadata?: {
    description?: string;
    keywords?: string[];
    title?: string;
  };
  path: string;
  protected?: boolean;
  roles?: string[];
}

/**
 * Link props with active state
 */
export interface ActiveLinkProperties {
  activeClassName?: string;
  children: ReactNode;
  className?: string;
  exact?: boolean;
  href: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLE & DATA DISPLAY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Data table column definition
 */
export interface DataTableColumn<T> {
  accessorKey?: keyof T | string;
  align?: "center" | "left" | "right";
  cell?(row: T): ReactNode;
  filterable?: boolean;
  header: React.ComponentType | string;
  hidden?: boolean;
  id: string;
  sortable?: boolean;
  sticky?: boolean;
  width?: number | string;
}

/**
 * Data table props
 */
export interface DataTableProperties<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyState?: ReactNode;
  error?: string;
  filters?: FilterOption[];
  loading?: boolean;
  onFilter?(filters: FilterOption[]): void;
  onPageChange?(page: number): void;
  onRowClick?(row: T): void;
  onSort?(column: string, order: "asc" | "desc"): void;
  pagination?: PaginationInfo;
  rowKey?: ((row: T) => number | string) | keyof T;
  selectable?: boolean;
  sorting?: SortOption[];
}

// ═══════════════════════════════════════════════════════════════════════════
// THEME & STYLING TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Theme mode
 */
export type ThemeMode = "dark" | "light" | "system";

/**
 * Theme colors
 */
export interface ThemeColors {
  accent: string;
  accentForeground: string;
  background: string;
  border: string;
  card: string;
  cardForeground: string;
  destructive: string;
  destructiveForeground: string;
  foreground: string;
  input: string;
  muted: string;
  mutedForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  radius: string;
  ring: string;
  secondary: string;
  secondaryForeground: string;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  animations: {
    duration: "fast" | "normal" | "slow";
    enabled: boolean;
  };
  colors: ThemeColors;
  fonts: {
    mono: string;
    sans: string;
    serif: string;
  };
  mode: ThemeMode;
  reducedMotion: boolean;
}

/**
 * CSS variable
 */
export type CSSVariable = `--${string}`;

/**
 * Tailwind class
 */
export type TailwindClass = string;

/**
 * Class value (for cn utility)
 */
export type ClassValue =
  | boolean
  | ClassValue[]
  | null
  | number
  | Record<string, boolean | null | undefined>
  | string
  | undefined;

// ═══════════════════════════════════════════════════════════════════════════
// UPLOAD & MEDIA TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Upload provider type
 */
export type UploadProvider = "aws" | "cloudinary" | "imagekit" | "local";

/**
 * Upload service result
 */
export interface UploadServiceResult {
  error?: string;
  metadata?: {
    format?: string;
    height?: number;
    provider?: UploadProvider;
    size?: number;
    width?: number;
  };
  publicId?: string;
  success: boolean;
  url?: string;
}

/**
 * Bulk upload options
 */
export interface BulkUploadOptions extends ImageUploadOptions {
  concurrent?: number;
  files: File[];
  onComplete?(results: UploadServiceResult[]): void;
  onError?(error: Error, fileName: string): void;
  onProgress?(progress: number, fileName: string): void;
}

/**
 * Image transformation options
 */
export interface ImageTransformOptions {
  blur?: number;
  crop?: "fill" | "fit" | "limit" | "pad" | "scale";
  flip?: "both" | "horizontal" | "vertical";
  format?: "avif" | "gif" | "jpg" | "png" | "webp";
  gravity?: "auto" | "center" | "east" | "face" | "north" | "south" | "west";
  grayscale?: boolean;
  height?: number;
  quality?: number;
  rotate?: number;
  sharpen?: number;
  width?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Email template data
 */
export interface EmailTemplate {
  from?: string;
  html: string;
  replyTo?: string;
  subject: string;
  text?: string;
}

/**
 * Send email options
 */
export interface SendEmailOptions {
  attachments?: EmailAttachment[];
  bcc?: string | string[];
  cc?: string | string[];
  from?: string;
  headers?: Record<string, string>;
  html: string;
  priority?: "high" | "low" | "normal";
  replyTo?: string;
  subject: string;
  text?: string;
  to: string | string[];
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  cid?: string;
  content?: Buffer | string;
  contentType?: string;
  encoding?: string;
  filename: string;
  path?: string;
}

/**
 * Email send result
 */
export interface EmailSendResult {
  error?: string;
  messageId?: string;
  response?: string;
  success: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CACHE & QUEUE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cache options
 */
export interface CacheOptions {
  revalidate?: number;
  tags?: string[];
  ttl?: number;
}

/**
 * Cache key builder
 */
export type CacheKey = Record<string, unknown> | string | string[];

/**
 * Queue job data
 */
export interface QueueJobData {
  attempts?: number;
  delay?: number;
  id: string;
  payload: Record<string, unknown>;
  priority?: number;
  timestamp: Date;
  type: string;
}

/**
 * Queue job result
 */
export interface QueueJobResult {
  data?: unknown;
  duration?: number;
  error?: string;
  success: boolean;
}

/**
 * Queue options
 */
export interface QueueOptions {
  attempts?: number;
  backoff?: {
    delay: number;
    type: "exponential" | "fixed";
  };
  delay?: number;
  priority?: number;
  removeOnComplete?: boolean;
  removeOnFail?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH & FILTER TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Search query
 */
export interface SearchQuery {
  facets?: string[];
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  q: string;
  sort?: SortOption[];
}

/**
 * Search result
 */
export interface SearchResult<T> {
  executionTime?: number;
  facets?: Record<string, SearchFacet[]>;
  hits: T[];
  query: string;
  total: number;
}

/**
 * Search facet
 */
export interface SearchFacet {
  count: number;
  selected?: boolean;
  value: string;
}

/**
 * Full-text search options
 */
export interface FullTextSearchOptions {
  fields?: string[];
  fuzzy?: boolean;
  limit?: number;
  offset?: number;
  prefix?: boolean;
  query: string;
  weights?: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS & TRACKING TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  category?: string;
  label?: string;
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
  value?: number;
}

/**
 * Page view event
 */
export interface PageViewEvent {
  path: string;
  properties?: Record<string, unknown>;
  referrer?: string;
  title?: string;
}

/**
 * User tracking data
 */
export interface UserTrackingData {
  browser?: string;
  country?: string;
  device?: string;
  language?: string;
  os?: string;
  sessionId?: string;
  userId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validation rule
 */
export interface ValidationRule<T = unknown> {
  code?: string;
  message: string;
  validator(value: T): boolean | Promise<boolean>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  errors?: ValidationError[];
  valid: boolean;
}

/**
 * Validation error
 */
export interface ValidationError {
  code?: string;
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Schema validation
 */
export interface SchemaValidation<T> {
  data: T;
  options?: {
    abortEarly?: boolean;
    stripUnknown?: boolean;
  };
  schema: unknown;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * App configuration
 */
export interface AppConfig {
  description: string;
  env: {
    current: "development" | "production" | "test";
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
  };
  features: Record<string, boolean>;
  name: string;
  url: string;
  version: string;
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  maxConnections?: number;
  neonUrl?: string;
  pooling: boolean;
  ssl?: boolean;
  url: string;
}

/**
 * Auth configuration
 */
export interface AuthConfig {
  providers: {
    credentials: boolean;
    github: boolean;
    google: boolean;
  };
  secret: string;
  sessionMaxAge: number;
  url: string;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  requests: number;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
  window: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * App error
 */
export interface AppError extends Error {
  code?: string;
  details?: Record<string, unknown>;
  isOperational?: boolean;
  statusCode?: number;
}

/**
 * Error with context
 */
export interface ErrorWithContext extends Error {
  context?: Record<string, unknown>;
  timestamp?: Date;
  userId?: string;
}

/**
 * API error
 */
export interface ApiError {
  code: string;
  details?: Record<string, unknown>;
  message: string;
  stack?: string;
  statusCode: number;
}
export type Nullable<T> = null | T;
export type Optional<T> = T | undefined;
export type Maybe<T> = null | T | undefined;
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & object;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type {
  ActionResponse,
  // API types
  ActionState,
  ActiveLinkProperties as ActiveLinkProps,
  // Analytics types
  AnalyticsEvent,
  ApiError,
  ApiErrorResponse,
  ApiHandler,
  ApiResponse,
  // Config types
  AppConfig,
  // Error types
  AppError,
  AsyncComponent,
  AsyncReturnType,
  AtLeastOne,
  AuthConfig,
  Awaited,
  // Component types
  BaseComponentProperties as BaseComponentProps,
  BreadcrumbItem,
  Builtin,
  BulkUploadOptions,
  CacheKey,
  // Cache types
  CacheOptions,
  ClassValue,
  ComponentProperties as ComponentProps,
  CSSVariable,
  CursorPaginatedResponse,
  CursorPaginationInfo,
  DatabaseConfig,
  // Table types
  DataTableColumn,
  DataTableProperties as DataTableProps,
  DeepMutable,
  DeepPartial,
  DeepRequired,
  EmailAttachment,
  EmailSendResult,
  // Email types
  EmailTemplate,
  Entries,
  ErrorWithContext,
  Exact,
  FileUploadResult,
  FilterOption,
  FormFieldConfig,
  FormState,
  FormValidationError,
  FullTextSearchOptions,
  ImageTransformOptions,
  ImageUploadOptions,
  JsonArray,
  JsonObject,
  JsonValue,
  KeyOf,
  ListOptions,
  Maybe,
  Mutable,
  // Navigation types
  NavItem,
  NonEmptyArray,
  // Utility types
  Nullable,
  Optional,
  OptionalKeys,
  PageViewEvent,
  PaginatedResponse,
  // Pagination types
  PaginationInfo,
  PickOptional,
  PickRequired,
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  Prettify,
  Primitive,
  QueueJobData,
  QueueJobResult,
  QueueOptions,
  RateLimitConfig,
  Replace,
  RequiredKeys,
  RouteConfig,
  SchemaValidation,
  SearchFacet,
  // Search types
  SearchQuery,
  SearchResult,
  // Form types
  SelectOption,
  SendEmailOptions,
  ServerAction,
  ServerActionWithFormData,
  ServerComponent,
  SortOption,
  TailwindClass,
  ThemeColors,
  ThemeConfig,
  // Theme types
  ThemeMode,
  UnionToIntersection,
  // Upload types
  UploadProvider,
  UploadServiceResult,
  UserTrackingData,
  ValidationError,
  ValidationResult,
  // Validation types
  ValidationRule,
  ValueOf,
  WithChildren,
  WithClassName,
};

export {};
