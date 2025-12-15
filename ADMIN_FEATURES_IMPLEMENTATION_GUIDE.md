# Admin Features Implementation Guide

## Overview

This document outlines the implementation of advanced admin features for the
ComicWise platform, including bulk operations, dropdown selectors for
relationships, and extended entity management.

---

## 1. Bulk Delete Implementation

### Completed Features

- ✅ Bulk delete for Comics
- ✅ Bulk delete for Chapters
- ✅ Bulk delete for Authors
- ✅ Bulk delete for Artists
- ✅ Bulk delete for Genres
- ✅ Bulk delete for Types

### How It Works

#### Comics (Example)

```typescript
// Server Action
export async function bulkDeleteComics(ids: number[]): Promise<ActionResponse> {
  // Validates IDs
  // Deletes genres associations (cascade)
  // Deletes comics
  // Returns success/error
}
```

#### Client Implementation

```typescript
// In ComicsListContent
const handleBulkDelete = async (ids: number[]) => {
  const result = await bulkDeleteComics(ids);
  if (result.success) {
    setComics(comics.filter((c) => !ids.includes(c.id)));
    toast({ title: "Success", description: `${ids.length} comic(s) deleted` });
  }
};

// In ComicsTable
<Button
  onClick={handleBulkDelete}
  disabled={isBulkDeleting || isLoading}
>
  Delete {selectedIds.length}
</Button>
```

### Files Modified

- `src/app/admin/comics/actions.ts` - Added `bulkDeleteComics()`
- `src/app/admin/chapters/actions.ts` - Added `bulkDeleteChapters()`
- `src/app/admin/authors/actions.ts` - Added `bulkDeleteAuthors()`
- `src/app/admin/artists/actions.ts` - Added `bulkDeleteArtists()`
- `src/app/admin/genres/actions.ts` - Added `bulkDeleteGenres()`
- `src/app/admin/types/actions.ts` - Added `bulkDeleteTypes()`
- `src/components/admin/ComicsTable.tsx` - Added bulk delete button and handler
- `src/components/admin/ComicsListContent.tsx` - Added bulk delete handler
  callback

---

## 2. Genre Dropdown Implementation

### Location

`src/app/admin/comics/comic-form-enhanced.tsx`

### Features

- ✅ Multi-select genre checkboxes
- ✅ Display all available genres
- ✅ Toggle selection state
- ✅ Clean visual feedback

### Usage

```typescript
<div className="space-y-2">
  <Label>Genres</Label>
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
    {genres.map((genre) => (
      <label key={genre.id} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedGenres.includes(genre.id)}
          onChange={() => toggleGenre(genre.id)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <span className="text-sm">{genre.name}</span>
      </label>
    ))}
  </div>
</div>
```

---

## 3. Author & Artist Dropdown Implementation

### Location

`src/app/admin/comics/comic-form-enhanced.tsx`

### Features

- ✅ Author dropdown with all available authors
- ✅ Artist dropdown with all available artists
- ✅ Option to leave unselected
- ✅ Sorted by name A-Z

### Author Dropdown Example

```typescript
<div className="space-y-2">
  <Label htmlFor="authorId">Author</Label>
  <Select name="authorId">
    <SelectTrigger>
      <SelectValue placeholder="Select an author" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="">No author</SelectItem>
      {authors.map((author) => (
        <SelectItem key={author.id} value={String(author.id)}>
          {author.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

### Database Query Helpers

New helper functions added for efficient data fetching:

```typescript
// src/database/queries/authors.ts
export async function getAuthorsForSelect() {
  return await database
    .select({ id: author.id, name: author.name })
    .from(author)
    .orderBy(asc(author.name));
}

// src/database/queries/artists.ts
export async function getArtistsForSelect() {
  return await database
    .select({ id: artist.id, name: artist.name })
    .from(artist)
    .orderBy(asc(artist.name));
}

// src/database/queries/genres.ts
export async function getGenresForSelect() {
  return await database
    .select({ id: genre.id, name: genre.name })
    .from(genre)
    .orderBy(asc(genre.name));
}
```

---

## 4. Extended to Other Entities

### Chapters

- ✅ Bulk delete action: `bulkDeleteChapters(ids)`
- Implementation: `src/app/admin/chapters/actions.ts`
- Same pattern as comics

### Users

- Status: Ready for implementation
- Pattern: Create `src/app/admin/users/actions.ts` with same structure

### Other Entities (Authors, Artists, Genres, Types)

- ✅ All have bulk delete actions
- ✅ All can be extended with bulk edit if needed

---

## 5. API & Server Actions

### Response Format

```typescript
interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Example usage
const result = await bulkDeleteComics([1, 2, 3]);
if (result.success) {
  console.log(`Deleted ${result.data?.deletedCount} comics`);
} else {
  console.error(result.error);
}
```

### Authorization

All server actions check for admin role:

```typescript
await requireRole("admin");
// Returns error if user is not admin
```

---

## 6. Testing Checklist

### Bulk Delete

- [ ] Select multiple comics
- [ ] Click "Delete N" button
- [ ] Confirm deletion in modal
- [ ] Verify comics removed from table
- [ ] Toast shows success message
- [ ] Refresh page - comics are gone
- [ ] Test with 1, 5, 10+ items

### Genre Dropdown

- [ ] Form loads with genre checkboxes
- [ ] Can toggle genres on/off
- [ ] Multiple genres can be selected
- [ ] Selected genres visually show checked state
- [ ] Submitting form includes selected genres

### Author/Artist Dropdowns

- [ ] Dropdown shows all authors sorted A-Z
- [ ] Dropdown shows all artists sorted A-Z
- [ ] "No author" / "No artist" options work
- [ ] Can select and change selection
- [ ] Selected value persists in form

### Extended Entities

- [ ] Chapters bulk delete works
- [ ] Authors bulk delete works
- [ ] Artists bulk delete works
- [ ] Genres bulk delete works
- [ ] Types bulk delete works

---

## 7. Implementation Examples

### Using Bulk Delete in Component

```typescript
import { bulkDeleteComics } from "@/app/admin/comics/actions";

