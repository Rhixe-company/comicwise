// ═══════════════════════════════════════════════════
// ADVANCED SEARCH SERVICE - Full-Text Search with PostgreSQL
// ═══════════════════════════════════════════════════

import { db } from "#database/db";
import { artist, author, comic, comicToGenre, genre, type } from "#schema";
import { and, asc, desc, eq, gte, inArray, lte, or, sql } from "drizzle-orm";
import type { ComicFilters } from "types";

// ═══════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════

export interface AdvancedSearchFilters extends ComicFilters {
  // Full-text search
  query?: string;
  searchMode?: "simple" | "phrase" | "websearch";

  // Advanced filters
  authorName?: string;
  artistName?: string;
  genreNames?: string[];
  publicationYearFrom?: number;
  publicationYearTo?: number;
  minViews?: number;
  maxViews?: number;

  // Sorting
  sortBy?: "title" | "rating" | "views" | "publicationDate" | "createdAt" | "latest";
  sortOrder?: "asc" | "desc";

  // Pagination
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  status: string;
  rating: string;
  views: number;
  authorName: string | null;
  artistName: string | null;
  typeName: string | null;
  genres: string[];
  relevanceScore?: number;
  publicationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  facets?: {
    statuses: { status: string; count: number }[];
    genres: { genre: string; count: number }[];
    types: { type: string; count: number }[];
  };
}

// ═══════════════════════════════════════════════════
// FULL-TEXT SEARCH IMPLEMENTATION
// ═══════════════════════════════════════════════════

/**
 * Perform advanced full-text search on comics
 * @param filters
 */
