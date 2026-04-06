import { Router } from "express";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../db.js";

const router = Router();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const EvaluateBody = z.object({
  userId: z.string().min(1),
  prompt: z.string().min(1).max(8000),
  roundNum: z.number().int().min(1).max(3).default(1),
});

router.post("/evaluate", async (req, res) => {
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: "CLAUDE_API_KEY not configured" });
  }

  const parsed = EvaluateBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid body" });

  const { userId, prompt, roundNum } = parsed.data;

  // Verifica usuario (si no existe, error)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  // Crea una partida (simple)
  const game = await prisma.game.create({ data: { userId } });

  // Pide a Claude un JSON limpio
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content:
          `Evalúa el siguiente prompt del juego PROMPTUS. Responde SOLO JSON (sin markdown):\n` +
          `{"score":1-10,"feedback":"2 frases en español"}\n\n` +
          `PROMPT:\n"""${prompt}"""`,
      },
    ],
  });

  const text = msg.content?.[0]?.type === "text" ? msg.content[0].text : "{}";

  // Parse robusto
  let score = 1;
  let feedback = "Sin feedback";
  try {
    const obj = JSON.parse(text);
    score = Math.max(1, Math.min(10, Number(obj.score ?? 1)));
    feedback = String(obj.feedback ?? feedback);
  } catch {
    // fallback si Claude no respondió JSON válido
  }

  const scoreEarned = score * 25;

  // Guarda ronda
  await prisma.round.create({
    data: {
      gameId: game.id,
      roundNum,
      prompt,
      aiScore: score,
      scoreEarned,
      feedback,
    },
  });

  // Actualiza leaderboard
  await prisma.leaderboardEntry.upsert({
    where: { userId },
    update: { totalScore: { increment: scoreEarned } },
    create: { userId, username: user.username, totalScore: scoreEarned },
  });

  res.json({ score, scoreEarned, feedback });
});

export default router;
