// ═══════════════════════════════════════════════════
// AUTHORS API - Full CRUD
// ═══════════════════════════════════════════════════

import { createGenericEntity, listGenericEntity, zodToValidationResult } from "lib/genericCrud";
import { authorFilterSchema, createAuthorSchema } from "lib/validations";
import { createAuthor } from "database/mutations/authors";
import type { NextRequest } from "next/server";
import { getAllAuthors } from "database/queries/authors";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllAuthors,
    validateFn: zodToValidationResult(authorFilterSchema),
    entityName: "authors",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createAuthor,
    validateFn: zodToValidationResult(createAuthorSchema),
    entityName: "author",
  });
}
