import { Router } from "express";
import { PackageScheduleController } from "../controllers/package-schedule.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const packageScheduleRouter = Router({ mergeParams: true });

packageScheduleRouter.get("/", PackageScheduleController.getAll);
packageScheduleRouter.get("/:id", PackageScheduleController.getById);
packageScheduleRouter.post("/", authenticate, PackageScheduleController.create);
packageScheduleRouter.patch("/:id", authenticate, PackageScheduleController.update);
packageScheduleRouter.delete("/:id", authenticate, PackageScheduleController.delete);
