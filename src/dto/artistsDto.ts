/**
 * Artists DTOs
 * Data Transfer Objects for artist operations
 */

import type { artist } from "@/database/schema";

export type ArtistDto = typeof artist.$inferSelect;
export type CreateArtistDto = typeof artist.$inferInsert;
export type UpdateArtistDto = Partial<CreateArtistDto>;

export interface ArtistListDto {
  artists: ArtistDto[];
  limit: number;
  page: number;
  total: number;
}

export type ArtistWithComicsDto = ArtistDto & {
  comics?: Array<{
    coverImage: string;
    id: number;
    slug: string;
    title: string;
  }>;
};

export { deleteArtist, updateArtist } from "@/lib/actions/artists";
