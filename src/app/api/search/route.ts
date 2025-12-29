// ═══════════════════════════════════════════════════
// SEARCH API ROUTE - Advanced Comic Search
// ═══════════════════════════════════════════════════

import type { AdvancedSearchFilters } from "@/lib/searchRefactored";
import {
  getPopularSearches,
  getSearchSuggestions,
  getTrendingComics,
  searchComics,
} from "@/lib/searchRefactored";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ═══════════════════════════════════════════════════
// MAIN SEARCH ENDPOINT
// ═══════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    // Use `request.nextUrl` instead of `request.url` to avoid forcing a
    // prerender bailout. `request.nextUrl.searchParams` is safe to read
    // during static prerendering and in app-route handlers.
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");

    // Handle different search actions
    switch (action) {
      case "suggest":
        return handleSuggestions(searchParams);

      case "popular":
        return handlePopularSearches(searchParams);

      case "trending":
        return handleTrendingComics(searchParams);

      default:
        return handleSearch(searchParams);
    }
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform search",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════
// SEARCH HANDLERS
// ═══════════════════════════════════════════════════

/**
 * Handle main search functionality
 * @param searchParams
 */
async function handleSearch(searchParams: URLSearchParams) {
  const filters: AdvancedSearchFilters = {
    query: searchParams.get("q") || undefined,
    search: searchParams.get("search") || undefined,
    searchMode: (searchParams.get("mode") as "simple" | "phrase" | "websearch") || "websearch",
    typeId: searchParams.get("typeId") ? Number.parseInt(searchParams.get("typeId")!) : undefined,
    status: searchParams.get("status") as
      | "ongoing"
      | "completed"
      | "hiatus"
      | "cancelled"
      | undefined,
    minRating: searchParams.get("minRating")
      ? Number.parseFloat(searchParams.get("minRating")!)
      : undefined,
    authorName: searchParams.get("author") || undefined,
    artistName: searchParams.get("artist") || undefined,
    genreNames: searchParams.get("genres")?.split(",").filter(Boolean),
    genreIds: searchParams
      .get("genreIds")
      ?.split(",")
      .map((id) => Number.parseInt(id))
      .filter((id) => !isNaN(id)),
    publicationYearFrom: searchParams.get("yearFrom")
      ? Number.parseInt(searchParams.get("yearFrom")!)
      : undefined,
    publicationYearTo: searchParams.get("yearTo")
      ? Number.parseInt(searchParams.get("yearTo")!)
      : undefined,
    minViews: searchParams.get("minViews") ? Number.parseInt(searchParams.get("minViews")!) : undefined,
    maxViews: searchParams.get("maxViews") ? Number.parseInt(searchParams.get("maxViews")!) : undefined,
    sortBy:
      (searchParams.get("sortBy") as
        | "title"
        | "rating"
        | "views"
        | "publicationDate"
        | "createdAt"
        | "latest"
        | "relevance") || "relevance",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1,
    limit: searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 12,
  };

  const results = await searchComics(filters);
  return NextResponse.json(results);
}

/**
 * Handle search suggestions/autocomplete
 * @param searchParams
 */
async function handleSuggestions(searchParams: URLSearchParams) {
  const query = searchParams.get("q") || "";
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 5;

  const suggestions = await getSearchSuggestions(query, limit);
  return NextResponse.json(suggestions);
}

/**
 * Handle popular searches
 * @param searchParams
 */
async function handlePopularSearches(searchParams: URLSearchParams) {
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10;

  const popularSearches = await getPopularSearches(limit);
  return NextResponse.json({ searches: popularSearches });
}

/**
 * Handle trending comics
 * @param searchParams
 */
async function handleTrendingComics(searchParams: URLSearchParams) {
  const days = searchParams.get("days") ? Number.parseInt(searchParams.get("days")!) : 7;
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10;

  const trendingComics = await getTrendingComics(days, limit);
  return NextResponse.json({ comics: trendingComics });
}
