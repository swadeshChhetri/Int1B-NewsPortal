import express from "express";
import { searchNews } from "../controllers/searchController.js";

const router = express.Router();

// /api/search?q=...
router.get("/", searchNews);

export default router;
