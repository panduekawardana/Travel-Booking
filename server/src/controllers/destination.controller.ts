import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { createDestinationSchema, queryDestinationSchema, updateDestinationSchema } from "../validation/destination.schema.js";
import { DestinationService } from "../services/destination.service.js";

export class DestinationController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const parsed = queryDestinationSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten() });
      return;
    }
    const result = await DestinationService.findAll(parsed.data);
    res.json({ success: true, ...result });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const destination = await DestinationService.getById(req.params.id as string);
    if (!destination) {
      res.status(404).json({ success: false, message: "Destination not found" });
      return;
    }
    res.json({ success: true, data: destination });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createDestinationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const destination = await DestinationService.create(parsed.data);
    res.status(201).json({ success: true, data: destination });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateDestinationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const destination = await DestinationService.update(req.params.id as string, parsed.data);
    if (!destination) {
      res.status(404).json({ success: false, message: "Destination not found" });
      return;
    }
    res.json({ success: true, data: destination });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const destination = await DestinationService.delete(req.params.id as string);
    if (!destination) {
      res.status(404).json({ success: false, message: "Destination not found" });
      return;
    }
    res.json({ success: true, message: "Destination deleted" });
  });
}
