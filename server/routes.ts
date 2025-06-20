// This file defines all our API endpoints (routes)
// Routes are like different "doors" into our application that handle specific requests

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ===== EXAMPLES API ENDPOINTS =====
  // These handle project examples with generated AGENTS.md files
  
  // GET /api/examples - Retrieve all examples
  // When the frontend loads the examples gallery, it calls this endpoint
  app.get("/api/examples", async (_req, res) => {
    try {
      // Ask our storage layer to get all examples from the database
      const examples = await storage.getExamples();
      // Send the examples back as JSON (JavaScript Object Notation)
      res.json(examples);
    } catch (error) {
      // If something goes wrong, send an error response
      // Status 500 means "Internal Server Error"
      res.status(500).json({ message: "Failed to fetch examples" });
    }
  });

  // GET /api/examples/:id - Retrieve a specific example by its ID
  // The ":id" part is a parameter that gets filled in with an actual number
  // For example: GET /api/examples/1 would get the example with ID 1
  app.get("/api/examples/:id", async (req, res) => {
    try {
      // Extract the ID from the URL and convert it from string to number
      const id = parseInt(req.params.id);
      
      // Look up the example in our database using the ID
      const example = await storage.getExample(id);
      
      // If no example was found, return a 404 (Not Found) error
      if (!example) {
        return res.status(404).json({ message: "Example not found" });
      }
      
      // If we found the example, send it back as JSON
      res.json(example);
    } catch (error) {
      // Handle any unexpected errors
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
