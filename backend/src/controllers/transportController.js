// src/controllers/transportController.js
import prisma from "../config/db.js";

/**
 * Create Transport Record (Admin)
 * Linked to an Approved Invoice
 */
export const createTransport = async (req, res) => {
  try {
    const { orderId, truckNo, driverName } = req.body;
    const userRole = req.user.role;

    if (userRole !== "ADMIN")
      return res
        .status(403)
        .json({ message: "Only admin can assign transport" });

    // Validate order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { invoice: true },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.invoice)
      return res
        .status(400)
        .json({ message: "No invoice found for this order" });

    // Create transport entry
    const transport = await prisma.transport.create({
      data: {
        orderId: parseInt(orderId),
        truckNo,
        driverName,
        status: "At Plant",
      },
      include: { order: true },
    });

    // Update order status → "In Transit"
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "In-Transit" },
    });

    res.status(201).json({
      message: "Transport assigned successfully",
      transport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign transport",
      error: error.message,
    });
  }
};

/**
 * Update Transport Status or Upload POD (Admin / Transport Manager)
 */
export const updateTransport = async (req, res) => {
  try {
    const { transportId } = req.params;
    const { status, podFile } = req.body;
    const userRole = req.user.role;

    const validStatuses = ["At Plant", "In Transit", "Delivered"];
    if (status && !validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid transport status" });

    // Only Admin or Transport Manager can update
    if (!["ADMIN", "TRANSPORT"].includes(userRole))
      return res.status(403).json({ message: "Unauthorized role" });

    const transport = await prisma.transport.update({
      where: { id: parseInt(transportId) },
      data: {
        status: status || undefined,
        podFile: podFile || undefined,
      },
    });

    // If Delivered, update order status as well
    if (status === "Delivered") {
      await prisma.order.update({
        where: { id: transport.orderId },
        data: { status: "Delivered" },
      });
    }

    res.json({
      message: "Transport updated successfully",
      transport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update transport",
      error: error.message,
    });
  }
};

/**
 * Get All Transports (Admin, Transport Manager)
 */
export const getAllTransports = async (req, res) => {
  try {
    const { role } = req.user;

    if (!["ADMIN", "TRANSPORT"].includes(role))
      return res.status(403).json({ message: "Unauthorized access" });

    const transports = await prisma.transport.findMany({
      include: {
        order: { include: { product: true, contract: true, invoice: true } },
      },
      orderBy: { id: "desc" },
    });

    res.json({
      message: "Transport records fetched successfully",
      total: transports.length,
      transports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transport records",
      error: error.message,
    });
  }
};

/**
 * Get Transport by Order ID
 */
export const getTransportByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const transport = await prisma.transport.findFirst({
      where: { orderId: parseInt(orderId) },
      include: { order: true },
    });

    if (!transport)
      return res.status(404).json({ message: "Transport record not found" });

    res.json({
      message: "Transport record fetched successfully",
      transport,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transport details",
      error: error.message,
    });
  }
};
