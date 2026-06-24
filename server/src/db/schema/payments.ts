import { jsonb, numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bookings } from "./bookings.js";
import { paymentStatusEnum } from "./enum.js";


export const payments = pgTable("payments", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    bookingId: uuid("booking_id").references(() => bookings.id, {onDelete: "cascade"}).unique(),

    midtransOrderId: varchar("midtrans_order_id", {length: 100}).notNull().unique(),
    midtransTransactionId: varchar("midtrans_transaction_id", {length: 100}),

    paymentMethod: varchar("payment_method", {length: 50}),

    grossAmount: numeric("gross_amount", {precision: 12, scale: 2}).notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),

    snapToken: varchar("snap_token", {length: 255}),
    rawResponse: jsonb("raw_response"),

    paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});