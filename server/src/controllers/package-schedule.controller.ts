import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { createPackageScheduleSchema, updatePackageScheduleSchema } from "../validation/package-schedule.schema.js";
import { PackageScheduleService } from "../services/package-schedule.service.js";

export class PackageScheduleController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const data = await PackageScheduleService.findByPackage(req.params.packageId as string);
    res.json({ success: true, data });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const schedule = await PackageScheduleService.getById(req.params.id as string);
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, data: schedule });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createPackageScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const schedule = await PackageScheduleService.create(req.params.packageId as string, parsed.data);
    res.status(201).json({ success: true, data: schedule });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updatePackageScheduleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, error: parsed.error.flatten().fieldErrors });
      return;
    }
    const schedule = await PackageScheduleService.update(req.params.id as string, parsed.data);
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, data: schedule });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const schedule = await PackageScheduleService.delete(req.params.id as string);
    if (!schedule) {
      res.status(404).json({ success: false, message: "Schedule not found" });
      return;
    }
    res.json({ success: true, message: "Schedule deleted" });
  });
}
