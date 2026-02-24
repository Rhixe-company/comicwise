import { eq } from "drizzle-orm";

import { db as database } from "@/database/db";
import { artist } from "@/database/schema";

/**
 *
 * param data
 * param data.name
 * param data.bio
 * param data.image
 * @param data
 * @param data.name
 * @param data.bio
 * @param data.image
 */
export async function createArtist(data: {
  bio?: string;
  image?: string;
  name: string;
}): Promise<typeof artist.$inferSelect | undefined> {
  const [newArtist] = await database
    .insert(artist)
    .values({
      name: data.name,
      bio: data.bio,
      image: data.image,
      createdAt: new Date(),
    })
    .returning();
  return newArtist;
}

/**
 *
 * param artistId
 * param data
 * param data.name
 * param data.bio
 * param data.image
 * @param artistId
 * @param data
 * @param data.name
 * @param data.bio
 * @param data.image
 */
export async function updateArtist(
  artistId: number,
  data: {
    bio?: null | string;
    image?: null | string;
    name?: string;
  }
): Promise<typeof artist.$inferSelect | undefined> {
  const cleanData = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.bio !== undefined && { bio: data.bio || null }),
    ...(data.image !== undefined && { image: data.image || null }),
  };
  const [updatedArtist] = await database
    .update(artist)
    .set(cleanData)
    .where(eq(artist.id, artistId))
    .returning();
  return updatedArtist;
}

/**
 *
 * param artistId
 * @param artistId
 */
export async function deleteArtist(
  artistId: number
): Promise<typeof artist.$inferSelect | undefined> {
  const [deletedArtist] = await database.delete(artist).where(eq(artist.id, artistId)).returning();
  return deletedArtist;
}
