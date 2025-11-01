// src/routes/ledgerRoutes.js
import express from "express";
import {
  getAllLedgers,
  getLedgerByParty,
} from "../controllers/ledgerController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  Admin: View all ledgers
router.get("/", authenticate, authorizeRoles("ADMIN"), getAllLedgers);

//  Admin / Party: View specific ledger
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "CUSTOMER", "VENDOR"),
  getLedgerByParty
);

export default router;
