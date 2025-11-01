// src/pages/Payments/PaymentList.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const PaymentList = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({
    payerId: "",
    payeeId: "",
    invoiceId: "",
    amount: "",
    mode: "Bank Transfer",
  });

  const fetchData = async () => {
    const [paymentRes, invoiceRes] = await Promise.all([
      API.get("/payments"),
      API.get("/invoices"),
    ]);
    setPayments(paymentRes.data.payments || []);
    setInvoices(
      invoiceRes.data.invoices?.filter((inv) => inv.status === "Approved") || []
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/payments", {
        ...form,
        payerId: user.id,
      });
      alert("Payment recorded successfully!");
      setForm({
        payerId: "",
        payeeId: "",
        invoiceId: "",
        amount: "",
        mode: "Bank Transfer",
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating payment");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Payments</h1>

          {/* Payment creation form */}
          {(user.role === "CUSTOMER" || user.role === "ADMIN") && (
            <form
              onSubmit={handleCreate}
              className="bg-white shadow rounded p-4 mb-6 grid grid-cols-4 gap-4"
            >
              <select
                className="border p-2"
                value={form.invoiceId}
                onChange={(e) =>
                  setForm({ ...form, invoiceId: e.target.value })
                }
                required
              >
                <option value="">Select Invoice</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    Invoice #{inv.id} — ₹{inv.amount}
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

              <select
                className="border p-2"
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              >
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>Cheque</option>
              </select>

              <button
                type="submit"
                className="bg-green-600 text-white rounded py-2 hover:bg-green-700 col-span-4"
              >
                Record Payment
              </button>
            </form>
          )}

          <h2 className="text-xl font-semibold mb-3">All Payments</h2>

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">#</th>
                <th>Payer</th>
                <th>Payee</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="text-center border-t">
                  <td>{p.id}</td>
                  <td>{p.payer?.name}</td>
                  <td>{p.payee?.name}</td>
                  <td>#{p.invoiceId}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.mode}</td>
                  <td
                    className={`font-semibold ${
                      p.status === "Completed"
                        ? "text-green-600"
                        : p.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td>{p.date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
