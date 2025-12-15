# Server Actions Implementation Guide

**Status:** ✅ P3.1 Foundation Complete

## Complete Implementation for Authors (Template)

This document provides a complete working example for **Authors** and a template
for the remaining entities.

---

## Part 1: Author Server Actions (Complete Example)

**File:** `src/app/admin/authors/actions.ts`

### Features Implemented

✅ Zod validation schemas  
✅ Type-safe server actions  
✅ Role-based authorization (admin only)  
✅ Error handling with proper types  
✅ Database operations (create, update, delete)  
✅ Action logging  
✅ Type-safe response objects

### Key Functions

```typescript
createAuthor(input: unknown): Promise<ActionResponse<{ id: number }>>
updateAuthor(id: number, input: unknown): Promise<ActionResponse<{ id: number }>>
deleteAuthor(id: number): Promise<ActionResponse>
```

### Validation

```typescript
const createAuthorSchema = z.object({
  name: z.string().min(2).max(255),
  bio: z.string().max(5000).optional(),
  image: z.string().url().optional(),
});
```

### Error Handling

- Zod validation errors → Return first issue message
- Authorization errors → Return "You don't have permission"
- Database errors → Return user-friendly message
- All errors logged to console

---

## Template for Remaining Entities

Create these files for each entity:

### 1. Artists (`src/app/admin/artists/actions.ts`)

```typescript
"use server";

import { eq } from "drizzle-orm";
import { database } from "@/database";
import { artist } from "@/database/schema";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

const createArtistSchema = z.object({
  name: z.string().min(2).max(255),
  bio: z.string().max(5000).optional(),
  image: z.string().url().optional(),
});

const updateArtistSchema = createArtistSchema.partial();

interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createArtist(
  input: unknown
): Promise<ActionResponse<{ id: number }>> {
  try {
    await requireRole("admin");
    const data = createArtistSchema.parse(input);

    const result = await database
      .insert(artist)
      .values({
        name: data.name,
        bio: data.bio || null,
        image: data.image || null,
        createdAt: new Date(),
      })
      .returning({ id: artist.id });

    if (!result[0]) throw new Error("Failed to insert");

    console.log(`✅ Artist created: ${data.name} (ID: ${result[0].id})`);
    return { success: true, data: { id: result[0].id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
      };
    }
    if (error instanceof Error && error.message === "admin role required") {
      return { success: false, error: "You don't have permission" };
    }
    console.error("❌ Error:", error);
    return { success: false, error: "Failed to create artist" };
  }
}

export async function updateArtist(
  id: number,
  input: unknown
): Promise<ActionResponse<{ id: number }>> {
  try {
    await requireRole("admin");
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid artist ID" };
    }

    const data = updateArtistSchema.parse(input);
    const existing = await database.query.artist.findFirst({
      where: eq(artist.id, id),
    });

    if (!existing) return { success: false, error: "Artist not found" };

    await database.update(artist).set(data).where(eq(artist.id, id));
    console.log(`✅ Artist updated: ${existing.name} (ID: ${id})`);
    return { success: true, data: { id } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
      };
    }
    if (error instanceof Error && error.message === "admin role required") {
      return { success: false, error: "You don't have permission" };
    }
    console.error("❌ Error:", error);
    return { success: false, error: "Failed to update artist" };
  }
}

export async function deleteArtist(id: number): Promise<ActionResponse> {
  try {
    await requireRole("admin");
    if (!Number.isInteger(id) || id <= 0) {
      return { success: false, error: "Invalid artist ID" };
    }

    const existing = await database.query.artist.findFirst({
      where: eq(artist.id, id),
    });

    if (!existing) return { success: false, error: "Artist not found" };

    await database.delete(artist).where(eq(artist.id, id));
    console.log(`✅ Artist deleted: ${existing.name} (ID: ${id})`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "admin role required") {
      return { success: false, error: "You don't have permission" };
    }
    console.error("❌ Error:", error);
    return { success: false, error: "Failed to delete artist" };
  }
}
```

### 2. Genres (`src/app/admin/genres/actions.ts`)

```typescript
// Same pattern as artists
// Use: genre, genre schema (name unique)
// Schemas:
//   name: z.string().min(2).max(255).trim()
//   description: z.string().max(5000).optional()
```

### 3. Types (`src/app/admin/types/actions.ts`)

```typescript
// Same pattern as artists
// Use: type, type schema (name unique)
// Schemas:
//   name: z.string().min(2).max(255).trim()
//   description: z.string().max(5000).optional()
```

### 4. Comics (`src/app/admin/comics/actions.ts`)

```typescript
// More complex with relations
// Schemas needed:
//   title: z.string().min(1).max(255)
//   slug: z.string().min(1).max(255)
//   description: z.string().min(10).max(5000)
//   coverImage: z.string().url() (from upload)
//   status: z.enum([...])
//   publicationDate: z.coerce.date()
//   rating: z.coerce.number().min(0).max(10).optional()
//   authorId: z.coerce.number().int().positive().optional()
//   artistId: z.coerce.number().int().positive().optional()
//   typeId: z.coerce.number().int().positive().optional()
//   genreIds: z.array(z.coerce.number().int().positive()).optional()
```

### 5. Chapters (`src/app/admin/chapters/actions.ts`)

```typescript
// Depends on comic relationship
// Schemas needed:
//   title: z.string().min(1).max(255)
//   slug: z.string().min(1).max(255)
//   chapterNumber: z.coerce.number().int().positive()
//   releaseDate: z.coerce.date()
//   comicId: z.coerce.number().int().positive()
//   views: z.coerce.number().int().min(0).default(0)
```

---

## How to Use in Components

### Form Component Example

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthor } from "./actions";
import { useToast } from "@/hooks/use-toast";

interface CreateAuthorFormProps {
  onSuccess?: () => void;
}

export function CreateAuthorForm({ onSuccess }: CreateAuthorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const input = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      image: formData.get("image"),
    };

    const result = await createAuthor(input);

    setLoading(false);

    if (!result.success) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Author created successfully",
    });

    router.refresh();
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium">
          Image URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          className="mt-1 block w-full rounded border px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Author"}
      </button>
    </form>
  );
}
```

---

## Best Practices

✅ **Always use `requireRole("admin")`** at start of action  
✅ **Validate all inputs** with Zod schemas  
✅ **Check existence before delete/update**  
✅ **Return typed ActionResponse objects**  
✅ **Log all operations** for audit trail  
✅ **Handle all error types** separately  
✅ **Use try-catch blocks** around all DB operations  
✅ **Never expose internal errors to user**

---

## Testing Checklist

- [ ] Create action: Valid input → Success response
- [ ] Create action: Missing required field → Validation error
- [ ] Create action: Invalid URL → Validation error
- [ ] Create action: Non-admin user → Permission error
- [ ] Update action: Valid input → Success response
- [ ] Update action: Non-existent ID → Error response
- [ ] Delete action: Valid ID → Success response
- [ ] Delete action: Non-existent ID → Error response
- [ ] Console logs appear for audit trail
- [ ] TypeScript: All types pass with `pnpm type-check`

---

## Summary

**Authors:** ✅ Complete (src/app/admin/authors/actions.ts)  
**Artists:** 📋 Use template (same pattern)  
**Genres:** 📋 Use template (same pattern)  
**Types:** 📋 Use template (same pattern)  
**Comics:** 📋 More complex (multiple relations)  
**Chapters:** 📋 Depends on comic relationship

All verified with TypeScript type-checking ✅
