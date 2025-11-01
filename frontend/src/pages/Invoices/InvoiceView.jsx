// src/pages/Invoices/InvoiceView.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  const fetchInvoice = async () => {
    const res = await API.get(`/invoices/${id}`);
    setInvoice(res.data.invoice);
  };

  const handleApprove = async () => {
    await API.put(`/invoices/${id}/status`, { status: "Approved" });
    alert("Invoice approved successfully!");
    fetchInvoice();
  };

  const handlePaid = async () => {
    await API.put(`/invoices/${id}/status`, { status: "Paid" });
    alert("Invoice marked as paid!");
    fetchInvoice();
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  if (!invoice) return <div>Loading...</div>;

  const taxAmount = (invoice.amount * invoice.tax) / 100;
  const total = invoice.amount + taxAmount;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>

          <div className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4">
            <p>
              <strong>Invoice ID:</strong> #{invoice.id}
            </p>
            <p>
              <strong>Order ID:</strong> #{invoice.orderId}
            </p>
            <p>
              <strong>Type:</strong> {invoice.type}
            </p>
            <p>
              <strong>Status:</strong> {invoice.status}
            </p>
            <p>
              <strong>Amount:</strong> ₹{invoice.amount}
            </p>
            <p>
              <strong>Tax:</strong> {invoice.tax}%
            </p>
            <p>
              <strong>Total:</strong> ₹{total}
            </p>
            <p>
              <strong>Waybill No:</strong> {invoice.waybillNo || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {invoice.createdAt?.split("T")[0]}
            </p>
          </div>

          {/* Admin action buttons */}
          <div className="flex gap-4 mt-6">
            {invoice.status === "Pending" && (
              <button
                onClick={handleApprove}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Approve Invoice
              </button>
            )}
            {invoice.status === "Approved" && (
              <button
                onClick={handlePaid}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
