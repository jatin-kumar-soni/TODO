import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional()
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional()
});