export async function searchComics(filters: AdvancedSearchFilters = {}): Promise<SearchResponse> {
  const {
    query: searchQuery,
    searchMode = "websearch",
    search,
    typeId,
    genreIds,
    status,
    minRating,
    authorName,
    artistName,
    genreNames,
    publicationYearFrom,
    publicationYearTo,
    minViews,
    maxViews,
    sortBy = "relevance",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = filters;

  // Build the base query
  let baseQuery = db
    .select({
      id: comic.id,
      title: comic.title,
      description: comic.description,
      coverImage: comic.coverImage,
      status: comic.status,
      publicationDate: comic.publicationDate,
      rating: comic.rating,
      views: comic.views,
      authorId: comic.authorId,
      artistId: comic.artistId,
      typeId: comic.typeId,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
      authorName: author.name,
      artistName: artist.name,
      typeName: type.name,
      // Calculate relevance score for full-text search
      relevanceScore:
        searchQuery || search
          ? sql<number>`ts_rank(${comic.searchVector}, to_tsquery('english', ${buildSearchQuery(searchQuery || search || "", searchMode)}))`
          : sql<number>`1`,
    })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(type, eq(comic.typeId, type.id))
    .$dynamic();

  const conditions: unknown[] = [];

  // Full-text search condition
  if (searchQuery || search) {
    const tsquery = buildSearchQuery(searchQuery || search || "", searchMode);
    conditions.push(
      or(
        sql`${comic.searchVector} @@ to_tsquery('english', ${tsquery})`,
        sql`${author.searchVector} @@ to_tsquery('english', ${tsquery})`,
        sql`${artist.searchVector} @@ to_tsquery('english', ${tsquery})`
      )
    );
  }

  // Type filter
  if (typeId) {
    conditions.push(eq(comic.typeId, typeId));
  }

  // Status filter
  if (status) {
    conditions.push(eq(comic.status, status));
  }

  // Rating filter
  if (minRating) {
    conditions.push(gte(comic.rating, minRating.toString()));
  }

  // Views filter
  if (minViews) {
    conditions.push(gte(comic.views, minViews));
  }

  if (maxViews) {
    conditions.push(lte(comic.views, maxViews));
  }

  // Publication year filters
  if (publicationYearFrom) {
    conditions.push(gte(comic.publicationDate, new Date(`${publicationYearFrom}-01-01`)));
  }

  if (publicationYearTo) {
    conditions.push(lte(comic.publicationDate, new Date(`${publicationYearTo}-12-31`)));
  }

  // Author name filter (case-insensitive)
  if (authorName) {
    conditions.push(sql`LOWER(${author.name}) LIKE LOWER(${"%" + authorName + "%"})`);
  }

  // Artist name filter (case-insensitive)
  if (artistName) {
    conditions.push(sql`LOWER(${artist.name}) LIKE LOWER(${"%" + artistName + "%"})`);
  }

  // Genre filters
  if ((genreIds && genreIds.length > 0) || (genreNames && genreNames.length > 0)) {
    let genreComics;

    if (genreIds && genreIds.length > 0) {
      genreComics = await db
        .selectDistinct({ comicId: comicToGenre.comicId })
        .from(comicToGenre)
        .where(inArray(comicToGenre.genreId, genreIds));
    } else if (genreNames && genreNames.length > 0) {
      const genresResult = await db
        .select({ id: genre.id })
        .from(genre)
        .where(or(...genreNames.map((name) => sql`LOWER(${genre.name}) = LOWER(${name})`)));

      const foundGenreIds = genresResult.map((g) => g.id);
      if (foundGenreIds.length > 0) {
        genreComics = await db
          .selectDistinct({ comicId: comicToGenre.comicId })
          .from(comicToGenre)
          .where(inArray(comicToGenre.genreId, foundGenreIds));
      }
    }

    if (genreComics && genreComics.length > 0) {
      const comicIds = genreComics.map((c) => c.comicId);
      conditions.push(inArray(comic.id, comicIds));
    } else {
      // No comics match the genre filter
      return {
        results: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  }

  // Apply conditions
  if (conditions.length > 0) {
    baseQuery = baseQuery.where(and(...(conditions as Parameters<typeof and>)));
  }

  // Apply sorting
  const sortedQuery = applySorting(baseQuery, sortBy, sortOrder, searchQuery || search) as any;

  // Apply pagination
  const offset = (page - 1) * limit;
  const results = await sortedQuery.limit(limit).offset(offset);

  // Get total count
  const total = await getSearchTotalCount(conditions);

  // Fetch genres for each comic
  const comicIds = results.map((r: any) => r.id);
  const genresMap = await getComicGenres(comicIds);

  // Combine results with genres — map into the typed SearchResult shape
  const enrichedResults: SearchResult[] = results.map((result: any) => ({
    id: result.id,
    title: (result.title as string) || "",
    description: (result.description as string) || "",
    coverImage: (result.coverImage as string) || "",
    status: (result.status as string) || "",
    rating: (result.rating as string) || "",
    views: typeof result.views === "number" ? result.views : Number(result.views) || 0,
    authorName: (result.authorName as string | null) || null,
    artistName: (result.artistName as string | null) || null,
    typeName: (result.typeName as string | null) || null,
    genres: genresMap?.[result.id] || [],
    relevanceScore: (result.relevanceScore as number) || undefined,
    publicationDate: result.publicationDate
      ? new Date(
          result.publicationDate.getTime ? (result.publicationDate as Date) : result.publicationDate
        )
      : new Date(),
    createdAt: result.createdAt
      ? new Date(result.createdAt.getTime ? (result.createdAt as Date) : result.createdAt)
      : new Date(),
    updatedAt: result.updatedAt
      ? new Date(result.updatedAt.getTime ? (result.updatedAt as Date) : result.updatedAt)
      : new Date(),
  }));

  return {
    results: enrichedResults,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

/**
 * Build tsquery string based on search mode
 * @param query
 * @param mode
 */
function buildSearchQuery(query: string, mode: string): string {
  const cleanQuery = query.trim().replaceAll(/[^\s\w]/g, " ");

  switch (mode) {
    case "phrase":
      // Phrase search: "exact phrase"
      return cleanQuery.split(" ").filter(Boolean).join(" <-> ");

    case "simple":
      // Simple search: word1 & word2 & word3
      return cleanQuery.split(" ").filter(Boolean).join(" & ");

    case "websearch":
    default:
      // Websearch: uses OR by default, quoted for phrases
      return cleanQuery
        .split(" ")
        .filter(Boolean)
        .map((word) => `${word}:*`)
        .join(" | ");
  }
}

/**
 * Apply sorting to the query
 * @param query
 * @param sortBy
 * @param sortOrder
 * @param hasSearchQuery
 */
function applySorting(
  query: unknown,
  sortBy: string,
  sortOrder: string,
  hasSearchQuery?: string
): unknown {
  const isDesc = sortOrder === "desc";
  const q = query as any;

  switch (sortBy) {
    case "relevance":
      if (hasSearchQuery) {
        return q.orderBy(isDesc ? desc(sql`relevance_score`) : asc(sql`relevance_score`));
      }
      return q.orderBy(desc(comic.rating));

    case "rating":
      return q.orderBy(isDesc ? desc(comic.rating) : asc(comic.rating));

    case "views":
      return q.orderBy(isDesc ? desc(comic.views) : asc(comic.views));

    case "title":
      return q.orderBy(isDesc ? desc(comic.title) : asc(comic.title));

    case "popularity":
      return q.orderBy(
        isDesc
          ? desc(sql`(${comic.views} * 0.7 + CAST(${comic.rating} AS INTEGER) * 100 * 0.3)`)
          : asc(sql`(${comic.views} * 0.7 + CAST(${comic.rating} AS INTEGER) * 100 * 0.3)`)
      );

    case "latest":
    default:
      return q.orderBy(isDesc ? desc(comic.createdAt) : asc(comic.createdAt));
  }
}

/**
 * Get total count of search results
 * @param conditions
 */
async function getSearchTotalCount(conditions: unknown[]): Promise<number> {
  let countQuery = db
    .select({ count: sql<number>`count(DISTINCT ${comic.id})::int` })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .$dynamic();

  if (conditions.length > 0) {
    // conditions may contain Drizzle SQL expressions; cast to any for the ORM call
    countQuery = countQuery.where(and(...(conditions as any)));
  }

  const result = await countQuery;
  return result[0]?.count || 0;
}

/**
 * Fetch genres for multiple comics
 * @param comicIds
 */
async function getComicGenres(comicIds: number[]): Promise<Record<number, string[]>> {
  if (comicIds.length === 0) {
    return {};
  }

  const genresResult = await db
    .select({
      comicId: comicToGenre.comicId,
      genreName: genre.name,
    })
    .from(comicToGenre)
    .innerJoin(genre, eq(comicToGenre.genreId, genre.id))
    .where(inArray(comicToGenre.comicId, comicIds));

  const genresMap: Record<number, string[]> = {};
  for (const row of genresResult) {
    if (!genresMap[row.comicId]) {
      genresMap[row.comicId] = [];
    }
    if (row.genreName) {
      genresMap[row.comicId]!.push(row.genreName);
    }
  }

  return genresMap;
}

// ═══════════════════════════════════════════════════
// SEARCH SUGGESTIONS & AUTOCOMPLETE
// ═══════════════════════════════════════════════════

/**
 * Get search suggestions based on partial query
 * @param query
 * @param limit
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<{ comics: string[]; authors: string[]; artists: string[] }> {
  if (!query || query.length < 2) {
    return { comics: [], authors: [], artists: [] };
  }

  const tsquery = buildSearchQuery(query, "websearch");

  // Get comic title suggestions
  const comicSuggestions = await db
    .select({ title: comic.title })
    .from(comic)
    .where(sql`${comic.searchVector} @@ to_tsquery('english', ${tsquery})`)
    .orderBy(desc(sql`ts_rank(${comic.searchVector}, to_tsquery('english', ${tsquery}))`))
    .limit(limit);

  // Get author suggestions
  const authorSuggestions = await db
    .select({ name: author.name })
    .from(author)
    .where(sql`${author.searchVector} @@ to_tsquery('english', ${tsquery})`)
    .orderBy(desc(sql`ts_rank(${author.searchVector}, to_tsquery('english', ${tsquery}))`))
    .limit(limit);

  // Get artist suggestions
  const artistSuggestions = await db
    .select({ name: artist.name })
    .from(artist)
    .where(sql`${artist.searchVector} @@ to_tsquery('english', ${tsquery})`)
    .orderBy(desc(sql`ts_rank(${artist.searchVector}, to_tsquery('english', ${tsquery}))`))
    .limit(limit);

  return {
    comics: comicSuggestions.map((s: { title: string }) => s.title),
    authors: authorSuggestions
      .map((s: { name: string | null }) => s.name)
      .filter((n: string | null): n is string => n !== null),
    artists: artistSuggestions
      .map((s: { name: string | null }) => s.name)
      .filter((n: string | null): n is string => n !== null),
  };
}

/**
 * Get popular search terms
 * @param limit
 */
export async function getPopularSearches(limit: number = 10): Promise<string[]> {
  // This would typically come from a search analytics table
  // For now, return top-rated comics as suggestions
  const topComics = await db
    .select({ title: comic.title })
    .from(comic)
    .orderBy(desc(comic.rating), desc(comic.views))
    .limit(limit);

  return topComics.map((c: { title: string }) => c.title);
}

/**
 * Get trending comics based on recent views
 * @param days
 * @param limit
 */
export async function getTrendingComics(
  days: number = 7,
  limit: number = 10
): Promise<SearchResult[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const results = await db
    .select({
      id: comic.id,
      title: comic.title,
      description: comic.description,
      coverImage: comic.coverImage,
      status: comic.status,
      publicationDate: comic.publicationDate,
      rating: comic.rating,
      views: comic.views,
      authorName: author.name,
      artistName: artist.name,
      typeName: type.name,
      createdAt: comic.createdAt,
      updatedAt: comic.updatedAt,
    })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(type, eq(comic.typeId, type.id))
    .where(gte(comic.updatedAt, since))
    .orderBy(desc(comic.views))
    .limit(limit);

  // Fetch genres
  const comicIds = results.map((r: { id: number }) => r.id);
  const genresMap = await getComicGenres(comicIds);

  return results.map((result: { id: number; [key: string]: unknown }) => ({
    id: result.id,
    title: (result as any).title,
    description: (result as any).description,
    coverImage: (result as any).coverImage,
    status: (result as any).status,
    rating: (result as any).rating,
    views: (result as any).views,
    authorName: (result as any).authorName ?? null,
    artistName: (result as any).artistName ?? null,
    typeName: (result as any).typeName ?? null,
    genres: genresMap?.[result.id] ? genresMap[result.id] : [],
    publicationDate: (result as any).publicationDate,
    createdAt: (result as any).createdAt,
    updatedAt: (result as any).updatedAt,
  })) as SearchResult[];
}
