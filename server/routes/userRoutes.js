import express from "express";
import { authenticateJWT, authorize } from "../middlewares/auth.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyToken,
} from "../controllers/userController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Get user profile
router.get("/profile", authenticateJWT, getUserProfile);

// Update user profile
router.put("/profile", authenticateJWT, updateUserProfile);

// token verification
router.post("/verify-token", authenticateJWT, verifyToken);

export default router;
