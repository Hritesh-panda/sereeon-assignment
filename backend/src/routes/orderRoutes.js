// src/routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🟢 Create Order (Customer or Admin)
router.post(
  "/",
  authenticate,
  authorizeRoles("CUSTOMER", "ADMIN"),
  createOrder
);

// 🔵 Get all orders (Admin, Customer)
router.get("/", authenticate, authorizeRoles("ADMIN", "CUSTOMER"), getOrders);

// 🔍 Get single order
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "CUSTOMER"),
  getOrderById
);

// 🟠 Update order status (Admin only)
router.put(
  "/status/:orderId",
  authenticate,
  authorizeRoles("ADMIN"),
  updateOrderStatus
);

export default router;
