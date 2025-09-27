import express from "express";
import * as newsController from "../controllers/newscontroller.js"
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// GET all news
router.get("/", newsController.getAllNews);

// GET highlights
router.get("/highlights", newsController.getHighlights);

// GET single news by ID
router.get("/:id", newsController.getNewsById);

router.delete("/:id", newsController.deleteNews);

// POST create news (with image upload)
router.post("/", upload.single("image"), newsController.createNews);

router.post("/:id", upload.single("image"), newsController.updateNews);

export default router;