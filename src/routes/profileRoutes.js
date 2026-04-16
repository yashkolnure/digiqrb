import express from "express";
import {
  saveProfile,
  getMyProfile,
  getProfileByUsername,
  trackLinkClick,
  saveLead
} from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// 🔐 PROTECTED ROUTES (USER LOGGED IN)

// create / update profile
router.post("/", protect, saveProfile);

// get my profile
router.get("/me", protect, getMyProfile);



// 🌐 PUBLIC ROUTES

// get profile by username
router.get("/:username", getProfileByUsername);

// track link clicks
router.post("/click", trackLinkClick);

// save lead (contact form)
router.post("/lead", saveLead);



export default router;