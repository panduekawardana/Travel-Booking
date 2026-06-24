import { date, integer, jsonb, numeric, pgTable, text, time, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { products } from "./products.js";

// 1:1 Products

export const hotels = pgTable("hotels", {
    productId: uuid("product_id").primaryKey()
        .references(() => products.id, { onDelete: "cascade" }),
    starRating: integer("star_rating"),
    address: text("address").notNull(),
    checkInTime: time("check_in_time").notNull().default("14:00:00"),
    checkOutTime: time("check_out_time").notNull().default("12:00:00"),
    facilities: jsonb("facilities").$type<string[]>().default([]),
});

// Setiap hotel memiliki beberapa type kamar

export const hotelRooms = pgTable("hotel_rooms", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    hotelId: uuid("hotel_id").notNull().references(() => hotels.productId, { onDelete: "cascade" }),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    pricePerNight: numeric("price_per_night", { precision: 12, scale: 2 }).notNull(),
    totalRooms: integer("totoal_rooms").notNull().default(1),
    facilities: jsonb("facilities").$type<string[]>().default([]),
});

// Kalender ketersediaan

export const hotelRoomInventory = pgTable("hotel_room_inventory", {
    id: uuid("id").defaultRandom().primaryKey(),
    roomId: uuid("room_id").notNull().references(() => hotelRooms.id, { onDelete: "cascade" }),
    date: date("date").notNull(),

    availableRooms: integer("available_rooms").notNull(), // sisa kamar tersedia di tanggal ini

    // pricePerNight default
    priceOverride: numeric("price_override", { precision: 12, scale: 2 }),
},
    (table) => ({
        roomDateUnique: uniqueIndex("hotel_room_inventory_room_date_idx").on(table.roomId, table.date)
    }),
);

