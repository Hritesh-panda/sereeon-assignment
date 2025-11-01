// src/controllers/userController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        contact: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 🔹 Get users by role (e.g., vendors, customers, etc.)
export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await prisma.user.findMany({
      where: { role: role.toUpperCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        contact: true,
        createdAt: true,
      },
    });

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({ message: "Failed to fetch users by role" });
  }
};

// 🔹 Get a single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        contact: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
