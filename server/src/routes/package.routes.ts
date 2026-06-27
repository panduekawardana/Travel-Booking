import { Router } from "express";
import { packageScheduleRouter } from "./package-schedule.routes.js";

export const packageRouter = Router();

packageRouter.use("/:packageId/schedules", packageScheduleRouter);
