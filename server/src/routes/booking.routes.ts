import { Router } from "express";
import { BookingController } from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const bookingRouter = Router();

bookingRouter.get("/", authenticate, BookingController.getAll);
bookingRouter.get("/my", authenticate, BookingController.getMyBookings);
bookingRouter.get("/:id", authenticate, BookingController.getById);
bookingRouter.post("/", authenticate, BookingController.create);
bookingRouter.patch("/:id", authenticate, BookingController.update);
bookingRouter.patch("/:id/status", authenticate, BookingController.updateStatus);
bookingRouter.get("/:id/logs", authenticate, BookingController.getLogs);
