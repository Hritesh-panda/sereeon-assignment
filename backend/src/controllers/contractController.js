// src/controllers/contractController.js
import prisma from "../config/db.js";

/**
 * Create a new contract
 * - If role = CUSTOMER → Sales Contract (Customer → Admin)
 * - If role = ADMIN → Purchase Contract (Admin → Vendor)
 */
export const createContract = async (req, res) => {
  try {
    const { productId, totalQty, validityStart, validityEnd, terms, partyId } =
      req.body;
    const userRole = req.user.role;

    let type;
    if (userRole === "CUSTOMER") type = "SALES";
    else if (userRole === "ADMIN") type = "PURCHASE";
    else return res.status(403).json({ message: "Unauthorized role" });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const contract = await prisma.contract.create({
      data: {
        type,
        partyId,
        productId,
        totalQty: parseFloat(totalQty),
        balanceQty: parseFloat(totalQty),
        validityStart: new Date(validityStart),
        validityEnd: new Date(validityEnd),
        terms,
        status: "Pending",
      },
      include: { product: true, party: true },
    });

    res.status(201).json({
      message: `${type} contract created successfully`,
      contract,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create contract",
      error: error.message,
    });
  }
};

/**
 * Approve or Reject contract (Admin only)
 */
export const updateContractStatus = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const contract = await prisma.contract.update({
      where: { id: parseInt(contractId) },
      data: { status },
    });

    res.json({ message: `Contract ${status}`, contract });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update contract status",
      error: error.message,
    });
  }
};

/**
 * Get all contracts (filtered by role)
 * - Admin sees all
 * - Customer sees own sales contracts
 * - Vendor sees own purchase contracts
 */
export const getContracts = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let contracts;

    if (role === "ADMIN") {
      contracts = await prisma.contract.findMany({
        include: { product: true, party: true },
        orderBy: { id: "desc" },
      });
    } else {
      contracts = await prisma.contract.findMany({
        where: { partyId: userId },
        include: { product: true, party: true },
        orderBy: { id: "desc" },
      });
    }

    res.json({ message: "Contracts fetched successfully", contracts });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contracts",
      error: error.message,
    });
  }
};

/**
 * Get single contract details
 */
export const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await prisma.contract.findUnique({
      where: { id: parseInt(id) },
      include: { product: true, party: true, orders: true },
    });
    if (!contract)
      return res.status(404).json({ message: "Contract not found" });
    res.json({ contract });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contract details",
      error: error.message,
    });
  }
};
