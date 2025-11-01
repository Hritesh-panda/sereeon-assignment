// src/pages/Invoices/InvoiceList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const InvoiceList = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderId: "",
    type: "SALES",
    amount: "",
    tax: "",
  });

  const fetchInvoices = async () => {
    const [invoiceRes, orderRes] = await Promise.all([
      API.get("/invoices"),
      API.get("/orders"),
    ]);
    setInvoices(invoiceRes.data.invoices || []);
    setOrders(
      orderRes.data.orders?.filter(
        (o) => o.status === "In-Transit" || o.status === "Approved"
      ) || []
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/invoices", form);
      alert("Invoice created successfully!");
      setForm({ orderId: "", type: "SALES", amount: "", tax: "" });
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating invoice");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Invoices</h1>

          {/* Allow only Vendors/Admin to create invoice */}
          {(user.role === "VENDOR" || user.role === "ADMIN") && (
            <form
              onSubmit={handleCreate}
              className="bg-white shadow rounded p-4 mb-6 grid grid-cols-4 gap-4"
            >
              <select
                className="border p-2"
                value={form.orderId}
                onChange={(e) => {
                  const selectedOrder = orders.find(
                    (o) => o.id === parseInt(e.target.value)
                  );
                  setForm({
                    ...form,
                    orderId: e.target.value,
                    amount: selectedOrder.qty * selectedOrder.product.price,
                  });
                }}
                required
              >
                <option value="">Select Order</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.id} - {o.product?.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Amount"
                className="border p-2"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Tax (%)"
                className="border p-2"
                value={form.tax}
                onChange={(e) => setForm({ ...form, tax: e.target.value })}
              />

              <button
                type="submit"
                className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 col-span-4"
              >
                Create Invoice
              </button>
            </form>
          )}

          <h2 className="text-xl font-semibold mb-3">All Invoices</h2>

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">#</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="text-center border-t">
                  <td>{inv.id}</td>
                  <td>#{inv.orderId}</td>
                  <td>₹{inv.amount}</td>
                  <td>{inv.tax}%</td>
                  <td
                    className={`font-semibold ${
                      inv.status === "Paid"
                        ? "text-green-600"
                        : inv.status === "Approved"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {inv.status}
                  </td>
                  <td>{inv.createdAt?.split("T")[0]}</td>
                  <td>
                    <Link
                      to={`/invoices/${inv.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
