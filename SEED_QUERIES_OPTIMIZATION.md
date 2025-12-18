# Seed Database Layer Optimization

## Overview

Optimized the `@/src/database/seed/` files to use the `@/database/queries` and
`@/database/mutations` layers instead of direct database queries.

## Changes Made

### 1. Query Layer Enhancements

Added read-focused helper methods to existing query modules for seed operations:

#### `src/database/queries/types.ts`

- Added `getTypeByNameForSeed()` - Helper to find types by name during seeding

#### `src/database/queries/genres.ts`

- Added `getGenreByNameForSeed()` - Helper to find genres by name during seeding

#### `src/database/queries/authors.ts`

- Added `getAuthorByName()` - Find authors by name (used by metadata cache)

#### `src/database/queries/artists.ts`

- Added `getArtistByName()` - Find artists by name (used by metadata cache)

#### `src/database/queries/chapters.ts`

- Added `getChapterByComicAndNumber()` - Find chapters by comic ID and chapter
  number
- Exported from `@/database/queries/index.ts`

#### `src/database/queries/comics.ts`

- Added `getComicByTitle()` - Find comics by title (commonly used in seeders)

### 2. Metadata Cache Optimization

**File:** `src/database/seed/utils/metadata-cache.ts`

- Replaced all direct `database.query` calls with `@/database/queries` imports
- Calls now go through the query layer:
  - `getTypeByName()` instead of `database.query.type.findFirst()`
  - `getGenreByName()` instead of `database.query.genre.findFirst()`
  - `getAuthorByName()` instead of `database.query.author.findFirst()`
  - `getArtistByName()` instead of `database.query.artist.findFirst()`

**Benefits:**

- Centralized query logic
- Easier to maintain and refactor queries
- Better separation of concerns

### 3. User Seeder Optimization

**File:** `src/database/seed/seeders/user-seeder.ts`

- Replaced `database.query.user.findFirst()` with `queries.getUserByEmail()`
- Removed direct database imports: `db`, `user` schema, `eq` operator
- All reads now use the query layer

**Benefits:**

- Simpler imports
- Consistent data access pattern
- Reduced coupling to database schema

### 4. Comic Seeder Optimization

**File:** `src/database/seed/seeders/comic-seeder.ts`

- Replaced `database.query.comic.findFirst()` with `queries.getComicByTitle()`
- Removed direct database imports and drizzle-orm operators
- Metadata cache now uses query layer (indirect benefit)

**Benefits:**

- Cleaner code
- Better testability
- Single source of truth for comic queries

### 5. Chapter Seeder Optimization

**File:** `src/database/seed/seeders/chapter-seeder.ts`

- Replaced `database.query.chapter.findFirst()` with
  `queries.getChapterByComicAndNumber()`
- Replaced `database.query.comic.findFirst()` with `queries.getComicByTitle()`
- Added use of `queries.getComic()` for comprehensive comic data fetching
- Removed direct database imports and operators

**Benefits:**

- Leverages existing query composition
- Maintains consistency with rest of codebase
- Improved readability

## Architecture Summary

### Before (Direct Database Access)

```
Seeders → database.query.* → Drizzle ORM → Database
         → database.insert() → mutations
```

### After (Layered Access)

```
Seeders → @/database/queries → Drizzle ORM → Database
       → @/database/mutations → Drizzle ORM → Database
MetadataCache → Queries (same layer)
```

## Files Modified

1. ✅ `src/database/seed/utils/metadata-cache.ts`
2. ✅ `src/database/seed/seeders/user-seeder.ts`
3. ✅ `src/database/seed/seeders/comic-seeder.ts`
4. ✅ `src/database/seed/seeders/chapter-seeder.ts`
5. ✅ `src/database/queries/types.ts`
6. ✅ `src/database/queries/genres.ts`
7. ✅ `src/database/queries/authors.ts`
8. ✅ `src/database/queries/artists.ts`
9. ✅ `src/database/queries/chapters.ts`
10. ✅ `src/database/queries/comics.ts`
11. ✅ `src/database/queries/index.ts`

## Benefits

- **Single Source of Truth**: All data access goes through query/mutation layers
- **Maintainability**: Changes to queries only need to be made in one place
- **Testability**: Easier to mock and test with dependency injection
- **Consistency**: Follows the same patterns as the rest of the codebase
- **Performance**: Maintains existing caching strategy in metadata cache
- **Type Safety**: Better TypeScript integration with explicit function
  signatures

## Backward Compatibility

All changes are backward compatible. The seeders continue to work the same way,
just with cleaner internal implementation.
