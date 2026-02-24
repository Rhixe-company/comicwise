/**
 * Comment DTOs
 * Data Transfer Objects for comment operations
 */

import type { comment } from "@/database/schema";

export type CommentDto = typeof comment.$inferSelect;
export type CreateCommentDto = typeof comment.$inferInsert;
export type UpdateCommentDto = Partial<CreateCommentDto>;

export interface CommentListDto {
  comments: CommentDto[];
  limit: number;
  page: number;
  total: number;
}

export type CommentWithUserDto = CommentDto & {
  replies?: CommentDto[];
  replyCount?: number;
  user?: {
    id: string;
    image?: null | string;
    name: string;
  };
};
