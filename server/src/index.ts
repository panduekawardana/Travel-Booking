import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { NODE_ENV, PORT, URL } from "./config/env.js";
import { userRouter } from "./routes/user.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { destinationRouter } from "./routes/destination.routes.js";
import { hotelRouter } from "./routes/hotel.routes.js";
import { packageRouter } from "./routes/package.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/destinations", destinationRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/packages", packageRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR]`, err);
  res.status(500).json({ success: false, message: "Internal server error", error: err.message, stack: err.stack });
});

app.listen(PORT, () => {
  console.log(`App running at ${URL} ${NODE_ENV} mode`);
});
