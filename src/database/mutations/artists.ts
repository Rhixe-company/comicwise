import { database } from "@/database";
import { artist } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function createArtist(data: { name: string; bio?: string; image?: string }) {
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

export async function updateArtist(
  artistId: number,
  data: {
    name?: string;
    bio?: string | null;
    image?: string | null;
  }
) {
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

export async function deleteArtist(artistId: number) {
  const [deletedArtist] = await database.delete(artist).where(eq(artist.id, artistId)).returning();
  return deletedArtist;
}
