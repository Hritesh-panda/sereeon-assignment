// src/routes/transportRoutes.js
import express from "express";
import {
  createTransport,
  updateTransport,
  getAllTransports,
  getTransportByOrder,
} from "../controllers/transportController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Admin: Assign transport
router.post("/", authenticate, authorizeRoles("ADMIN"), createTransport);

//  Admin / Transport Manager: Update transport
router.put(
  "/:transportId",
  authenticate,
  authorizeRoles("ADMIN", "TRANSPORT"),
  updateTransport
);

//  Admin / Transport Manager: Get all
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "TRANSPORT"),
  getAllTransports
);

//  Get transport by orderId (any logged-in role)
router.get(
  "/order/:orderId",
  authenticate,
  authorizeRoles("ADMIN", "TRANSPORT", "CUSTOMER"),
  getTransportByOrder
);

export default router;
