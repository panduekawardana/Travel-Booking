import { and, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db/db.js";
import { hotelRoomInventory } from "../db/schema/index.js";
import type { BulkUpsertInventoryInput, QueryInventoryInput, UpdateInventoryInput } from "../validation/hotel-inventory.schema.js";

export class HotelInventoryService {
  static async findByRoom(roomId: string, query: QueryInventoryInput) {
    const whereClauses = [eq(hotelRoomInventory.roomId, roomId)];
    if (query.from) whereClauses.push(gte(hotelRoomInventory.date, query.from));
    if (query.to) whereClauses.push(lte(hotelRoomInventory.date, query.to));

    return db.select()
      .from(hotelRoomInventory)
      .where(and(...whereClauses))
      .orderBy(hotelRoomInventory.date);
  }

  static async getById(id: string) {
    const [item] = await db.select().from(hotelRoomInventory).where(eq(hotelRoomInventory.id, id)).limit(1);
    return item ?? null;
  }

  static async bulkUpsert(roomId: string, input: BulkUpsertInventoryInput) {
    const results = [];
    for (const inv of input.inventories) {
      const [existing] = await db.select()
        .from(hotelRoomInventory)
        .where(and(
          eq(hotelRoomInventory.roomId, roomId),
          eq(hotelRoomInventory.date, inv.date),
        ))
        .limit(1);

      if (existing) {
        const [updated] = await db.update(hotelRoomInventory)
          .set({
            availableRooms: inv.availableRooms,
            priceOverride: inv.priceOverride ? String(inv.priceOverride) : null,
          })
          .where(eq(hotelRoomInventory.id, existing.id))
          .returning();
        if (updated) results.push(updated);
      } else {
        const [created] = await db.insert(hotelRoomInventory)
          .values({
            roomId,
            date: inv.date,
            availableRooms: inv.availableRooms,
            priceOverride: inv.priceOverride ? String(inv.priceOverride) : null,
          })
          .returning();
        if (created) results.push(created);
      }
    }
    return results;
  }

  static async update(id: string, input: UpdateInventoryInput) {
    const data: Record<string, unknown> = {};
    if (input.availableRooms !== undefined) data.availableRooms = input.availableRooms;
    if (input.priceOverride !== undefined) data.priceOverride = String(input.priceOverride);

    const [item] = await db.update(hotelRoomInventory)
      .set(data)
      .where(eq(hotelRoomInventory.id, id))
      .returning();
    return item ?? null;
  }

  static async delete(id: string) {
    const [item] = await db.delete(hotelRoomInventory).where(eq(hotelRoomInventory.id, id)).returning();
    return item ?? null;
  }
}
