// ═══════════════════════════════════════════════════
// TYPES INDEX - Centralized Type Exports (Next.js 16)
// ═══════════════════════════════════════════════════

// Database Types
export * from "src/types/database";

// Global Type Definitions
export * from "src/types/global";

// Note: .d.ts files are automatically included by TypeScript
// They don't need to be exported here

// ═══════════════════════════════════════════════════
// COMMON UTILITY TYPES
// ═══════════════════════════════════════════════════

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type AsyncReturnType<T extends (...args: never[]) => Promise<unknown>> = T extends (
  ...args: never[]
) => Promise<infer R>
  ? R
  : never;

export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type NonEmptyArray<T> = [T, ...T[]];

export type AtLeastOne<T> = [T, ...T[]];

export type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

// ═══════════════════════════════════════════════════
// FORM & INPUT TYPES
// ═══════════════════════════════════════════════════

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FileUploadResult {
  url: string;
  publicId?: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface ImageUploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
  transformation?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════
// COMPONENT PROP TYPES
// ═══════════════════════════════════════════════════

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?(row: T): React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "date"
    | "number";
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  validation?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════
// ACTION & SERVER TYPES
// ═══════════════════════════════════════════════════

export interface ActionState<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ServerAction<T = unknown, R = unknown> = (data: T) => Promise<ActionState<R>>;

export type ServerActionWithFormData<R = unknown> = (formData: FormData) => Promise<ActionState<R>>;

// ═══════════════════════════════════════════════════
// ROUTE & NAVIGATION TYPES
// ═══════════════════════════════════════════════════

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
  protected?: boolean;
  roles?: string[];
  layout?: "default" | "admin" | "auth";
}

// ═══════════════════════════════════════════════════
// EMAIL TYPES
// ═══════════════════════════════════════════════════

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
  }>;
}

// ═══════════════════════════════════════════════════
// CONFIGURATION TYPES
// ═══════════════════════════════════════════════════

export interface AppConfig {
  name: string;
  description: string;
  url: string;
  version: string;
  env: {
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
    current: "development" | "production" | "test";
  };
}

export interface DatabaseConfig {
  url: string;
  neonUrl?: string;
  pooling: boolean;
}

export interface AuthConfig {
  secret: string;
  url: string;
  sessionMaxAge: number;
  providers: {
    credentials: boolean;
    google: boolean;
    github: boolean;
  };
}

export interface UploadConfig {
  provider: "imagekit" | "cloudinary" | "local";
  maxSize: number;
  allowedTypes: string[];
  folders: {
    comics: string;
    chapters: string;
    avatars: string;
    misc: string;
  };
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}
