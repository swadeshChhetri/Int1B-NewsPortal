import express from "express";
import * as newsController from "../controllers/newscontroller.js"
import { upload } from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/", newsController.getAllNews);
router.get("/getHighlightNewsWithCategory", newsController.getHighlightNewsWithCategory);
router.get("/:id", newsController.getNewsById);
router.delete("/:id", newsController.deleteNews);
router.post("/", upload.single("image"), newsController.createNews);
router.post("/:id", upload.single("image"), newsController.updateNews);
router.post("/:newsId/comments", authMiddleware, newsController.postComment);

export default router;
