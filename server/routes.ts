// This file defines all our API endpoints (routes)
// Routes are like different "doors" into our application that handle specific requests
// 📖 Learn more: /docs/tutorials/backend/understanding-api-routes.md

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

  // ===== GUIDES API ENDPOINTS =====
  // These handle operations for tutorial guides and learning content
  
  // GET /api/guides - Get all tutorial guides
  // This powers the video guides section of our app
  app.get("/api/guides", async (_req, res) => {
    try {
      // Get all guides from database
      const guides = await storage.getGuides();
      res.json(guides);
    } catch (error) {
      console.error("Error fetching guides:", error);
      res.status(500).json({ message: "Failed to fetch guides" });
    }
  });

  // GET /api/guides/:id - Get a specific guide by ID
  // This is used when someone clicks on a specific tutorial
  app.get("/api/guides/:id", async (req, res) => {
    try {
      // Extract and validate the ID parameter
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      // Look up the guide in our database
      const guide = await storage.getGuide(id);
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }
      
      res.json(guide);
    } catch (error) {
      console.error("Error fetching guide:", error);
      res.status(500).json({ message: "Failed to fetch guide" });
    }
  });

  // Create and return the HTTP server
  // This is what actually listens for incoming requests
  // ===== DOCUMENTATION API ENDPOINTS =====
  // Serve documentation content from the /docs folder
  
  // GET /api/docs - Get documentation structure and file list
  app.get("/api/docs", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const docsPath = path.join(process.cwd(), 'docs');
      const structure = await buildDocsStructure(docsPath);
      
      res.json(structure);
    } catch (error) {
      console.error("Error reading docs structure:", error);
      res.status(500).json({ message: "Failed to load documentation structure" });
    }
  });

  // GET /api/docs/content - Get specific documentation file content
  app.get("/api/docs/content", async (req, res) => {
    try {
      const { path: filePath } = req.query;
      
      if (!filePath || typeof filePath !== 'string') {
        return res.status(400).json({ message: "File path is required" });
      }
      
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Security: ensure the path is within docs directory
      const safePath = path.join(process.cwd(), 'docs', filePath);
      const normalizedPath = path.normalize(safePath);
      const docsPath = path.normalize(path.join(process.cwd(), 'docs'));
      
      if (!normalizedPath.startsWith(docsPath)) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const content = await fs.readFile(normalizedPath, 'utf-8');
      res.json({ content, path: filePath });
      
    } catch (error) {
      console.error("Error reading documentation file:", error);
      res.status(404).json({ message: "Documentation file not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to build documentation structure from file system
async function buildDocsStructure(docsPath: string) {
  const fs = await import('fs/promises');
  const path = await import('path');

  const structure = {
    sections: [] as any[],
    totalFiles: 0,
    totalTutorials: 0
  };

  async function scanDirectory(dirPath: string, relativePath = '') {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isDirectory() && !item.name.startsWith('.')) {
          const sectionPath = path.join(dirPath, item.name);
          const sectionRelativePath = path.join(relativePath, item.name);
          
          const section = {
            id: item.name,
            title: formatSectionTitle(item.name),
            path: sectionRelativePath,
            files: [] as any[],
            subsections: [] as any[]
          };

          // Scan for files in this directory
          const sectionItems = await fs.readdir(sectionPath, { withFileTypes: true });
          
          for (const sectionItem of sectionItems) {
            if (sectionItem.isFile() && sectionItem.name.endsWith('.md')) {
              const filePath = path.join(sectionRelativePath, sectionItem.name);
              const fileContent = await fs.readFile(path.join(sectionPath, sectionItem.name), 'utf-8');
              
              // Extract title from markdown
              const titleMatch = fileContent.match(/^#\s+(.+)$/m);
              const title = titleMatch ? titleMatch[1] : formatFileName(sectionItem.name);
              
              // Extract description (first paragraph)
              const descMatch = fileContent.match(/^(?:#.*\n\n)(.+?)$/m);
              const description = descMatch ? descMatch[1].substring(0, 150) + '...' : '';

              section.files.push({
                name: sectionItem.name,
                title,
                description,
                path: filePath,
                size: fileContent.length
              });
              
              structure.totalFiles++;
              if (sectionItem.name.includes('tutorial') || section.id === 'beginner' || section.id === 'tutorials') {
                structure.totalTutorials++;
              }
            } else if (sectionItem.isDirectory()) {
              // Handle subsections
              const subsectionPath = path.join(sectionPath, sectionItem.name);
              const subsectionRelativePath = path.join(sectionRelativePath, sectionItem.name);
              
              const subsection = {
                id: sectionItem.name,
                title: formatSectionTitle(sectionItem.name),
                path: subsectionRelativePath,
                files: [] as any[]
              };

              const subsectionItems = await fs.readdir(subsectionPath, { withFileTypes: true });
              for (const subItem of subsectionItems) {
                if (subItem.isFile() && subItem.name.endsWith('.md')) {
                  const filePath = path.join(subsectionRelativePath, subItem.name);
                  const fileContent = await fs.readFile(path.join(subsectionPath, subItem.name), 'utf-8');
                  
                  const titleMatch = fileContent.match(/^#\s+(.+)$/m);
                  const title = titleMatch ? titleMatch[1] : formatFileName(subItem.name);
                  
                  const descMatch = fileContent.match(/^(?:#.*\n\n)(.+?)$/m);
                  const description = descMatch ? descMatch[1].substring(0, 150) + '...' : '';

                  subsection.files.push({
                    name: subItem.name,
                    title,
                    description,
                    path: filePath,
                    size: fileContent.length
                  });
                  
                  structure.totalFiles++;
                  structure.totalTutorials++;
                }
              }

              if (subsection.files.length > 0) {
                section.subsections.push(subsection);
              }
            }
          }

          if (section.files.length > 0 || section.subsections.length > 0) {
            structure.sections.push(section);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error);
    }
  }

  await scanDirectory(docsPath);
  return structure;
}

function formatSectionTitle(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatFileName(name: string): string {
  return name
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '') // Remove number prefixes
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
