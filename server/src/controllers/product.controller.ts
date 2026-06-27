import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { createProductSchema, queryProductSchema, updateProductSchema } from "../validation/product.schema";
import { ProductServices } from "../services/product.service";



export class ProductController {
    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const parsed = queryProductSchema.safeParse(req.query);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: parsed.error.flatten()
            });
            return;
        }

        const result = await ProductServices.findAll(parsed.data);
        res.json({ success: true, ...result });
    });

    static getById = asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductServices.getById(req.params.id as string);
        if (!product) {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
            return;
        }
        res.json({ success: true, data: product });
    })

    static create = asyncHandler(async (req: Request, res: Response) => {
        const parsed = createProductSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                error: parsed.error.flatten().fieldErrors
            });
            return;
        }
        const data = {
            ...parsed.data,
            createdBy: req.user?.userId,
        };

        const product = await ProductServices.createProduct(data as any);
        res.status(201).json({ success: true, data: product });
    });

    static update = asyncHandler(async (req: Request, res: Response) => {
        const parsed = updateProductSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                success: false,
                errors: parsed.error.flatten().fieldErrors
            });
            return;
        }

        const product = await ProductServices.update(req.params.id as string, parsed.data);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }

        res.json({ success: true, data: product });
    });

    static delete = asyncHandler(async (req: Request, res: Response) => {
        const product = await ProductServices.delete(req.params.id as string);

        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        res.json({ success: true, message: "Product deleted" });
    });

    static updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const { status } = req.body;

        if(!["draft", "published", "archived"].includes(status)){
            res.status(400).json({success: false, message: "Invalid status"});
            return;
        }

        const product = await ProductServices.updateStatus(req.params.id as string, status);
        if(!product){
            res.status(404).json({success: false, message: "Product not found"});
            return;
        }
        res.json({ success: true, data: product });
    });
}