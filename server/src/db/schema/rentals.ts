import { pgTable, uuid, integer, varchar, numeric, boolean } from "drizzle-orm/pg-core";
import { products } from "./products.js";

// 1:1 dengan products. Ketersediaan dihitung real-time (overlap booking
// terhadap totalUnits), tidak pakai kalender per-tanggal seperti hotel.
export const rentals = pgTable("rentals", {
    productId: uuid("product_id")
        .primaryKey()
        .references(() => products.id, { onDelete: "cascade" }),
    vehicleType: varchar("vehicle_type", { length: 100 }).notNull(), // e.g. "Toyota Avanza"
    capacity: integer("capacity").notNull(), // jumlah penumpang
    withDriver: boolean("with_driver").notNull().default(false),
    
    // TYPE MOTOR
    transmission: varchar("transmission", { length: 20 }),
    
    pricePerDay: numeric("price_per_day", { precision: 12, scale: 2 }).notNull(),
    totalUnits: integer("total_units").notNull().default(1),
});