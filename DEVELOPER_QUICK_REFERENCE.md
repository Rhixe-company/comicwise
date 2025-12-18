# Developer Quick Reference: Database Types & Queries

**Last Updated:** December 15, 2025  
**For:** ComicWise Next.js 16 + TypeScript 5 Project

---

## Import Types

```typescript
// Base models from Drizzle
import type {
  ComicModel,
  ChapterModel,
  GenreModel,
  AuthorModel,
  ArtistModel,
  TypeModel,
  UserModel,
} from "@/types/database";

// Relation types
import type {
  ComicWithChapters,
  ComicWithRelations,
  ChapterWithComic,
  ComicSearchResult,
  UserWithStats,
  GenreWithCount,
} from "@/types/database";

// CRUD types
import type {
  CreateComicPayload,
  UpdateComicPayload,
  CreateChapterPayload,
  UpdateChapterPayload,
  CreateAuthorPayload,
  CreateArtistPayload,
} from "@/types/database";

// Pagination & filtering
import type {
  ListOptions,
  ComicFilters,
  ChapterFilters,
  PaginatedResponse,
  CursorPaginatedResponse,
} from "@/types/database";

// API responses
import type { ApiResponse, ApiErrorResponse } from "@/types/database";
```

---

## Common Patterns

### Pattern 1: Fetch with Relations

```typescript
// Get comic with chapters
const comic: ComicWithChapters = await getComicWithChapters(comicId);

// Access type-safe
comic.chapters.forEach((ch) => {
  console.log(ch.title, ch.chapterNumber);
});
```

### Pattern 2: Create with Relations

```typescript
const payload: CreateComicPayload = {
  title: "My Comic",
  slug: "my-comic",
  description: "Great comic",
  coverImage: "url...",
  publicationDate: new Date(),
  genres: [1, 2, 3], // Genre IDs
  authorId: 5,
};

const comic: ComicWithRelations = await createComicWithGenres(payload);
```

### Pattern 3: Search with Filters

```typescript
const filters: ComicFilters = {
  search: "action",
  status: "Ongoing",
  authorId: 1,
  minRating: 4,
};

const results: ComicSearchResult[] = await searchComics(filters);
```

### Pattern 4: Paginated List

```typescript
const { data, pagination } = await listComics(page, pageSize);

// pagination contains: total, page, pageSize, totalPages
console.log(`Page ${pagination.page} of ${pagination.totalPages}`);
```

### Pattern 5: Update Record

```typescript
const updates: Partial<CreateComicPayload> = {
  status: "Completed",
  rating: "4.5",
};

const updated: ComicWithRelations | null = await updateComic(id, updates);
```

### Pattern 6: Delete Record

```typescript
const success: boolean = await deleteComic(id);
// All related chapters/images deleted via CASCADE
```

---

## Type-Safe API Responses

```typescript
// Success response
const response: ApiResponse<ComicSearchResult[]> = {
  success: true,
  data: results,
  metadata: {
    count: results.length,
    timestamp: new Date().toISOString(),
  },
};

// Error response
const error: ApiErrorResponse = {
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Comic not found",
    details: { comicId: 123 },
  },
};
```

---

## In Server Components

```typescript
import { getComicWithChapters } from '@/lib/queries'
import type { ComicWithChapters } from '@/types/database'
import { notFound } from 'next/navigation'

export async function ComicPage({ params }: { params: { id: string } }) {
  const comic: ComicWithChapters | null = await getComicWithChapters(
    parseInt(params.id)
  )

  if (!comic) notFound()

  return (
    <article>
      <h1>{comic.title}</h1>
      <p>{comic.description}</p>

      {/* Typed chapter list */}
      <section>
        {comic.chapters.map(chapter => (
          <div key={chapter.id}>
            <h2>{chapter.chapterNumber}: {chapter.title}</h2>
          </div>
        ))}
      </section>
    </article>
  )
}
```

---

## In Server Actions

```typescript
"use server";

import { createComicWithGenres } from "@/lib/queries";
import type { CreateComicPayload } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function addComic(formData: FormData) {
  const payload: CreateComicPayload = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    coverImage: formData.get("coverImage") as string,
    publicationDate: new Date(formData.get("date") as string),
    genres: JSON.parse(formData.get("genres") as string),
  };

  const comic = await createComicWithGenres(payload);
  revalidatePath("/admin/comics");

  return comic;
}
```

---

## In API Routes

