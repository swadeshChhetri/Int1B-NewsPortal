import express from "express";
import * as userController from "../controllers/userController.js";
// import { verifyAdmin } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById); // fetch one
router.put("/:id", userController.updateUser); // update
router.delete("/:id", userController.deleteUser);

export default router;
