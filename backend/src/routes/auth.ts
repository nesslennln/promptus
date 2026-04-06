import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";

const router = Router();

const LoginBody = z.object({
  username: z.string().trim().min(1).max(32),
});

router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid username" });

  const username = parsed.data.username.toLowerCase();

  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username },
  });

  await prisma.leaderboardEntry.upsert({
    where: { userId: user.id },
    update: { username },
    create: { userId: user.id, username },
  });

  res.json({ user });
});

export default router;
