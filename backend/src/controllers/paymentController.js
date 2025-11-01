// src/controllers/paymentController.js
import prisma from "../config/db.js";

/**
 * Create Payment (Admin)
 * - Records transaction between payer & payee
 * - Auto-updates Ledger for both sides
 */
export const createPayment = async (req, res) => {
  try {
    const { payerId, payeeId, invoiceId, amount, mode, transactionId } =
      req.body;
    const userRole = req.user.role;

    if (userRole !== "ADMIN")
      return res
        .status(403)
        .json({ message: "Only admin can record payments" });

    // Validate invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(invoiceId) },
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        payerId: parseInt(payerId),
        payeeId: parseInt(payeeId),
        invoiceId: parseInt(invoiceId),
        amount: parseFloat(amount),
        mode,
        transactionId,
        status: "Completed",
      },
      include: { payer: true, payee: true, invoice: true },
    });

    // Update Ledger for both payer and payee
    await prisma.ledger.createMany({
      data: [
        {
          partyId: parseInt(payerId),
          debit: parseFloat(amount),
          credit: 0,
          balance: 0,
          description: `Payment made to ${payment.payee.name}`,
        },
        {
          partyId: parseInt(payeeId),
          debit: 0,
          credit: parseFloat(amount),
          balance: 0,
          description: `Payment received from ${payment.payer.name}`,
        },
      ],
    });

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record payment",
      error: error.message,
    });
  }
};

/**
 * Get Payments (Admin / Payer / Payee)
 */
export const getPayments = async (req, res) => {
  try {
    const { role, id } = req.user;
    let payments;

    if (role === "ADMIN") {
      payments = await prisma.payment.findMany({
        include: { payer: true, payee: true, invoice: true },
        orderBy: { id: "desc" },
      });
    } else {
      payments = await prisma.payment.findMany({
        where: {
          OR: [{ payerId: id }, { payeeId: id }],
        },
        include: { payer: true, payee: true, invoice: true },
        orderBy: { id: "desc" },
      });
    }

    res.json({
      message: "Payments fetched successfully",
      total: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};

/**
 * Get Payment by ID
 */
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: { payer: true, payee: true, invoice: true },
    });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json({ message: "Payment fetched successfully", payment });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};
