// ═══════════════════════════════════════════════════
// ARTIST DETAIL API
// ═══════════════════════════════════════════════════

import {
  deleteGenericEntity,
  getGenericEntity,
  updateGenericEntity,
  zodToValidationResult,
} from "@/app/api/lib/generic-crud";
import { artistIdSchema, updateArtistSchema } from "lib/validations";
import { deleteArtist, updateArtist } from "mutations/artists";
import type { NextRequest } from "next/server";
import { getArtistById } from "queries/artists";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getGenericEntity(id, {
    getFn: async (idVal) => getArtistById(Number(idVal)),
    validateFn: zodToValidationResult(artistIdSchema),
    entityName: "artist",
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  return updateGenericEntity(id, body, {
    updateFn: async (idVal, data) =>
      updateArtist(
        Number(idVal),
        data as { name?: string; bio?: string | null; image?: string | null }
      ),
    idValidateFn: zodToValidationResult(artistIdSchema),
    dataValidateFn: zodToValidationResult(updateArtistSchema),
    entityName: "artist",
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteGenericEntity(id, {
    deleteFn: async (artistId) => {
      const result = await deleteArtist(Number(artistId));
      return !!result;
    },
    validateFn: zodToValidationResult(artistIdSchema),
    entityName: "artist",
  });
}
