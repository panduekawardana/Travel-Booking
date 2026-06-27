import { Router } from "express";
import { HotelRoomController } from "../controllers/hotel-room.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const hotelRoomRouter = Router({ mergeParams: true });

hotelRoomRouter.get("/", HotelRoomController.getAll);
hotelRoomRouter.get("/:id", HotelRoomController.getById);
hotelRoomRouter.post("/", authenticate, HotelRoomController.create);
hotelRoomRouter.patch("/:id", authenticate, HotelRoomController.update);
hotelRoomRouter.delete("/:id", authenticate, HotelRoomController.delete);
