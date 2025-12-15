import { database } from "@/database";
import { comment } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function createComment(data: { content: string; userId: string; chapterId: number }) {
  const [newComment] = await database
    .insert(comment)
    .values({
      content: data.content,
      userId: data.userId,
      chapterId: data.chapterId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return newComment;
}

export async function updateComment(
  commentId: number,
  data: {
    content?: string;
  }
) {
  const [updatedComment] = await database
    .update(comment)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(comment.id, commentId))
    .returning();
  return updatedComment;
}

export async function deleteComment(commentId: number) {
  const [deletedComment] = await database
    .delete(comment)
    .where(eq(comment.id, commentId))
    .returning();
  return deletedComment;
}
