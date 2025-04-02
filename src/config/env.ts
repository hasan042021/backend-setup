import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), "env") });

if (!process.env.DB_URL) {
  throw new Error("❌ DATABASE_URL is missing in .env file");
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
  UPLOADS_DIR:
    process.env.UPLOADS_DIR || path.resolve(process.cwd(), "uploads"),
};
