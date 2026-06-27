import { Router } from "express";
import { hotelRoomRouter } from "./hotel-room.routes.js";
import { hotelInventoryRouter } from "./hotel-inventory.routes.js";

export const hotelRouter = Router();

hotelRouter.use("/:hotelId/rooms", hotelRoomRouter);
hotelRouter.use("/rooms/:roomId/inventory", hotelInventoryRouter);
