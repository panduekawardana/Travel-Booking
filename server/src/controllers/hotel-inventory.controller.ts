import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { bulkUpsertInventorySchema, queryInventorySchema, updateInventorySchema } from "../validation/hotel-inventory.schema.js";
import { HotelInventoryService } from "../services/hotel-inventory.service.js";

export class HotelInventoryController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const parsed = queryInventorySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten() });
      return;
    }
    const data = await HotelInventoryService.findByRoom(req.params.roomId as string, parsed.data);
    res.json({ success: true, data });
  });

  static bulkUpsert = asyncHandler(async (req: Request, res: Response) => {
    const parsed = bulkUpsertInventorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const data = await HotelInventoryService.bulkUpsert(req.params.roomId as string, parsed.data);
    res.json({ success: true, data });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateInventorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const item = await HotelInventoryService.update(req.params.id as string, parsed.data);
    if (!item) {
      res.status(404).json({ success: false, message: "Inventory item not found" });
      return;
    }
    res.json({ success: true, data: item });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const item = await HotelInventoryService.delete(req.params.id as string);
    if (!item) {
      res.status(404).json({ success: false, message: "Inventory item not found" });
      return;
    }
    res.json({ success: true, message: "Inventory item deleted" });
  });
}
