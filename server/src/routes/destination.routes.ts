import { Router } from "express";
import { DestinationController } from "../controllers/destination.controller.js";
import { authenticate } from "../middlewares/auth.js";

export const destinationRouter = Router();

destinationRouter.get("/", DestinationController.getAll);
destinationRouter.get("/:id", DestinationController.getById);
destinationRouter.post("/", authenticate, DestinationController.create);
destinationRouter.patch("/:id", authenticate, DestinationController.update);
destinationRouter.delete("/:id", authenticate, DestinationController.delete);
