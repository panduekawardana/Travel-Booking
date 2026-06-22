import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import crypto from "node:crypto";
import { db } from "../../db/db.js";
import { users, refreshTokens } from "../../db/schema/index.js";
import { JWT_SECRET } from "../../config/env.js";
import { eq, and, isNull } from "drizzle-orm";

const registerSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(150),
  password: z.string().min(6).max(100),
  phone: z.string().max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(150),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

function generateAccessToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET ?? "", { expiresIn: "15m" });
}

function generateRefreshToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(40).toString("hex");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hash };
}

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const { name, email, password, phone } = parsed.data;

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, passwordHash, phone: phone ?? null })
      .returning();

    if (!newUser) {
      res.status(500).json({ success: false, message: "Failed to create user" });
      return;
    }

    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const { raw: refreshTokenRaw, hash: refreshTokenHash } = generateRefreshToken();

    await db.insert(refreshTokens).values({
      userId: newUser.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          isActive: newUser.isActive,
        },
        accessToken,
        refreshToken: refreshTokenRaw,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Validation error", errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = parsed.data;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: "Account is deactivated" });
      return;
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const { raw: refreshTokenRaw, hash: refreshTokenHash } = generateRefreshToken();

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isActive: user.isActive,
        },
        accessToken,
        refreshToken: refreshTokenRaw,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        createdBy: users.createdBy,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Refresh token is required" });
      return;
    }

    const { refreshToken: rawToken } = parsed.data;
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)))
      .limit(1);

    if (!storedToken) {
      res.status(401).json({ success: false, message: "Invalid or revoked refresh token" });
      return;
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      res.status(401).json({ success: false, message: "Refresh token expired" });
      return;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, storedToken.userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const accessToken = generateAccessToken(user.id, user.email);

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: "Refresh token is required" });
      return;
    }

    const { refreshToken: rawToken } = parsed.data;
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.tokenHash, tokenHash), isNull(refreshTokens.revokedAt)))
      .limit(1);

    if (!storedToken) {
      res.status(401).json({ success: false, message: "Invalid refresh token" });
      return;
    }

    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, storedToken.id));

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
