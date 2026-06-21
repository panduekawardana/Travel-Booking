import { pgTable, text, timestamp, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { productEnum, productStatusEnum } from "./enum.js";
import { destinations } from "./destinations.js";
import { users } from "./users.js";


/**
 * Products Table
 * */ 

export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    type: productEnum("type").notNull(),
    title: varchar("title", { length: 200 }).notNull().unique(),
    slug: varchar("slug", { length: 200 }).unique().notNull(),
    description: text("description"),

    destinationId: uuid("destination_id").references(() => destinations.id, {
        onDelete: "set null"
    }),

    thumbnailUrl: text("thumbnail_url"),
    status: productStatusEnum("status").default("draft").notNull(),

    createdBy: uuid("created_by").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Product Images
 * */

export const productImages = pgTable("product_images", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    productId: uuid("product_id").references(() => products.id, {onDelete: "cascade"}),
    url: text("url").notNull(),
    shortOrder: integer("short_order").notNull().default(0),
    createdAt: timestamp("crated_at", {withTimezone: true}).defaultNow().notNull()   
});