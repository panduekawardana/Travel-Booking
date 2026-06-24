import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.js";
import { createProductSchema, updateProductSchema, queryProductSchema } from "../validation/product.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export class ProductController {
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const parsed = queryProductSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const result = await ProductService.findAll(parsed.data);
    res.json({ success: true, ...result });
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.findById(req.params.id as string);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, data: product });
  });

  static create = asyncHandler(async (req: Request, res: Response) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const product = await ProductService.create(parsed.data, req.user!.userId);
    res.status(201).json({ success: true, data: product });
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const product = await ProductService.update(req.params.id as string, parsed.data);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, data: product });
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.delete(req.params.id as string);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }

    res.json({ success: true, message: "Product deleted" });
  });
}
