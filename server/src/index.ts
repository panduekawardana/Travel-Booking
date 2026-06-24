import express from "express";
import type { Request, Response, NextFunction } from "express";
import { NODE_ENV, PORT, URL } from "./config/env.js";
import { userRouter } from "./routes/user.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

/**
 * 
 * * All router connection to controllers
 * * prefix /api/v1/users/
 * 
 * */

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users/", userRouter)

app.use("/api/v1/products/", productRouter);

/**
 * 
 * Global Error Handler
 * 
 * */

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ success: false, message: "Internal server error" });
});


/**
 * 
 * .env.development
 * PORT : 5000
 * URL: http://localhost:5000
 * 
 * */ 

// ? PORT RUNNING

app.listen(PORT, () => {
    console.log(`App running at ${URL} ${NODE_ENV} mode`)
});