import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

// Protected route (dùng để test token trên frontend)
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Token hợp lệ — Protected endpoint hoạt động!",
    userId: req.userId,
  });
});

export default router;
