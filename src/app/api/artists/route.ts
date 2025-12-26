// ═══════════════════════════════════════════════════
// ARTISTS API - Full CRUD
// ═══════════════════════════════════════════════════

import { createGenericEntity, listGenericEntity, zodToValidationResult } from "lib/genericCrud";
import { artistFilterSchema, createArtistSchema } from "lib/validations";
import { createArtist } from "mutations/artists";
import type { NextRequest } from "next/server";
import { getAllArtists } from "queries/artists";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllArtists,
    validateFn: zodToValidationResult(artistFilterSchema),
    entityName: "artists",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createArtist,
    validateFn: zodToValidationResult(createArtistSchema),
    entityName: "artist",
  });
}
