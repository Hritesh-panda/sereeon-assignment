// src/routes/userRoutes.js
import express from "express";
import {
  getAllUsers,
  getUsersByRole,
  getUserById,
} from "../controllers/userController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only ADMIN can view all users
router.get("/", authenticate, authorizeRoles(["ADMIN"]), getAllUsers);

// Get users by role (e.g., /users/role/VENDOR)
router.get("/role/:role", authenticate, getUsersByRole);

// Get user by ID
router.get("/:id", authenticate, getUserById);

export default router;
