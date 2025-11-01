// src/controllers/productController.js
import prisma from "../config/db.js";

/**
 * Create Product (ADMIN only)
 */
export const createProduct = async (req, res) => {
  try {
    const { name, sku, price, unit, stock } = req.body;

    // validation
    if (!name || !sku || !price || !unit) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if sku already exists
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return res.status(400).json({ message: "SKU already exists" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        price: parseFloat(price),
        unit,
        stock: stock ? parseFloat(stock) : 0,
      },
    });

    res.status(201).json({
      message: "✅ Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/**
 * Get All Products (ADMIN, VENDOR, CUSTOMER)
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });

    res.status(200).json({
      message: "✅ Products fetched successfully",
      total: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * Get Single Product
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ product });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * Update Product (ADMIN only)
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, unit, stock } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        unit,
        stock: parseFloat(stock),
      },
    });

    res.json({ message: "✅ Product updated successfully", product });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/**
 * Delete Product (ADMIN only)
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
