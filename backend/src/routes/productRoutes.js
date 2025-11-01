// src/routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create Product (Admin only)
router.post("/", authenticate, authorizeRoles("ADMIN"), createProduct);

//  Get all products (Admin, Vendor, Customer)
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "VENDOR", "CUSTOMER"),
  getAllProducts
);

//  Get single product (Admin, Vendor, Customer)
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "VENDOR", "CUSTOMER"),
  getProductById
);

//  Update product (Admin only)
router.put("/:id", authenticate, authorizeRoles("ADMIN"), updateProduct);

//  Delete product (Admin only)
router.delete("/:id", authenticate, authorizeRoles("ADMIN"), deleteProduct);

export default router;
