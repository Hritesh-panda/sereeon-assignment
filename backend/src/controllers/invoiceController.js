// src/controllers/invoiceController.js
import prisma from "../config/db.js";

/**
 * Create Invoice (Vendor)
 */
export const createInvoice = async (req, res) => {
  try {
    const { orderId, amount, tax, waybillNo, fileUrl } = req.body;
    const userRole = req.user.role;

    if (userRole !== "VENDOR")
      return res
        .status(403)
        .json({ message: "Only vendors can upload invoices" });

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { contract: true },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        orderId: parseInt(orderId),
        type: order.type,
        amount: parseFloat(amount),
        tax: parseFloat(tax),
        waybillNo,
        fileUrl,
        status: "Pending",
      },
      include: { order: true },
    });

    // Update order status → "In Transit"
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "In-Transit" },
    });

    res.status(201).json({
      message: "Invoice uploaded successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

/**
 * Update Invoice Status (Admin)
 */
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Verified", "In-Transit", "Delivered"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const invoice = await prisma.invoice.update({
      where: { id: parseInt(invoiceId) },
      data: { status },
    });

    res.json({
      message: `Invoice status updated to ${status}`,
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update invoice status",
      error: error.message,
    });
  }
};

/**
 * Get All Invoices (Role-based)
 * - Admin sees all
 * - Vendor sees own uploaded invoices
 * - Customer sees invoices linked to their orders
 */
export const getInvoices = async (req, res) => {
  try {
    const { role, id } = req.user;
    let invoices;

    if (role === "ADMIN") {
      invoices = await prisma.invoice.findMany({
        include: { order: { include: { contract: true, product: true } } },
        orderBy: { id: "desc" },
      });
    } else if (role === "VENDOR") {
      invoices = await prisma.invoice.findMany({
        where: { type: "PURCHASE" },
        include: { order: true },
        orderBy: { id: "desc" },
      });
    } else if (role === "CUSTOMER") {
      invoices = await prisma.invoice.findMany({
        where: { type: "SALES" },
        include: { order: true },
        orderBy: { id: "desc" },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.json({
      message: "Invoices fetched successfully",
      total: invoices.length,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
};

/**
 * Get Invoice by ID
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: { include: { product: true, contract: true, createdBy: true } },
      },
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice fetched successfully", invoice });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch invoice details",
      error: error.message,
    });
  }
};
