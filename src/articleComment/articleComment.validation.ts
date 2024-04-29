import { z, ZodType } from 'zod';

export class ArticleCommentValidation {
  static readonly INSERT: ZodType = z.object({
    comment: z.string().min(1).max(500),
    commentId: z.number().min(1).positive(),
    articleId: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().min(1).positive(),
    comment: z.string().min(1).max(500),
  });
}
