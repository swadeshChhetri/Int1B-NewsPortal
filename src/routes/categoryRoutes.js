import express from "express";
import * as categoriesController from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/", categoriesController.getAllCategories);
// GET highlights
// router.get("/highlights", categoriesController.getHighlights);

router.get("/:id", categoriesController.getCategoryById);
router.get("/slug/:slug", categoriesController.getCategoryBySlug);
router.post("/", categoriesController.createCategory);
router.put("/:id", categoriesController.updateCategory);
router.delete("/:id", categoriesController.deleteCategory);

export default router;
