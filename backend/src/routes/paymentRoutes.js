// src/routes/paymentRoutes.js
import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
} from "../controllers/paymentController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Admin: Record payment
router.post("/", authenticate, authorizeRoles("ADMIN"), createPayment);

//  Admin & Users: View payments
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "CUSTOMER", "VENDOR"),
  getPayments
);

//  View specific payment
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "CUSTOMER", "VENDOR"),
  getPaymentById
);

export default router;
