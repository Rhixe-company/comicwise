/**
 * Comment Data Transfer Objects
 */

import type { Comment } from '#types/database-auto';
import type { UserPublicDto } from './userDto';

export interface CommentDto {
  id: string;
  chapterId: string;
  userId: string;
  content: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CommentDetailDto extends CommentDto {
  user?: UserPublicDto;
  replies?: CommentDetailDto[];
  replyCount?: number;
}

export class CommentDtoMapper {
  static toDto(comment: Comment): CommentDto {
    return {
      id: comment.id,
      chapterId: comment.chapterId,
      userId: comment.userId,
      content: comment.content,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  static toDetailDto(
    comment: Comment,
    metadata?: {
      user?: UserPublicDto;
      replies?: CommentDetailDto[];
      replyCount?: number;
    }
  ): CommentDetailDto {
    return {
      ...CommentDtoMapper.toDto(comment),
      user: metadata?.user,
      replies: metadata?.replies,
      replyCount: metadata?.replyCount,
    };
  }

  static toDtoList(comments: Comment[]): CommentDto[] {
    return comments.map(CommentDtoMapper.toDto);
  }
}
