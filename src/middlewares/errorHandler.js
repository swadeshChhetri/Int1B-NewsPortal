import { error as logError } from "../config/logger.js";

export default function errorHandler(err, req, res, next) {
  logError(err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
