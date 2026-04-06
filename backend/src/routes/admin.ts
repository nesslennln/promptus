import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

function requireAdmin(req: any, res: any, next: any) {
  const pass = req.header("X-Admin-Password");
  if (!pass || pass !== (process.env.ADMIN_PASSWORD ?? "nesslol2020")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/**
 * Reset total (C): borra Users/Games/Rounds/LeaderboardEntry
 * pero CONSERVA AdminLog (y además registra el reset).
 */
router.post("/reset-total", requireAdmin, async (req, res) => {
  await prisma.adminLog.create({
    data: {
      action: "reset_total",
      details: JSON.stringify({
        at: new Date().toISOString(),
        ip: req.ip,
      }),
    },
  });

  // Orden: hijos -> padres
  await prisma.round.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.leaderboardEntry.deleteMany({});
  await prisma.user.deleteMany({});

  res.json({ ok: true, message: "Reset total completed (logs preserved)." });
});

export default router;
