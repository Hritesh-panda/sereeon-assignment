// src/routes/contractRoutes.js
import express from "express";
import {
  createContract,
  updateContractStatus,
  getContracts,
  getContractById,
} from "../controllers/contractController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Create new contract (Customer or Admin)
router.post(
  "/",
  authenticate,
  authorizeRoles("CUSTOMER", "ADMIN"),
  createContract
);

//  Approve / Reject (Admin only)
router.put(
  "/status/:contractId",
  authenticate,
  authorizeRoles("ADMIN", "VENDOR"),
  updateContractStatus
);

//  Fetch all contracts (role-based)
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "CUSTOMER", "VENDOR"),
  getContracts
);

// Get single contract
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "CUSTOMER", "VENDOR"),
  getContractById
);

export default router;
