"use server";

import appConfig, { checkRateLimit } from "@/app-config";
import * as mutations from "@/database/mutations";
import { error } from "actions/utils";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "types";
import z from "zod";

const commentSchema = z
  .object({
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
    chapterId: z.coerce.number().int().positive(),
  })
  .strict();

const updateCommentSchema = z
  .object({
    content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
  })
  .strict();

export async function createComment(
  userId: string,
  formData: FormData
): Promise<ActionResponse<{ id: number }>> {
  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(`comment:${userId}`, {
      limit: appConfig.rateLimit.default.requests,
    });
    if (!rateLimit.allowed) {
      return error("Too many comments. Please try again later.");
    }

    const data = commentSchema.parse({
      content: formData.get("content"),
      chapterId: formData.get("chapterId"),
    });

    const comment = await mutations.createComment({
      ...data,
      userId,
    });
    if (!comment) {
      return error("Failed to create comment");
    }

    revalidatePath(`/comics/[id]/chapters/[chapterId]`);
    return { success: true, data: { id: comment.id } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Create comment error:", err);
    return error("Failed to create comment");
  }
}

export async function updateComment(
  commentId: number,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const data = updateCommentSchema.parse({
      content: formData.get("content"),
    });

    await mutations.updateComment(commentId, data);
    revalidatePath(`/comics/[id]/chapters/[chapterId]`);

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(err.issues[0]?.message || "Validation error");
    }
    console.error("Update comment error:", err);
    return error("Failed to update comment");
  }
}

export async function deleteComment(commentId: number): Promise<ActionResponse> {
  try {
    await mutations.deleteComment(commentId);
    revalidatePath(`/comics/[id]/chapters/[chapterId]`);

    return { success: true };
  } catch (err) {
    console.error("Delete comment error:", err);
    return error("Failed to delete comment");
  }
}