function ComicsList() {
  const handleBulkDelete = async (ids: number[]) => {
    const result = await bulkDeleteComics(ids);
    if (result.success) {
      refreshList();
      showToast("Success", `Deleted ${ids.length} comics`);
    } else {
      showToast("Error", result.error);
    }
  };

  return (
    <ComicsTable
      onBulkDelete={handleBulkDelete}
      // ... other props
    />
  );
}
```

### Using Genre Dropdown

```typescript
import { ComicFormEnhanced } from "@/app/admin/comics/comic-form-enhanced";
import { getGenresForSelect } from "@/database/queries/genres";

async function NewComicPage() {
  const genres = await getGenresForSelect();

  return <ComicFormEnhanced genres={genres} />;
}
```

---

## 8. Files Changed Summary

### Server Actions

- `src/app/admin/comics/actions.ts` - bulkDeleteComics()
- `src/app/admin/chapters/actions.ts` - bulkDeleteChapters()
- `src/app/admin/authors/actions.ts` - bulkDeleteAuthors()
- `src/app/admin/artists/actions.ts` - bulkDeleteArtists()
- `src/app/admin/genres/actions.ts` - bulkDeleteGenres()
- `src/app/admin/types/actions.ts` - bulkDeleteTypes()

### Components

- `src/components/admin/ComicsTable.tsx` - Bulk delete UI
- `src/components/admin/ComicsListContent.tsx` - Bulk delete handler
- `src/app/admin/comics/comic-form-enhanced.tsx` - NEW form with dropdowns

### Database Queries

- `src/database/queries/authors.ts` - getAuthorsForSelect()
- `src/database/queries/artists.ts` - getArtistsForSelect()
- `src/database/queries/genres.ts` - getGenresForSelect()

---

## 9. Future Enhancements

### Priority 1 (Medium Effort)

- [ ] Bulk edit (change status, add genre to multiple comics)
- [ ] Bulk export to CSV
- [ ] Advanced filtering (by status, date range, etc.)

### Priority 2 (High Effort)

- [ ] Batch upload from CSV
- [ ] Duplicate comic (clone with new slug)
- [ ] Sort by clicking column headers
- [ ] Approval workflow (Draft → Review → Published)

### Priority 3 (Polish)

- [ ] Activity log (track changes by user)
- [ ] Undo/Rollback for accidental deletes
- [ ] Scheduled publishing
- [ ] Content versioning

---

## 10. Troubleshooting

### Bulk Delete Not Working

1. Check console for errors
2. Verify admin role is set
3. Confirm IDs are valid numbers
4. Check database connection

### Dropdowns Not Showing Data

1. Verify genres/authors/artists exist in database
2. Check `getGenresForSelect()` returns data
3. Ensure component props are passed correctly
4. Check for TypeScript errors

### UI Not Updating After Delete

1. Verify onBulkDelete callback is passed to table
2. Check that state update removes items from list
3. Ensure component uses setComics() not direct mutation

---

## 11. Performance Notes

- Bulk delete uses `inArray()` for efficient batch deletion
- Genre/Author/Artist dropdowns only fetch id and name (minimal data)
- No N+1 queries - all data fetched in single queries
- Pagination still functional with search/filtering

---

## 12. Security Considerations

- ✅ All actions require admin role check
- ✅ Input validation with Zod schemas
- ✅ IDs validated before deletion
- ✅ No direct SQL injection risks (using Drizzle ORM)
- ✅ Server-side authorization enforced

---

## 13. Migration Guide

If extending to a new entity (e.g., Users):

1. Create actions file: `src/app/admin/users/actions.ts`
2. Add bulkDeleteUsers() function (copy from authors template)
3. Create ComicsTable equivalent for users
4. Add onBulkDelete callback prop
5. Call bulkDeleteUsers in handler

Template:

```typescript
export async function bulkDeleteUsers(ids: number[]): Promise<ActionResponse> {
  try {
    await requireRole("admin");
    if (!ids.length) return { success: false, error: "No users selected" };

    const result = await database
      .delete(user)
      .where(user.id.inArray(ids))
      .returning();

    console.log(`✅ Deleted ${result.length} users`);
    return { success: true, data: { deletedCount: result.length } };
  } catch (error) {
    // ... error handling
  }
}
```

---

## Questions & Support

For issues or questions about implementation, refer to:

- ADMIN_COMICS_TESTING_GUIDE.md (original testing guide)
- ADMIN_CRUD_IMPLEMENTATION.md (original CRUD implementation)
- Individual component files for detailed code comments
