// src/routes/invoiceRoutes.js
import express from "express";
import {
  createInvoice,
  updateInvoiceStatus,
  getInvoices,
  getInvoiceById,
} from "../controllers/invoiceController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🟢 Vendor: Upload Invoice
router.post(
  "/",
  authenticate,
  authorizeRoles("VENDOR", "ADMIN"),
  createInvoice
);

//  Admin: Update Invoice Status
router.put(
  "/status/:invoiceId",
  authenticate,
  authorizeRoles("ADMIN"),
  updateInvoiceStatus
);

//  All roles: Get invoices
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "VENDOR", "CUSTOMER"),
  getInvoices
);

// Get single invoice
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "VENDOR", "CUSTOMER"),
  getInvoiceById
);

export default router;
