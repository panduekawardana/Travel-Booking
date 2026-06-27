import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth";


export const productRouter = Router();

productRouter.get("/", ProductController.getAll);
productRouter.get("/:id", ProductController.getById);
productRouter.post("/", authenticate, ProductController.create);
productRouter.patch("/:id", authenticate, ProductController.update);
productRouter.delete("/:id", authenticate, ProductController.delete);
productRouter.patch("/:id/status", authenticate, ProductController.updateStatus);