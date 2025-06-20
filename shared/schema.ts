// This file defines our database schema and TypeScript types
// Think of it as the "blueprint" for what data looks like in our app
// 📖 Learn more: /docs/tutorials/backend/understanding-database-schema.md

import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the "examples" table structure
// This stores project examples with their generated AGENTS.md files
export const examples = pgTable("examples", {
  // Primary key - unique ID for each example (auto-incremented)
  id: serial("id").primaryKey(),
  
  // Basic information about the project
  title: text("title").notNull(), // Project name (required)
  description: text("description").notNull(), // What the project does (required)
  projectType: text("project_type").notNull(), // "Frontend", "Backend", "Full Stack", etc.
  
  // The actual content we store
  repositoryStructure: text("repository_structure").notNull(), // File/folder structure
  generatedAgentsMd: text("generated_agents_md").notNull(), // The AI-generated AGENTS.md content
  
  // Tags stored as JSON array for flexible categorization
  // Example: ["React", "TypeScript", "E-commerce"]
  tags: json("tags").$type<string[]>().default([]),
});

// Define the "guides" table structure
// This stores tutorial videos and learning content
export const guides = pgTable("guides", {
  // Primary key - unique ID for each guide
  id: serial("id").primaryKey(),
  
  // Guide information
  title: text("title").notNull(), // Guide title (required)
  description: text("description").notNull(), // What you'll learn (required)
  videoUrl: text("video_url"), // YouTube/video link (optional)
  thumbnailColor: text("thumbnail_color").notNull(), // CSS gradient for the card
  category: text("category").notNull(), // "Getting Started", "Advanced", etc.
});

// Create validation schemas for inserting new data
// These ensure data is valid before saving to database

// Schema for creating new examples (excludes auto-generated ID)
export const insertExampleSchema = createInsertSchema(examples).omit({
  id: true, // ID is auto-generated, so we don't include it when creating
}).extend({
  // Override tags to be optional array of strings
  tags: z.array(z.string()).optional(),
});

// Schema for creating new guides (excludes auto-generated ID)
export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true, // ID is auto-generated
});

// TypeScript types derived from our schemas
// These give us type safety throughout our app

// Type for inserting new examples (what we send to the API)
export type InsertExample = z.infer<typeof insertExampleSchema>;

// Type for examples we get back from the database (includes ID)
export type Example = typeof examples.$inferSelect;

// Type for inserting new guides
export type InsertGuide = z.infer<typeof insertGuideSchema>;

// Type for guides we get back from the database
export type Guide = typeof guides.$inferSelect;
