// Storage layer for the AGENTS.md Educational Platform
// This implements the Repository pattern to separate data access from business logic
// 📖 Learn more: /docs/tutorials/backend/understanding-storage-layer.md

import { examples, guides, type Example, type Guide, type InsertExample, type InsertGuide } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface defining all storage operations our application needs
// This contract ensures consistency and enables easy testing with mock implementations
export interface IStorage {
  // Examples operations - managing project examples with generated AGENTS.md files
  getExamples(): Promise<Example[]>;
  getExample(id: number): Promise<Example | undefined>;
  createExample(example: InsertExample): Promise<Example>;
  
  // Guides operations - managing tutorial guides and learning content
  getGuides(): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
}

// Implementation of the storage interface using PostgreSQL database
// All methods are async because database operations are inherently asynchronous
export class DatabaseStorage implements IStorage {
  
  // ===== EXAMPLES OPERATIONS =====
  
  // Retrieve all project examples from the database
  // Returns a Promise that resolves to an array of Example objects
  async getExamples(): Promise<Example[]> {
    // Drizzle ORM provides type-safe queries - select all rows from examples table
    const result = await db.select().from(examples);
    return result;
  }

  // Retrieve a specific example by its unique ID
  // Returns the example if found, undefined if not found
  async getExample(id: number): Promise<Example | undefined> {
    // Query for a single example using WHERE clause with the provided ID
    const [example] = await db.select().from(examples).where(eq(examples.id, id));
    // Return example or undefined if not found
    return example || undefined;
  }

  // Create a new example in the database
  // Takes the data to insert and returns the created example with its new ID
  async createExample(insertExample: InsertExample): Promise<Example> {
    // Insert new example and return the created record
    const [example] = await db
      .insert(examples)
      .values({
        ...insertExample,
        tags: insertExample.tags
      })
      .returning();
    return example;
  }

  // ===== GUIDES OPERATIONS =====
  
  // Retrieve all tutorial guides from the database
  async getGuides(): Promise<Guide[]> {
    const result = await db.select().from(guides);
    return result;
  }

  // Retrieve a specific guide by its unique ID
  async getGuide(id: number): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide || undefined;
  }

  // Create a new guide in the database
  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const [guide] = await db
      .insert(guides)
      .values(insertGuide) // Insert all provided guide data
      .returning(); // Get back the created guide with its new ID
    return guide;
  }
}

// Create and export a single instance of our storage implementation
// This singleton pattern ensures we reuse the same database connection pool
export const storage = new DatabaseStorage();
