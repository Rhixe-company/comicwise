// ═══════════════════════════════════════════════════
// TYPES API - Full CRUD
// ═══════════════════════════════════════════════════

import { createGenericEntity, listGenericEntity, zodToValidationResult } from "@/lib/generic-crud";
import { createTypeSchema, typeFilterSchema } from "@/lib/validations/schemas";
import type { NextRequest } from "next/server";
import { createType } from "src/database/mutations/types";
import { getAllTypes } from "src/database/queries/types";

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
