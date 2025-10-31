import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { verifyToken } from "../middleware/verifyToken";
import { signupSchema, loginSchema } from "../utils/validations/userValidation";
dotenv.config();
const prisma = new PrismaClient();
const router = express.Router();


router.get("/me", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, msg: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});



router.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error?.flatten().fieldErrors });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { userId: createdUser.id, name: createdUser.name, email: createdUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7200000, // 2 hours
      sameSite: "strict",
    });

    res.json({
      success: true,
      msg: "User created successfully",
      token,
      userId: createdUser.id,
      username: createdUser.name,
      useremail: createdUser.email,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error?.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ success: false, msg: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ success: false, msg: "Incorrect password" });

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7200000,
      sameSite: "none",
    });

    res.json({
      success: true,
      msg: "Login successful",
      token,
      userId: user.id,
      username: user.name,
      useremail: user.email,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});


router.post("/logout/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, msg: "User ID is required" });
    const findUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!findUser) return res.status(404).json({ success: false, msg: "User not found" });
    res.clearCookie("token");
    res.status(200).json({ success: true, msg: "User logged out successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
