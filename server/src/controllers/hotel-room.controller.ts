import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { createHotelRoomSchema, updateHotelRoomSchema } from "../validation/hotel-room.schema.js";
import { HotelRoomService } from "../services/hotel-room.service.js";

export class HotelRoomController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const rooms = await HotelRoomService.findByHotel(req.params.hotelId as string);
    res.json({ success: true, data: rooms });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const room = await HotelRoomService.getById(req.params.id as string);
    if (!room) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }
    res.json({ success: true, data: room });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createHotelRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const room = await HotelRoomService.create(req.params.hotelId as string, parsed.data);
    res.status(201).json({ success: true, data: room });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateHotelRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const room = await HotelRoomService.update(req.params.id as string, parsed.data);
    if (!room) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }
    res.json({ success: true, data: room });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const room = await HotelRoomService.delete(req.params.id as string);
    if (!room) {
      res.status(404).json({ success: false, message: "Room not found" });
      return;
    }
    res.json({ success: true, message: "Room deleted" });
  });
}
