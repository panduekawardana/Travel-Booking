import { pgTable, uuid, integer, numeric, date, jsonb } from "drizzle-orm/pg-core";
import { products } from "./products.js";
import { scheduleStatusEnum } from "./enum.js";

export const packages = pgTable("packages", {
    productId: uuid("product_id")
        .primaryKey()
        .references(() => products.id, { onDelete: "cascade" }),
    durationDays: integer("duration_days").notNull(),
    durationNights: integer("duration_nights").notNull(),
    itinerary: jsonb("itinerary")
        .$type<{ day: number; title: string; description: string }[]>()
        .default([]),
    includeItems: jsonb("include_items").$type<string[]>().default([]),
    excludeItems: jsonb("exclude_items").$type<string[]>().default([]),
    minPax: integer("min_pax").notNull().default(1),
});

export const packageSchedules = pgTable("package_schedules", {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: uuid("package_id")
        .notNull()
        .references(() => packages.productId, { onDelete: "cascade" }),
    departureDate: date("departure_date").notNull(),
    returnDate: date("return_date").notNull(),
    pricePerPax: numeric("price_per_pax", { precision: 12, scale: 2 }).notNull(),
    quota: integer("quota").notNull(),
    bookedCount: integer("booked_count").notNull().default(0), // increment saat booking confirmed/paid
    status: scheduleStatusEnum("status").notNull().default("open"),
});