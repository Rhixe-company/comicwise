"use server";

import appConfig, { checkRateLimit } from "@/appConfig";
import * as mutations from "@/database/mutations";
import { error } from "@/lib/actions/utils";
import { createAuthorSchema, updateAuthorSchema } from "@/lib/validations";
import type { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createAuthor(formData: FormData): Promise<ActionResponse<{ id: number }>> {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit("create:author", {
      limit: appConfig.rateLimit.default.requests,
    });
    if (!rateLimit.allowed) {
      return error("Too many requests. Please try again later.");
    }

    const data = createAuthorSchema.parse({
      name: formData.get("name"),
      bio: formData.get("bio") || undefined,
      image: formData.get("image") || undefined,
    });

    const cleanData = {
      name: data.name,
      bio: data.bio ?? undefined,
      image: data.image ?? undefined,
    };

    const author = await mutations.createAuthor(cleanData);
    if (!author) {
      return error("Failed to create author");
    }

    revalidatePath("/admin/authors");
    return { success: true, data: { id: author.id } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Create author error:", err);
    return error("Failed to create author");
  }
}

export async function updateAuthor(authorId: number, formData: FormData): Promise<ActionResponse> {
  try {
    const data = updateAuthorSchema.parse({
      name: formData.get("name") || undefined,
      bio: formData.get("bio") || undefined,
      image: formData.get("image") || undefined,
    });

    await mutations.updateAuthor(authorId, data);
    revalidatePath("/admin/authors");
    revalidatePath(`/admin/authors/${authorId}`);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Update author error:", err);
    return error("Failed to update author");
  }
}

export async function deleteAuthor(authorId: number): Promise<ActionResponse> {
  try {
    await mutations.deleteAuthor(authorId);
    revalidatePath("/admin/authors");

    return { success: true };
  } catch (err) {
    console.error("Delete author error:", err);
    return error("Failed to delete author");
  }
}
