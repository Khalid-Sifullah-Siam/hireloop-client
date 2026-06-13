import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const databaseName = (process.env.DATABASE_NAME || "hireloop").trim();

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from your environment variables.");
}

const globalCache = globalThis;

// In development, Next.js reloads files often. Reusing the same client avoids
// opening a new MongoDB connection on every reload.
if (!globalCache.hireLoopMongoClient) {
  globalCache.hireLoopMongoClient = new MongoClient(mongoUri);
}

export const client = globalCache.hireLoopMongoClient;
export const db = client.db(databaseName);
