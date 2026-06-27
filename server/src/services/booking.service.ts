import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { bookingStatusLogs, bookings, products } from "../db/schema/index.js";
import type { CreateBookingInput, QueryBookingInput, UpdateBookingInput, UpdateBookingStatusInput } from "../validation/booking.schema.js";

function generateBookingCode(): string {
  const prefix = "BK";
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${rand}`;
}

export class BookingService {
  static async findAll(query: QueryBookingInput) {
    const { status, productType, customerId, search, from, to, page, limit } = query;
    const offset = (page - 1) * limit;

    const whereClauses = [];
    if (status) whereClauses.push(eq(bookings.status, status));
    if (productType) whereClauses.push(eq(bookings.productType, productType));
    if (customerId) whereClauses.push(eq(bookings.customerId, customerId));
    if (search) whereClauses.push(
      or(
        ilike(bookings.bookingCode, `%${search}%`),
        ilike(bookings.contactName, `%${search}%`),
      )
    );
    if (from) whereClauses.push(gte(bookings.startDate, from));
    if (to) whereClauses.push(lte(bookings.endDate, to));

    const where = whereClauses.length > 0 ? and(...whereClauses) : undefined;

    const [data, totalResult] = await Promise.all([
      db.select({
        id: bookings.id,
        bookingCode: bookings.bookingCode,
        customerId: bookings.customerId,
        productType: bookings.productType,
        productId: bookings.productId,
        roomId: bookings.roomId,
        packageScheduleId: bookings.packageScheduleId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        guestCount: bookings.guestCount,
        unitCount: bookings.unitCount,
        contactName: bookings.contactName,
        contactPhone: bookings.contactPhone,
        subtotal: bookings.subtotal,
        taxAmount: bookings.taxAmount,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
      })
        .from(bookings)
        .where(where)
        .orderBy(desc(bookings.createdAt))
        .limit(limit)
        .offset(offset),

      db.select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(where)
        .then(r => Number(r[0]?.count ?? 0)),
    ]);

    return {
      data,
      pagination: { page, limit, total: totalResult, totalPages: Math.ceil(totalResult / limit) },
    };
  }

  static async getById(id: string) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!booking) return null;

    const logs = await db.select()
      .from(bookingStatusLogs)
      .where(eq(bookingStatusLogs.bookingId, id))
      .orderBy(bookingStatusLogs.createdAt);

    return { ...booking, statusLogs: logs };
  }

  static async create(input: CreateBookingInput, customerId: string) {
    const bookingCode = generateBookingCode();
    const subtotal = "0";
    const taxAmount = "0";
    const totalAmount = "0";

    const [booking] = await db.insert(bookings).values({
      bookingCode,
      customerId,
      productType: input.productType,
      productId: input.productId,
      roomId: input.productType === "hotel" ? input.roomId! : null,
      packageScheduleId: input.productType === "package" ? input.packageScheduleId! : null,
      startDate: input.startDate,
      endDate: input.endDate,
      guestCount: input.guestCount,
      unitCount: input.unitCount,
      contactName: input.contactName,
      contactPhone: input.contactPhone,
      notes: input.notes ?? null,
      subtotal,
      taxAmount,
      totalAmount,
      status: "pending_payment",
    }).returning();

    if (!booking) return null;

    await db.insert(bookingStatusLogs).values({
      bookingId: booking.id,
      status: "pending_payment",
      changedBy: customerId,
      note: "Booking created",
    });

    return this.getById(booking.id);
  }

  static async update(id: string, input: UpdateBookingInput) {
    const [booking] = await db.update(bookings)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return booking ?? null;
  }

  static async updateStatus(id: string, input: UpdateBookingStatusInput, changedBy: string) {
    const [existing] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!existing) return null;

    const [booking] = await db.update(bookings)
      .set({
        status: input.status,
        updatedAt: new Date(),
        confirmedBy: input.status === "confirmed" ? changedBy : existing.confirmedBy,
        confirmedAt: input.status === "confirmed" ? new Date() : existing.confirmedAt,
      })
      .where(eq(bookings.id, id))
      .returning();

    if (!booking) return null;

    await db.insert(bookingStatusLogs).values({
      bookingId: id,
      status: input.status,
      changedBy,
      note: input.note ?? null,
    });

    return this.getById(id);
  }

  static async getLogs(bookingId: string) {
    return db.select()
      .from(bookingStatusLogs)
      .where(eq(bookingStatusLogs.bookingId, bookingId))
      .orderBy(bookingStatusLogs.createdAt);
  }

  static async getByCustomer(customerId: string) {
    return db.select()
      .from(bookings)
      .where(eq(bookings.customerId, customerId))
      .orderBy(desc(bookings.createdAt));
  }
}
