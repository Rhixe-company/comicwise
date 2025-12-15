import { database } from "@/database";
import { author } from "@/database/schema";
import { asc, desc, eq, ilike } from "drizzle-orm";

export async function getAuthorById(authorId: number) {
  return await database.query.author.findFirst({
    where: eq(author.id, authorId),
  });
}

export async function getAuthors(params?: {
  limit?: number;
  offset?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
}) {
  const { limit = 10, offset = 0, sortBy = "name", sortOrder = "asc", search } = params || {};

  let query = database.select().from(author).$dynamic();

  // Apply search filter
  if (search) {
    query = query.where(ilike(author.name, `%${search}%`));
  }

  // Apply sorting

  const sortColumn = author[sortBy];
  query = query.orderBy(sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn));

  // Apply pagination
  query = query.limit(limit).offset(offset);

  return await query;
}

export async function getAuthorCount(params?: { search?: string }) {
  const { search } = params || {};

  let query = database.select().from(author).$dynamic();

  if (search) {
    query = query.where(ilike(author.name, `%${search}%`));
  }

  const result = await query;
  return result.length;
}

// Wrapper function for API compatibility
export async function getAllAuthors(filters?: {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  const { search, page = 1, limit = 50, sortBy = "name", sortOrder = "asc" } = filters || {};

  const offset = (page - 1) * limit;
  const items = await getAuthors({
    search,
    limit,
    offset,
    sortBy: sortBy === "createdAt" || sortBy === "name" ? sortBy : "name",
    sortOrder,
  });
  const total = await getAuthorCount({ search });

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
