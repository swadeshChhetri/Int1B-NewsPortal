import mongoose from "mongoose";
import { info, error } from "./logger.js";

export async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    info("✅ Connected to MongoDB");
  } catch (err) {
    error("❌ MongoDB connection error", err);
    throw err;
  }
}
