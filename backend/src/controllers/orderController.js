// src/controllers/orderController.js
import prisma from "../config/db.js";

/**
 * Create Order
 * - Customer can create Sales Order (linked to Approved Contract)
 * - Admin can create Purchase Order (linked to Vendor Contract)
 */
export const createOrder = async (req, res) => {
  try {
    const { contractId, productId, qty } = req.body;
    const userRole = req.user.role;
    const createdById = req.user.id;

    // Validate contract
    const contract = await prisma.contract.findUnique({
      where: { id: parseInt(contractId) },
    });

    if (!contract)
      return res.status(404).json({ message: "Contract not found" });

    if (contract.status !== "Approved")
      return res.status(400).json({ message: "Contract not approved yet" });

    // Validate product
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Validate role
    let orderType;
    if (userRole === "CUSTOMER") orderType = "SALES";
    else if (userRole === "ADMIN") orderType = "PURCHASE";
    else
      return res.status(403).json({ message: "Unauthorized role for order" });

    // Check available quantity
    if (qty > contract.balanceQty)
      return res
        .status(400)
        .json({ message: "Quantity exceeds contract balance" });

    // Create order
    const order = await prisma.order.create({
      data: {
        type: orderType,
        contractId: parseInt(contractId),
        productId: parseInt(productId),
        qty: parseFloat(qty),
        createdById,
        status: "Pending",
      },
      include: { product: true, contract: true },
    });

    // Update contract balanceQty
    await prisma.contract.update({
      where: { id: parseInt(contractId) },
      data: { balanceQty: { decrement: parseFloat(qty) } },
    });

    res.status(201).json({
      message: `${orderType} Order created successfully`,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

/**
 * Get All Orders (Role-based)
 * - Admin: all orders
 * - Customer: own sales orders
 * - Vendor: purchase orders (future link)
 */
export const getOrders = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let orders;

    if (role === "ADMIN") {
      orders = await prisma.order.findMany({
        include: { product: true, contract: true, createdBy: true },
        orderBy: { id: "desc" },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { createdById: userId },
        include: { product: true, contract: true },
        orderBy: { id: "desc" },
      });
    }

    res.json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

/**
 * Update Order Status (Admin only)
 * Example: Pending → Approved → Dispatched → Delivered
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Approved", "In-Transit", "Delivered"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid order status" });

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
    });

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

/**
 * Get Order Details by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { product: true, contract: true, createdBy: true },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order fetched successfully", order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};
