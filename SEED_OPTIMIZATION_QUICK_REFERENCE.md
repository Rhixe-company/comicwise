# Seed Optimization Quick Reference

## What Changed?

The seed system now uses the centralized `@/database/queries` and
`@/database/mutations` layers instead of direct database calls.

## Key Updates

### Metadata Cache

```typescript
// Before
const existing = await database.query.type.findFirst({
  where: eq(typeTable.name, name),
});

// After
const existing = await queries.getTypeByName(name);
```

### User Seeder

```typescript
// Before
const existing = await database.query.user.findFirst({
  where: eq(user.email, userData.email),
});

// After
const existing = await queries.getUserByEmail(userData.email);
```

### Comic Seeder

```typescript
// Before
const existing = await database.query.comic.findFirst({
  where: eq(comic.title, comicData.title),
});

// After
const existing = await queries.getComicByTitle(comicData.title);
```

### Chapter Seeder

```typescript
// Before
const existing = await database.query.chapter.findFirst({
  where: and(
    eq(chapter.comicId, comicId),
    eq(chapter.chapterNumber, chapterNumber)
  ),
});

// After
const existing = await queries.getChapterByComicAndNumber(
  comicId,
  chapterNumber
);
```

## New Query Functions Added

| Module        | Function                       | Purpose             |
| ------------- | ------------------------------ | ------------------- |
| `types.ts`    | `getTypeByNameForSeed()`       | Find type by name   |
| `genres.ts`   | `getGenreByNameForSeed()`      | Find genre by name  |
| `authors.ts`  | `getAuthorByName()`            | Find author by name |
| `artists.ts`  | `getArtistByName()`            | Find artist by name |
| `chapters.ts` | `getChapterByComicAndNumber()` | Find chapter by IDs |
| `comics.ts`   | `getComicByTitle()`            | Find comic by title |

## Why This Matters

1. **Consistency**: All database access follows the same pattern
2. **Maintainability**: Query logic in one place, easy to update
3. **Testability**: Functions are mockable and predictable
4. **Performance**: Same caching strategy, no performance impact
5. **Type Safety**: Strong typing with function signatures

## Files Changed

- 4 seeder files (user, comic, chapter) + metadata cache
- 6 query modules (types, genres, authors, artists, chapters, comics)
- 1 query index file (exports)

## Status

✅ All optimizations complete and ready to use
