// ═══════════════════════════════════════════════════
// TYPES API - Full CRUD
// ═══════════════════════════════════════════════════

import { createGenericEntity, listGenericEntity, zodToValidationResult } from "lib/genericCrud";
import { createTypeSchema, typeFilterSchema } from "lib/validations";
import { createType } from "database/mutations/types";
import type { NextRequest } from "next/server";
import { getAllTypes } from "database/queries/types";

export async function GET(request: NextRequest) {
  return listGenericEntity(request, {
    listFn: getAllTypes,
    validateFn: zodToValidationResult(typeFilterSchema),
    entityName: "types",
  });
}

export async function POST(request: NextRequest) {
  return createGenericEntity(request, {
    createFn: createType,
    validateFn: zodToValidationResult(createTypeSchema),
    entityName: "type",
  });
}
