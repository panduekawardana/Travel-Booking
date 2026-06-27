import { Router } from "express";
import { register, login, loginAdmin, profile, refreshToken, logout } from "../controllers/auth/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
 
export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/admin/login", loginAdmin);
authRouter.get("/profile", authenticate, profile);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", authenticate, logout);
