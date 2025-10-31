import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import {sampleSchema } from "../utils/validations/movieSchemaValidation";
import {verifyToken} from "../middleware/verifyToken"
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response): Promise<void | Response> => {
  const limit = Math.min(Number(req.query.limit) || 10, 10);
  const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

  try {
    const items = await prisma.entry.findMany({
      orderBy: { id: "asc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const nextCursor = items.length > limit ? items.pop()?.id ?? null : null;

// If a cursor is provided, add the cursor and skip properties to continue from where we left off.
// Otherwise, add nothing and fetch the first page.

    res.status(200).json({ success: true, items, nextCursor });
  } catch (err) {
    console.error("[GET /entries] Error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


router.get("/:id", verifyToken, async (req: Request, res: Response): Promise<void | Response> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "Invalid ID" });
  }
  try {
    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }

    res.status(200).json({ success: true, entry });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }

    console.error("[DELETE /entries/:id] Error:", err);
    res.status(500).json({ success: false, error: "Failed to delete entry" });
  }
});




router.post("/", verifyToken, async (req: Request, res: Response): Promise<void | Response> => {
  const parse = sampleSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error?.flatten().fieldErrors });
  }
  const existingEntry = await prisma.entry.findFirst({ where: { title: parse.data.title } });
  if (existingEntry) {
    return res.status(409).json({ success: false, error: "An entry with this title already exists." });
  }
  if(parse.data.type==="TV_SHOW" && !/^\d{4}-\d{4}$/.test(parse.data.yearOrTime) ){
    return res.status(400).json({ success: false, error: "TV_SHOW must have a year range (e.g. YYYY-YYYY)." });
  } 
  try {
    const entry = await prisma.entry.create({ data: parse.data });
    res.status(201).json({ success: true, entry });
  } catch (err) {
    console.error("[POST /entries] Error:", err);
    res.status(500).json({ success: false, error: "Failed to create entry" });
  }
});

router.put("/:id", verifyToken, async (req: Request, res: Response): Promise<void | Response> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "Invalid ID" });
  }

  const parse = sampleSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ success: false, error: parse.error?.flatten().fieldErrors });
  }

  try {
    const updated = await prisma.entry.update({
      where: { id },
      data: parse.data,
    }); 
    
    res.status(200).json(updated);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    console.error("[PUT /entries/:id] Error:", err);
    res.status(500).json({ success: false, error: "Failed to update entry" });
  }
});

router.delete("/:id", verifyToken, async (req: Request, res: Response): Promise<void | Response> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, error: "Invalid ID" });
  }

  try {
    const entry = await prisma.entry.findUnique({ where: { id } });
    if (!entry) {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    
    await prisma.entry.delete({ where: { id } });
    res.status(200).json({ success: true });

  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, error: "Entry not found" });
    }
    console.error("[DELETE /entries/:id] Error:", err);
    res.status(500).json({ success: false, error: "Failed to delete entry" });
  }
});

export default router;
