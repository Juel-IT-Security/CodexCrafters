// Database connection setup for the AGENTS.md Educational Platform
// This configures PostgreSQL connection using Neon (serverless Postgres) with Drizzle ORM

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket constructor for serverless environments
// Neon requires WebSocket support for serverless database connections
neonConfig.webSocketConstructor = ws;

// Validate that database URL environment variable is set
// This prevents the app from starting without proper database configuration
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool for efficient database connection management
// Connection pooling reuses database connections instead of creating new ones for each query
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle ORM with the connection pool and schema
// This provides type-safe database operations throughout the application
export const db = drizzle({ client: pool, schema });