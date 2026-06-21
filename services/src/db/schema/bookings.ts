/**
* Tabel booking TUNGGAL untuk ketiga jenis produk (hotel/package/rental).
* productType menentukan kolom referensi mana yang relevan:
*   - hotel   -> productId (hotels) + roomId (wajib diisi)
*   - package -> productId (packages) + packageScheduleId (wajib diisi)
*   - rental  -> productId (rentals) saja (roomId & packageScheduleId NULL)
* Validasi "kolom mana yang wajib diisi sesuai productType" dilakukan di
* application layer (Express service/validator), bukan di level DB,
* supaya tetap simpel untuk MVP.
 * 
 * */
import { date, integer, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { bookingStatusEnum, productTypeEnum } from "./enum.js";
import { products } from "./products.js";
import { hotelRooms } from "./hotels.js";
import { packageSchedules } from "./packages.js";



export const bookings = pgTable("bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingCode: varchar("booking_code", { length: 30 }).notNull().unique(),

    customerId: uuid("costumer_id").notNull().references(() => users.id),

    productType: productTypeEnum("product_type").notNull(),
    productId: uuid("product_id").notNull().references(() => products.id),

    roomId: uuid("room_id").references(() => hotelRooms.id),

    packageScheduleId: uuid("package_schedule_id").references(() => packageSchedules.id),

    // check-in / tgl mulai sewa / tgl keberangkatan
    startDate: date("start_date").notNull(),

    // check-out / tgl selesai sewa / tgl kepulangan
    endDate: date("end_date").notNull(),

    // jumlah tamu/peserta
    guestCount: integer("guest_count").notNull().default(1),

    // jumlah kamar (hotel) / unit kendaraan (rental)
    unitCount: integer("unit_count").notNull().default(1),

    contactName: varchar("contact_name", { length: 150 }).notNull(),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
    notes: text("notes"),

    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),

    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),

    status: bookingStatusEnum("status").notNull().default("pending_payment"),

    confirmedBy: uuid("confirmed_by").references(() => users.id), // admin yang konfirmasi
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * 
 * Audit trail setiap perubahan status booking -> sumber data untuk "tracking status" di dashboard admin (siapa ubah apa, kapan).
 * 
 * */

export const bookingStatusLogs = pgTable("booking_status_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    status: bookingStatusEnum("status").notNull(),
    changedBy: uuid("change_by").notNull().references(() => users.id),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});