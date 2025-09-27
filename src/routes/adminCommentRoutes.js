import express from "express";

import * as newsController from "../controllers/newscontroller.js"

const router = express.Router();

router.get("/latest", newsController.getLatestComments);

export default router;