import { z, ZodType } from 'zod';

export class ArticleCategoryValidation {
  static readonly INSERT: ZodType = z.object({
    category: z.string().min(1).max(100),
    createdId: z.number().min(1).positive(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().min(1).positive(),
    category: z.string().min(1).max(100),
  });
}
