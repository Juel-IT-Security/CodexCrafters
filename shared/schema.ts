import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const examples = pgTable("examples", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  projectType: text("project_type").notNull(),
  repositoryStructure: text("repository_structure").notNull(),
  generatedAgentsMd: text("generated_agents_md").notNull(),
  tags: json("tags").$type<string[]>().default([]),
});

export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url"),
  thumbnailColor: text("thumbnail_color").notNull(),
  category: text("category").notNull(),
});

export const insertExampleSchema = createInsertSchema(examples).omit({
  id: true,
}).extend({
  tags: z.array(z.string()).optional(),
});

export const insertGuideSchema = createInsertSchema(guides).omit({
  id: true,
});

export type InsertExample = z.infer<typeof insertExampleSchema>;
export type Example = typeof examples.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type Guide = typeof guides.$inferSelect;
