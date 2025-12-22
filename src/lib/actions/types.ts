"use server";

import { error } from "#actions/utils";
import * as mutations from "#database/mutations";
import { createTypeSchema, updateTypeSchema } from "#lib/validations";
import appConfig, { checkRateLimit } from "appConfig";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "types";
import z from "zod";

export async function createType(formData: FormData): Promise<ActionResponse<{ id: number }>> {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit("create:type", {
      limit: appConfig.rateLimit.default.requests,
    });
    if (!rateLimit.allowed) {
      return error("Too many requests. Please try again later.");
    }

    const data = createTypeSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });

    const type = await mutations.createType(data);
    if (!type) {
      return error("Failed to create type");
    }

    revalidatePath("/admin/types");
    return { success: true, data: { id: type.id } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Create type error:", err);
    return error("Failed to create type");
  }
}

export async function updateType(typeId: number, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateTypeSchema.parse({
      name: formData.get("name") || undefined,
      description: formData.get("description") || undefined,
    });

    await mutations.updateType(typeId, data);
    revalidatePath("/admin/types");
    revalidatePath(`/admin/types/${typeId}`);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Update type error:", err);
    return error("Failed to update type");
  }
}

export async function deleteType(typeId: number): Promise<ActionResponse> {
  try {
    await mutations.deleteType(typeId);
    revalidatePath("/admin/types");

    return { success: true };
  } catch (err) {
    console.error("Delete type error:", err);
    return error("Failed to delete type");
  }
}
