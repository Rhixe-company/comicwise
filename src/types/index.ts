// ═══════════════════════════════════════════════════
// TYPES INDEX - Centralized Type Exports (Next.js 16)
// ═══════════════════════════════════════════════════

// Core Types
export * from "./actions";
export * from "./api";
export * from "./components";
export * from "./dto";
export * from "./forms";
export * from "./schema";

// System Types
export * from "./cache";
export * from "./cli";
export * from "./monitoring";
export * from "./queue";
export type { UploadProvider, UploadResult } from "./upload";

// Database Types (avoid duplicate exports with schema)
export type {
  ChapterWithRelations,
  ComicFilters,
  ComicWithDetails,
  ComicWithRelations,
  PaginatedResponse as DatabasePaginatedResponse,
  UserWithRelations,
} from "./database";

// Internal Types
export * from "./internal";

// Note: globals.d.ts is automatically included by TypeScript
// Re-export commonly used types for convenience
export type { ActionResult, PaginatedResponse } from "./actions";
export type { ActionResponse, ApiResponse } from "./api";
export type { Artist, Author, Chapter, Comic, Genre, User } from "./schema";

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

export type AsyncReturnType<T extends (...arguments_: never[]) => Promise<unknown>> = T extends (
  ...arguments_: never[]
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
// HELPER TYPES
// ═══════════════════════════════════════════════════

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type StrictPick<T, K extends keyof T> = Pick<T, K>;

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
  }[Keys];
