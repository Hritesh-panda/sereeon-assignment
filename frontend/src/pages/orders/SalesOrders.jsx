// src/pages/Orders/SalesOrders.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const SalesOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [form, setForm] = useState({
    contractId: "",
    productId: "",
    qty: "",
  });

  const fetchData = async () => {
    const [ordersRes, contractsRes] = await Promise.all([
      API.get("/orders"),
      API.get("/contracts"),
    ]);
    setOrders(ordersRes.data.orders || []);
    setContracts(
      contractsRes.data.contracts?.filter((c) => c.status === "Approved") || []
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/orders", {
        ...form,
        type: "SALES",
      });
      setForm({ contractId: "", productId: "", qty: "" });
      fetchData();
      alert("Sales Order created successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create order");
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
          <h1 className="text-2xl font-bold mb-6">Sales Orders</h1>

          <form
            onSubmit={handleCreate}
            className="bg-white shadow rounded p-4 mb-6 grid grid-cols-3 gap-4"
          >
            <select
              className="border p-2"
              value={form.contractId}
              onChange={(e) => {
                const selected = contracts.find(
                  (c) => c.id === parseInt(e.target.value)
                );
                setForm({
                  ...form,
                  contractId: e.target.value,
                  productId: selected?.productId || "",
                });
              }}
              required
            >
              <option value="">Select Approved Contract</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} - {c.product?.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              className="border p-2"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 col-span-3"
            >
              Create Order
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-3">Your Sales Orders</h2>
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) => o.type === "SALES")
                .map((o) => (
                  <tr key={o.id} className="text-center border-t">
                    <td>{o.id}</td>
                    <td>{o.product?.name}</td>
                    <td>{o.qty}</td>
                    <td
                      className={`font-semibold ${
                        o.status === "Approved"
                          ? "text-green-600"
                          : o.status === "Delivered"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {o.status}
                    </td>
                    <td>{o.createdAt?.split("T")[0]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesOrders;
