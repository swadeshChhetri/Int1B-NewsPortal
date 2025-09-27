import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";
import { info, error } from "./config/logger.js";

async function start() {
  try {
    await connectDB(env.mongoUri);
    const server = http.createServer(app);
    server.listen(env.port, () =>
      info(`Server listening on port ${env.port}`)
    );
  } catch (err) {
    error("Failed to start server", err);
    process.exit(1);
  }
}

start();
