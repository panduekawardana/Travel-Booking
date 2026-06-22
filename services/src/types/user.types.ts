import type z from "zod";
import type { createUserSchema, updateUserShema } from "../validation/user.schema.js";


export type CreateUserInpiut = z.infer<typeof createUserSchema>
export type UpdateUserInpiut = z.infer<typeof updateUserShema>