import { Router } from "express";
import { HotelInventoryController } from "../controllers/hotel-inventory.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const hotelInventoryRouter = Router({ mergeParams: true });

hotelInventoryRouter.get("/", HotelInventoryController.getAll);
hotelInventoryRouter.put("/", authenticate, HotelInventoryController.bulkUpsert);
hotelInventoryRouter.patch("/:id", authenticate, HotelInventoryController.update);
hotelInventoryRouter.delete("/:id", authenticate, HotelInventoryController.delete);
