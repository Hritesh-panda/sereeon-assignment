// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import contractRoutes from "./src/routes/contractRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import invoiceRoutes from "./src/routes/invoiceRoutes.js";
import transportRoutes from "./src/routes/transportRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import ledgerRoutes from "./src/routes/ledgerRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/transports", transportRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/ledgers", ledgerRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("🚀 Smart DMS Backend Running...");
});

export default app;
