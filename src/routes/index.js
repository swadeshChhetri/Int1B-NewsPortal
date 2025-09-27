import express from "express";
import taskRoutes from "./taskRoutes.js";
import userRoutes from "./userRoutes.js";
import newsRoutes from "./newsRoutes.js";
import adminRoutes from "./adminRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import adminNewsRoutes from "./adminNewsRoutes.js";
import adminCategoryRoutes from "./adminCategoryRoutes.js";
// import newsletterRoutes from "./newsletterRoutes.js";
import newsletterRoutes from "./newsletterRoutes.js";
import searchRoutes from "./searchRoutes.js";
import adminCommentRoutes from "./adminCommentRoutes.js";

const router = express.Router();

// Client
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);
router.use("/news", newsRoutes);
router.use("/category", categoryRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/search", searchRoutes);  

// Admin
router.use("/admin", adminRoutes);
router.use("/admin/news", adminNewsRoutes);
router.use("/admin/categories", adminCategoryRoutes);
router.use("/admin/comments", adminCommentRoutes);

router.use("/", userRoutes);


export default router;
