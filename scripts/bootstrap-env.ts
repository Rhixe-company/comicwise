// scripts/bootstrap-env.ts
// Ensures .env.local is loaded before any other code
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
