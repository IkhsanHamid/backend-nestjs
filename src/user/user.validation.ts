import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(5).max(100),
    password: z.string().min(8).max(100),
    name: z.string().min(5).max(100),
    roleId: z.number(),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(5).max(100),
    password: z.string().min(8).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(5).max(100).optional(),
    password: z.string().min(8).max(100).optional(),
  });
}
