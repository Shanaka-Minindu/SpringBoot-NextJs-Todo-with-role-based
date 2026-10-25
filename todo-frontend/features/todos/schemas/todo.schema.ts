import { z } from 'zod';

export const todoFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  description: z
    .string()
    .max(500, { message: 'Description cannot exceed 500 characters.' })
    .optional(),
    
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    message: 'Please select a priority level.',
  }),
  dueDate: z.string().optional(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;