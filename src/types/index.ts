// ═══════════════════════════════════════════════════
// TYPES INDEX - Centralized Type Exports (Next.js 16)
// ═══════════════════════════════════════════════════

// Database Types
export * from "src/types/database";

// Internal Types
export * from "src/types/internal";

// Note: globals.d.ts is automatically included by TypeScript
// Don't re-export to avoid duplicates

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

