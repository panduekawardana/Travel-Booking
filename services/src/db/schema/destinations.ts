import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";


export const destinations = pgTable("destinations", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 170 }).notNull().unique(),
    province: varchar("province", { length: 100 }),
    city: varchar("city", { length: 100 }),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});