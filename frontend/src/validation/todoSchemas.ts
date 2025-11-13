import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(1000, "Description is too long").optional()
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;

export const editTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(1000, "Description is too long").optional()
});

export type EditTodoFormValues = z.infer<typeof editTodoSchema>;

