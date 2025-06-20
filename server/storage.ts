import { examples, guides, type Example, type Guide, type InsertExample, type InsertGuide } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Examples
  getExamples(): Promise<Example[]>;
  getExample(id: number): Promise<Example | undefined>;
  createExample(example: InsertExample): Promise<Example>;
  
  // Guides
  getGuides(): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;
}

export class DatabaseStorage implements IStorage {
  async getExamples(): Promise<Example[]> {
    const result = await db.select().from(examples);
    return result;
  }

  async getExample(id: number): Promise<Example | undefined> {
    const [example] = await db.select().from(examples).where(eq(examples.id, id));
    return example || undefined;
  }

  async createExample(insertExample: InsertExample): Promise<Example> {
    const [example] = await db
      .insert(examples)
      .values({
        ...insertExample,
        tags: insertExample.tags || []
      })
      .returning();
    return example;
  }

  async getGuides(): Promise<Guide[]> {
    const result = await db.select().from(guides);
    return result;
  }

  async getGuide(id: number): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide || undefined;
  }

  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const [guide] = await db
      .insert(guides)
      .values(insertGuide)
      .returning();
    return guide;
  }
}

export const storage = new DatabaseStorage();
