import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { hotelRooms } from "../db/schema/index.js";
import type { CreateHotelRoomInput, UpdateHotelRoomInput } from "../validation/hotel-room.schema.js";

export class HotelRoomService {
  static async findByHotel(hotelId: string) {
    return db.select().from(hotelRooms).where(eq(hotelRooms.hotelId, hotelId));
  }

  static async getById(id: string) {
    const [room] = await db.select().from(hotelRooms).where(eq(hotelRooms.id, id)).limit(1);
    return room ?? null;
  }

  static async create(hotelId: string, input: CreateHotelRoomInput) {
    const [room] = await db.insert(hotelRooms).values({
      hotelId,
      name: input.name,
      description: input.description ?? null,
      pricePerNight: String(input.pricePerNight),
      totalRooms: input.totalRooms,
      facilities: input.facilities ?? [],
    }).returning();
    return room ?? null;
  }

  static async update(id: string, input: UpdateHotelRoomInput) {
    const data: Record<string, unknown> = { ...input };
    if (input.pricePerNight) data.pricePerNight = String(input.pricePerNight);
    const [room] = await db.update(hotelRooms)
      .set(data)
      .where(eq(hotelRooms.id, id))
      .returning();
    return room ?? null;
  }

  static async delete(id: string) {
    const [room] = await db.delete(hotelRooms).where(eq(hotelRooms.id, id)).returning();
    return room ?? null;
  }
}
