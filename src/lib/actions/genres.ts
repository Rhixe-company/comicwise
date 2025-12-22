"use server";

import appConfig, { checkRateLimit } from 'appConfig';
import * as mutations from "@/database/mutations";
import { error } from '#actions/utils';
import { createGenreSchema, updateGenreSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";
import z from "zod";

export async function createGenre(formData: FormData): Promise<ActionResponse<{ id: number }>> {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit("create:genre", { limit: appConfig.rateLimit.default });
    if (!rateLimit.allowed) {
      return error("Too many requests. Please try again later.");
    }

    const data = createGenreSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    });

    const genre = await mutations.createGenre(data);
    if (!genre) {
      return error("Failed to create genre");
    }

    revalidatePath("/admin/genres");
    return { success: true, data: { id: genre.id } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Create genre error:", err);
    return error("Failed to create genre");
  }
}

export async function updateGenre(genreId: number, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateGenreSchema.parse({
      name: formData.get("name") || undefined,
      description: formData.get("description") || undefined,
    });

    await mutations.updateGenre(genreId, data);
    revalidatePath("/admin/genres");
    revalidatePath(`/admin/genres/${genreId}`);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Update genre error:", err);
    return error("Failed to update genre");
  }
}

export async function deleteGenre(genreId: number): Promise<ActionResponse> {
  try {
    await mutations.deleteGenre(genreId);
    revalidatePath("/admin/genres");

    return { success: true };
  } catch (err) {
    console.error("Delete genre error:", err);
    return error("Failed to delete genre");
  }
}
