import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScoreSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/scores", async (_req, res) => {
    const scores = await storage.getTopScores();
    res.json(scores);
  });

  app.post("/api/scores", async (req, res) => {
    const result = insertScoreSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid score data" });
      return;
    }

    const score = await storage.createScore(result.data);
    res.json(score);
  });

  const httpServer = createServer(app);
  return httpServer;
}
