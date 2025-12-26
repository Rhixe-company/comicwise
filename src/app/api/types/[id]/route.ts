// ═══════════════════════════════════════════════════
// TYPE DETAIL API
// ═══════════════════════════════════════════════════

import {
  deleteGenericEntity,
  getGenericEntity,
  updateGenericEntity,
  zodToValidationResult,
} from "@/app/apilib/generic-crud";
import { deleteType, updateType } from "@/database/mutations/types";
import { getTypeById } from "@/database/queries/types";
import { typeIdSchema, updateTypeSchema } from "@/lib/validations";
import type { NextRequest } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getGenericEntity(id, {
    getFn: async (idVal) => getTypeById(Number(idVal)),
    validateFn: zodToValidationResult(typeIdSchema),
    entityName: "type",
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  return updateGenericEntity(id, body, {
    updateFn: async (idVal, data) =>
      updateType(Number(idVal), data as { name?: string; description?: string | null }),
    idValidateFn: zodToValidationResult(typeIdSchema),
    dataValidateFn: zodToValidationResult(updateTypeSchema),
    entityName: "type",
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return deleteGenericEntity(id, {
    deleteFn: async (typeId) => {
      const result = await deleteType(Number(typeId));
      return !!result;
    },
    validateFn: zodToValidationResult(typeIdSchema),
    entityName: "type",
  });
}
