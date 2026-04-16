import express from "express";
import { getAllUsers } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);

export default router;