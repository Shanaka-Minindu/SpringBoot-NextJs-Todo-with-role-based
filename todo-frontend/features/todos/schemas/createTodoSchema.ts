import z from "zod";

 export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title cannot be blank').max(150, 'Title must be under 150 characters'),
  content: z.string().min(1, 'Content cannot be blank'),
  doDate: z.date().refine((date) => date !== null, { message: 'Set todo completion Date' }),
});

export type CreateTodoValues = z.infer<typeof createTodoSchema>;
