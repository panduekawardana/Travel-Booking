import { boolean, pgTable, text, timestamp, uuid, varchar, type AnyPgColumn } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }).unique().notNull(),
    phone: varchar("phone", { length: 20 }),
    passwordHash: text("password_hash").notNull(),

    createdBy: uuid("created_by").references((): AnyPgColumn => users.id, { onDelete: "set null" }),

    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});