```typescript
import { NextRequest, NextResponse } from "next/server";
import { searchComics } from "@/lib/queries";
import type { ApiResponse, ComicSearchResult } from "@/types/database";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q") || "";
  const status = request.nextUrl.searchParams.get("status") as any;

  const results: ComicSearchResult[] = await searchComics({
    search,
    status,
  });

  const response: ApiResponse<ComicSearchResult[]> = {
    success: true,
    data: results,
  };

  return NextResponse.json(response);
}
```

---

## Environment Config Usage

```typescript
import { appConfig, isDevelopment, env } from "@/app-config";

// Check environment
if (isDevelopment) {
  console.log("Dev mode");
}

// Access config
const uploadProvider = appConfig.upload.provider;
const maxFileSize = appConfig.upload.maxFileSize;

// Check features
if (appConfig.features.imageUpload) {
  // Enable upload button
}

// Get environment var
const dbUrl = env.DATABASE_URL;
const secret = env.AUTH_SECRET;

// Feature detection
const hasGoogle = appConfig.auth.providers.google;
const emailEnabled = appConfig.features.email;
```

---

## Zod Validation Example

```typescript
import { z } from "zod";

// Define schema
const createComicSchema = z.object({
  title: z.string().min(1).max(512),
  slug: z.string().min(1).max(512),
  description: z.string().min(10),
  coverImage: z.string().url(),
  publicationDate: z.coerce.date(),
  genres: z.array(z.number()).optional(),
});

export type CreateComicInput = z.infer<typeof createComicSchema>;

// Validate in server action
export async function validateAndCreate(data: unknown) {
  const validated = createComicSchema.parse(data);
  const comic = await createComicWithGenres(validated);
  return comic;
}
```

---

## Debugging Types

```typescript
// Use satisfies to verify types
const comic = getComicWithChapters(
  1
) satisfies Promise<ComicWithChapters | null>;

// Hover over variable to see inferred type
const results = await searchComics({ search: "test" });
//     ^ Shows: ComicSearchResult[]

// Check if object matches interface
const payload = {
  title: "Comic",
  slug: "comic",
  description: "Desc",
  coverImage: "url",
  publicationDate: new Date(),
} satisfies CreateComicPayload;
```

---

## Best Practices

### ✅ DO:

- Always import types from `@/types/database`
- Use the payload types for form data
- Leverage the relation types for queries
- Check `ApiResponse.success` before accessing `.data`
- Use `null` coalescing for optional relations

### ❌ DON'T:

- Use `any` types in your queries
- Mix different model types (don't treat ComicModel as ComicWithChapters)
- Assume optional relations exist (check before access)
- Return raw database models from APIs

---

## Quick Copy-Paste Examples

### List Component

```typescript
export async function ComicsList() {
  const { data, pagination } = await listComics(1, 12)

  return (
    <div>
      {data.map(comic => (
        <ComicCard key={comic.id} comic={comic} />
      ))}
      {pagination.hasMore && (
        <button>Load More</button>
      )}
    </div>
  )
}
```

### Search Component

```typescript
'use client'

export function ComicSearch() {
  const [results, setResults] = useState<ComicSearchResult[]>([])

  async function handleSearch(query: string) {
    const res = await fetch(`/api/search?q=${query}`)
    const data: ApiResponse<ComicSearchResult[]> = await res.json()

    if (data.success) {
      setResults(data.data)
    }
  }

  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} />
      {results.map(comic => (
        <div key={comic.id}>{comic.title}</div>
      ))}
    </div>
  )
}
```

### Form Component

```typescript
'use server'

export async function ComicForm() {
  async function handleSubmit(formData: FormData) {
    const payload: CreateComicPayload = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      coverImage: formData.get('image') as string,
      publicationDate: new Date(formData.get('date') as string),
    }

    await createComicWithGenres(payload)
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="Comic Title" />
      <input name="slug" placeholder="slug" />
      <textarea name="description" />
      <input name="image" type="url" />
      <input name="date" type="date" />
      <button type="submit">Create Comic</button>
    </form>
  )
}
```

---

## File References

- **Types:** `src/types/database.d.ts`
- **Queries:** `src/lib/queries.sample.ts` (reference implementation)
- **Config:** `src/app-config/`
- **Schema:** `src/database/schema.ts`

---

**Documentation:** Complete  
**Types:** 20+ interfaces  
**Sample Queries:** 8 working examples  
**Ready:** For next implementation phase
