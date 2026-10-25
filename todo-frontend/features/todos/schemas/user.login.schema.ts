import z from "zod";


export const loginSchema = z.object({
  userName:z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long.' }),
  password: z
    .string()
    .min(5, { message: 'Password must be at least 6 characters long.' }),
});


export type LoginValues = z.infer<typeof loginSchema>;