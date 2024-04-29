import { z, ZodType } from 'zod';

export class ArticleValidation {
  static readonly INSERT: ZodType = z.object({
    title: z.string().min(5).max(100),
    content: z.string().min(8).max(500),
    categoryId: z.number().min(1).positive(),
    authorId: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().min(1).positive(),
    title: z.string().min(5).max(100).optional(),
    content: z.string().min(8).max(500).optional(),
    categoryId: z.number().min(1).positive().optional(),
    authorId: z.number().min(1).positive().optional(),
  });
}
