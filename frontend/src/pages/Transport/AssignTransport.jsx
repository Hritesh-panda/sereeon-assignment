// src/pages/Transport/AssignTransport.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const AssignTransport = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [transports, setTransports] = useState([]);
  const [form, setForm] = useState({
    orderId: "",
    truckNo: "",
    driverName: "",
  });

  const fetchData = async () => {
    const [ordersRes, transportRes] = await Promise.all([
      API.get("/orders"),
      API.get("/transport"),
    ]);
    setOrders(
      ordersRes.data.orders?.filter((o) => o.status === "Approved") || []
    );
    setTransports(transportRes.data.transports || []);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transport", form);
      alert("Transport assigned successfully!");
      setForm({ orderId: "", truckNo: "", driverName: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning transport");
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
          <h1 className="text-2xl font-bold mb-6">Assign Transport</h1>

          {(user.role === "ADMIN" || user.role === "VENDOR") && (
            <form
              onSubmit={handleCreate}
              className="bg-white shadow rounded p-4 mb-6 grid grid-cols-3 gap-4"
            >
              <select
                className="border p-2"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                required
              >
                <option value="">Select Order</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    Order #{o.id} - {o.product?.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Truck Number"
                className="border p-2"
                value={form.truckNo}
                onChange={(e) => setForm({ ...form, truckNo: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Driver Name"
                className="border p-2"
                value={form.driverName}
                onChange={(e) =>
                  setForm({ ...form, driverName: e.target.value })
                }
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 col-span-3"
              >
                Assign Transport
              </button>
            </form>
          )}

          <h2 className="text-xl font-semibold mb-3">All Transport Records</h2>
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">#</th>
                <th>Order</th>
                <th>Truck No</th>
                <th>Driver</th>
                <th>Status</th>
                <th>POD</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((t) => (
                <tr key={t.id} className="text-center border-t">
                  <td>{t.id}</td>
                  <td>#{t.orderId}</td>
                  <td>{t.truckNo}</td>
                  <td>{t.driverName}</td>
                  <td
                    className={`font-semibold ${
                      t.status === "Delivered"
                        ? "text-green-600"
                        : t.status === "In Transit"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {t.status}
                  </td>
                  <td>
                    {t.podFile ? (
                      <a
                        href={t.podFile}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View POD
                      </a>
                    ) : (
                      "N/A"
                    )}
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

export default AssignTransport;
