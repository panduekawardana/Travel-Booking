import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { createBookingSchema, queryBookingSchema, updateBookingSchema, updateBookingStatusSchema } from "../validation/booking.schema.js";
import { BookingService } from "../services/booking.service.js";

export class BookingController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const parsed = queryBookingSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten() });
      return;
    }
    const result = await BookingService.findAll(parsed.data);
    res.json({ success: true, ...result });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const booking = await BookingService.getById(req.params.id as string);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.json({ success: true, data: booking });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const booking = await BookingService.create(parsed.data, req.user!.userId);
    res.status(201).json({ success: true, data: booking });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const booking = await BookingService.update(req.params.id as string, parsed.data);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.json({ success: true, data: booking });
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateBookingStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const booking = await BookingService.updateStatus(req.params.id as string, parsed.data, req.user!.userId);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.json({ success: true, data: booking });
  });

  static getLogs = asyncHandler(async (req: Request, res: Response) => {
    const logs = await BookingService.getLogs(req.params.id as string);
    res.json({ success: true, data: logs });
  });

  static getMyBookings = asyncHandler(async (req: Request, res: Response) => {
    const data = await BookingService.getByCustomer(req.user!.userId);
    res.json({ success: true, data });
  });
}
