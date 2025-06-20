import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all examples
  app.get("/api/examples", async (_req, res) => {
    try {
      const examples = await storage.getExamples();
      res.json(examples);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch examples" });
    }
  });

  // Get specific example
  app.get("/api/examples/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const example = await storage.getExample(id);
      if (!example) {
        return res.status(404).json({ message: "Example not found" });
      }
      res.json(example);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch example" });
    }
  });

  // Get all video guides
  app.get("/api/guides", async (_req, res) => {
    try {
      const guides = await storage.getGuides();
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guides" });
    }
  });

  // Get specific guide
  app.get("/api/guides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guide = await storage.getGuide(id);
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guide" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
