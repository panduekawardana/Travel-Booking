import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../db/schema/users.js";
import type { CreateUserInpiut, UpdateUserInpiut } from "../types/user.types.js";
import bcrypt from "bcryptjs";

export class UserService {
    static async findAll() {
        try {
            return await db.select({
                id: users.id,
                name: users.name,
                email: users.email,
                phone: users.phone,
                password: users.passwordHash,
                isActive: users.isActive,
            }).from(users);
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error}`);
        }
    }

    static async findById(id: string) {
        try {
            const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
            return user ?? null;
        } catch (error) {
            throw new Error(`Failed to find user: ${error}`);
        }
    }

    static async findByEmail(email: string) {
        try {
            const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
            return user ?? null;
        } catch (error) {
            throw new Error(`Failed to find user by email: ${error}`);
        }
    }

    static async create(input: CreateUserInpiut) {
        try {
            const passwordHash = await bcrypt.hash(input.password, 12);
            const [user] = await db.insert(users).values({ name: input.name, email: input.email, passwordHash, phone: input.phone ?? null }).returning();
            return user!;
        } catch (error) {
            throw new Error(`Failed to create user: ${error}`);
        }
    }

    static async update(id: string, input: UpdateUserInpiut) {
        try {
            const [user] = await db.update(users).set({ ...input, updatedAt: new Date() }).where(eq(users.id, id)).returning();
            return user ?? null;
        } catch (error) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }

    static async deactive(id: string) {
        try {
            const [user] = await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id)).returning();
            return user ?? null;
        } catch (error) {
            throw new Error(`Failed to deactivate user: ${error}`);
        }
    }
}
