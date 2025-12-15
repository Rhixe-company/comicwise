import { database } from "@/database";
import { artist } from "@/database/schema";
import { asc, desc, eq, ilike } from "drizzle-orm";

export async function getArtistById(artistId: number) {
  return await database.query.artist.findFirst({
    where: eq(artist.id, artistId),
  });
}

export async function getArtists(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  const { limit = 10, offset = 0, sortBy = "name", sortOrder = "asc", search } = params || {};

  let query = database.select().from(artist).$dynamic();

  // Apply search filter
  if (search) {
    query = query.where(ilike(artist.name, `%${search}%`));
  }

  // Apply sorting

  const sortColumn = artist[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getArtistCount(params?: { search?: string }) {
  const { search } = params || {};

  let query = database.select().from(artist).$dynamic();

  if (search) {
    query = query.where(ilike(artist.name, `%${search}%`));
  }

  const result = await query;
  return result.length;
}

// Wrapper function for API compatibility
export async function getAllArtists(filters?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { search, page = 1, limit = 50, sortBy = "name", sortOrder = "asc" } = filters || {};

  const offset = (page - 1) * limit;
  const items = await getArtists({
    search,
    limit,
    offset,
    sortBy: sortBy === "createdAt" || sortBy === "name" ? sortBy : "name",
    sortOrder,
  });
  const total = await getArtistCount({ search });

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getArtistsForSelect() {
  return await database
    .select({ id: artist.id, name: artist.name })
    .from(artist)
    .orderBy(asc(artist.name));
}
