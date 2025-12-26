// ═══════════════════════════════════════════════════
// AUTHOR DETAIL API
// ═══════════════════════════════════════════════════

import { deleteAuthor, updateAuthor } from "@/database/mutations/authors";
import { getAuthorById } from "@/database/queries/authors";
import { authorIdSchema, updateAuthorSchema } from "@/lib/validations";
import type { NextRequest } from "next/server";
import {
  deleteGenericEntity,
  getGenericEntity,
  updateGenericEntity,
  zodToValidationResult,
} from "/app/apilib/generic-crud";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getGenericEntity(id, {
    getFn: async (idVal) => getAuthorById(Number(idVal)),
    validateFn: zodToValidationResult(authorIdSchema),
    entityName: "author",
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  return updateGenericEntity(id, body, {
    updateFn: async (idVal, data) =>
      updateAuthor(
        Number(idVal),
        data as { name?: string; bio?: string | null; image?: string | null }
      ),
    idValidateFn: zodToValidationResult(authorIdSchema),
    dataValidateFn: zodToValidationResult(updateAuthorSchema),
    entityName: "author",
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteGenericEntity(id, {
    deleteFn: async (authorId) => {
      const result = await deleteAuthor(Number(authorId));
      return !!result;
    },
    validateFn: zodToValidationResult(authorIdSchema),
    entityName: "author",
  });
}
