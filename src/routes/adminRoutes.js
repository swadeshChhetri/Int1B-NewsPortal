import express from "express";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.get("/", adminController.getUsers);

export default router;
