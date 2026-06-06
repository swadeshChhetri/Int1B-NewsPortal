import express from "express";
import cors from "cors";
import helmet from "helmet";
import { morganMiddleware } from "./config/logger.js";
import env from "./config/env.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: ["http://localhost:5173", "qyoobai.swadextechnologies.in"], // ✅ your actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use("/uploads", express.static("uploads"));
app.use(env.apiPrefix, routes);

// health-check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// central error handler
app.use(errorHandler);

export default app; // 🔥 this replaces module.exports
