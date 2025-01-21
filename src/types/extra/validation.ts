import { z } from "zod";

export const AppSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().url(),
  category: z.enum(["microsoft", "system", "tools", "development", "media"]),
  isPinned: z.boolean(),
  lastOpened: z.string().optional(),
  url: z.string().url(),
  description: z.string().optional(),
  isFavorite: z.boolean().optional(),
  metadata: z.object({
    version: z.string().optional(),
    author: z.string().optional(),
    license: z.string().optional(),
  }).optional(),
});

export type AppValidation = z.infer<typeof AppSchema>;