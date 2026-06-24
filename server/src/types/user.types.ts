import type { z } from 'zod';
import type { createUserSchema, updateUserSchema } from "../validation/user.schema.js";


export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>