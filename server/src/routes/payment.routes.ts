import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const paymentRouter = Router();

paymentRouter.get("/", authenticate, PaymentController.getAll);
paymentRouter.get("/:id", authenticate, PaymentController.getById);
paymentRouter.get("/booking/:bookingId", authenticate, PaymentController.getByBooking);
paymentRouter.post("/snap", authenticate, PaymentController.createSnapToken);
paymentRouter.post("/callback", PaymentController.midtransCallback);
paymentRouter.patch("/:id/status", authenticate, PaymentController.updateStatus);
