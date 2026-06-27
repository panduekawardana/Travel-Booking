import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { bookings, payments } from "../db/schema/index.js";
import type { CreatePaymentInput, MidtransCallbackInput, QueryPaymentInput, UpdatePaymentStatusInput } from "../validation/payment.schema.js";
import crypto from "node:crypto";
import { sql } from "drizzle-orm";

export class PaymentService {
  static async findAll(query: QueryPaymentInput) {
    const { status, bookingId, page, limit } = query;
    const offset = (page - 1) * limit;

    const whereClauses = [];
    if (status) whereClauses.push(eq(payments.status, status));
    if (bookingId) whereClauses.push(eq(payments.bookingId, bookingId));

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    const [data, totalResult] = await Promise.all([
      db.select()
        .from(payments)
        .where(where)
        .orderBy(desc(payments.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` })
        .from(payments)
        .where(where)
        .then(r => Number(r[0]?.count ?? 0)),
    ]);

    return {
      data,
      pagination: { page, limit, total: totalResult, totalPages: Math.ceil(totalResult / limit) },
    };
  }

  static async getById(id: string) {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return payment ?? null;
  }

  static async getByBookingId(bookingId: string) {
    const [payment] = await db.select().from(payments).where(eq(payments.bookingId, bookingId)).limit(1);
    return payment ?? null;
  }

  static async createSnapToken(input: CreatePaymentInput) {
    const [existingBooking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
    if (!existingBooking) return { error: "Booking not found" };

    const midtransOrderId = `TRX-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const [payment] = await db.insert(payments).values({
      bookingId: input.bookingId,
      midtransOrderId,
      grossAmount: String(input.grossAmount),
      status: "pending",
    }).returning();

    if (!payment) return { error: "Failed to create payment" };

    const snapToken = crypto.randomBytes(16).toString("hex");

    await db.update(payments)
      .set({ snapToken })
      .where(eq(payments.id, payment.id));

    return {
      data: {
        ...payment,
        snapToken,
      },
      snapToken,
      midtransOrderId,
    };
  }

  static async updateStatus(id: string, input: UpdatePaymentStatusInput) {
    const data: Record<string, unknown> = {
      status: input.status,
      updatedAt: new Date(),
    };
    if (input.midtransTransactionId) data.midtransTransactionId = input.midtransTransactionId;
    if (input.paymentMethod) data.paymentMethod = input.paymentMethod;
    if (input.rawResponse) data.rawResponse = input.rawResponse;
    if (input.paidAt) data.paidAt = new Date(input.paidAt);
    if (input.status === "settlement" || input.status === "capture") data.paidAt = new Date();

    const [payment] = await db.update(payments)
      .set(data)
      .where(eq(payments.id, id))
      .returning();
    return payment ?? null;
  }

  static async handleMidtransCallback(input: MidtransCallbackInput) {
    const [payment] = await db.select()
      .from(payments)
      .where(eq(payments.midtransOrderId, input.order_id))
      .limit(1);
    if (!payment) return { error: "Payment not found" };

    const statusMap: Record<string, string> = {
      settlement: "settlement",
      capture: "capture",
      deny: "deny",
      cancel: "cancel",
      expire: "expire",
      failure: "failure",
      pending: "pending",
    };

    const newStatus = statusMap[input.transaction_status] ?? "pending";

    await db.update(payments)
      .set({
        status: newStatus as any,
        midtransTransactionId: input.transaction_id ?? payment.midtransTransactionId,
        paymentMethod: input.payment_type ?? payment.paymentMethod,
        rawResponse: input as any,
        paidAt: newStatus === "settlement" || newStatus === "capture" ? new Date() : payment.paidAt,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, payment.id));

    if (newStatus === "settlement" || newStatus === "capture") {
      await db.update(bookings)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(bookings.id, payment.bookingId!));
    }

    const [updated] = await db.select().from(payments).where(eq(payments.id, payment.id)).limit(1);
    return { data: updated };
  }
}
