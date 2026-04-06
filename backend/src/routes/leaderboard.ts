import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// Top 50
router.get("/top", async (_req, res) => {
  const rows = await prisma.leaderboardEntry.findMany({
    orderBy: { totalScore: "desc" },
    take: 50,
  });

  res.json({
    leaderboard: rows.map((r, i) => ({ rank: i + 1, ...r })),
  });
});

export default router;
