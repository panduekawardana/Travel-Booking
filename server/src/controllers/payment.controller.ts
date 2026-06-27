import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { createPaymentSchema, queryPaymentSchema, updatePaymentStatusSchema, midtransCallbackSchema } from "../validation/payment.schema.js";
import { PaymentService } from "../services/payment.service.js";

export class PaymentController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const parsed = queryPaymentSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten() });
      return;
    }
    const result = await PaymentService.findAll(parsed.data);
    res.json({ success: true, ...result });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const payment = await PaymentService.getById(req.params.id as string);
    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }
    res.json({ success: true, data: payment });
  });

  static getByBooking = asyncHandler(async (req: Request, res: Response) => {
    const payment = await PaymentService.getByBookingId(req.params.bookingId as string);
    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found for this booking" });
      return;
    }
    res.json({ success: true, data: payment });
  });

  static createSnapToken = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const result = await PaymentService.createSnapToken(parsed.data);
    if ("error" in result) {
      res.status(400).json({ success: false, message: result.error });
      return;
    }
    res.status(201).json({ success: true, data: result.data, snapToken: result.snapToken, midtransOrderId: result.midtransOrderId });
  });

  static updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updatePaymentStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const payment = await PaymentService.updateStatus(req.params.id as string, parsed.data);
    if (!payment) {
      res.status(404).json({ success: false, message: "Payment not found" });
      return;
    }
    res.json({ success: true, data: payment });
  });

  static midtransCallback = asyncHandler(async (req: Request, res: Response) => {
    const parsed = midtransCallbackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Invalid callback payload" });
      return;
    }
    const result = await PaymentService.handleMidtransCallback(parsed.data);
    if ("error" in result) {
      res.status(404).json({ success: false, message: result.error });
      return;
    }
    res.json({ success: true, data: result.data });
  });
}
