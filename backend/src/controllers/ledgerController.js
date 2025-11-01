// src/controllers/ledgerController.js
import prisma from "../config/db.js";

/**
 * Get all Ledger Entries (Admin)
 */
export const getAllLedgers = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== "ADMIN")
      return res
        .status(403)
        .json({ message: "Only admin can view all ledgers" });

    const ledgers = await prisma.ledger.findMany({
      include: { party: true },
      orderBy: { date: "desc" },
    });

    res.json({
      message: "All ledgers fetched successfully",
      total: ledgers.length,
      ledgers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ledgers",
      error: error.message,
    });
  }
};

/**
 * Get Ledger by Party ID (Admin, Party)
 */
export const getLedgerByParty = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    if (role !== "ADMIN" && parseInt(id) !== userId)
      return res.status(403).json({ message: "Unauthorized access" });

    const ledgerEntries = await prisma.ledger.findMany({
      where: { partyId: parseInt(id) },
      include: { party: true },
      orderBy: { date: "desc" },
    });

    // Calculate balance
    const totalDebit = ledgerEntries.reduce((a, b) => a + b.debit, 0);
    const totalCredit = ledgerEntries.reduce((a, b) => a + b.credit, 0);
    const balance = totalCredit - totalDebit;

    res.json({
      message: "Ledger fetched successfully",
      balance,
      ledgerEntries,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ledger",
      error: error.message,
    });
  }
};
