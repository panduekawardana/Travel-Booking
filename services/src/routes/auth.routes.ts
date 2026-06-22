import { Router } from "express";
import { register, login, profile, refreshToken, logout } from "../controllers/auth/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";
 
export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authenticate, profile);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", authenticate, logout);
