import dotenv from "dotenv";

// Load .env variables
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  apiPrefix: process.env.API_PREFIX,
};

export default env;
