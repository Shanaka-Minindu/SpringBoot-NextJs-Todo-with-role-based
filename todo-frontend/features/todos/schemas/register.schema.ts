import { z } from 'zod';

export const registerSchema = z
  .object({
    userName: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long.' })
      .max(50, { message: 'Username cannot exceed 50 characters.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterValues = z.infer<typeof registerSchema>;