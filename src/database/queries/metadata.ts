import { db as database } from "database/db";
import { asc, eq } from "drizzle-orm";
import { genre, type } from "schema";

export async function getAllTypes() {
  return await database.select().from(type).orderBy(asc(type.name));
}

export async function getAllGenres() {
  return await database.select().from(genre).orderBy(asc(genre.name));
}

export async function getType(id: number) {
  const [result] = await database.select().from(type).where(eq(type.id, id));
  return result;
}

export async function getGenre(id: number) {
  const [result] = await database.select().from(genre).where(eq(genre.id, id));
  return result;
}
