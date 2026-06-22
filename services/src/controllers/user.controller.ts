import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import { updateUserShema } from "../validation/user.schema.js";
import { asyncHandler } from "../utils/async-handler.js";


export class UserController {

    // Gel All Users
    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const data = await UserService.findAll();
        res.json({ success: true, data });
    });

    // Get byId
    static getById = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        if (!id) {
            res.status(400).json({ success: false, message: "ID is required" });
            return;
        }

        const data = await UserService.findById(id);
        if (!data) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.json({ success: true, data });
    });

    static update = asyncHandler(async (req: Request, res: Response) => {
        const parsed = updateUserShema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, errors: parsed.error.flatten().fieldErrors });
            return;
        }

        const user = await UserService.update(req.params.id as string, parsed.data);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.status(200).json({ success: true, data: user });
    });

    static deactivate = asyncHandler(async (req: Request, res: Response) => {
        const user = await UserService.deactive(req.params.id as string);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        res.json({ success: true, message: "User deactivated" });
    });
}