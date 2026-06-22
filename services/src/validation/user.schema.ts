import z, { string } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2).max(150),
    email: z.string().email().max(150),
    password: z.string().min(6).max(100),
    phone: z.string().max(20).optional(),
});

export const updateUserShema = z.object({
    name: z.string().min(2).max(150).optional(),
    phone: z.string().max(20).optional(),
});