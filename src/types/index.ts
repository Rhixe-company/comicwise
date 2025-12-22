// ═══════════════════════════════════════════════════
// TYPES INDEX - Centralized Type Exports (Next.js 16)
// ═══════════════════════════════════════════════════

// API Types
export * from "./api";
export * from "./dto";

// System Types
export * from "./cache";
export * from "./cli";
export * from "./monitoring";
export * from "./queue";
export * from "./upload";

// Database Types
export * from "./database";
export { ApiError as DatabaseApiError } from "./database";
// Internal Types
export * from "./internal";

// Note: globals.d.ts is automatically included by TypeScript
// Re-export commonly used types for convenience
export type { ActionResponse, ApiResponse } from "./api";

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
