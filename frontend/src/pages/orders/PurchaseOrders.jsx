// src/pages/Orders/PurchaseOrders.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import ROLES from "../../constants/role";
import PurchaseOrderForm from "./PurchaseOrderForm";
import { useAuth } from "../../contexts/AuthContext";

const PurchaseOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [form, setForm] = useState({
    contractId: "",
    productId: "",
    qty: "",
  });
  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data.products));
  }, []);
  const fetchData = async () => {
    const [ordersRes, contractsRes] = await Promise.all([
      API.get("/orders"),
      API.get("/contracts"),
    ]);
    setOrders(ordersRes.data.orders || []);
    setContracts(
      contractsRes.data.contracts?.filter(
        (c) => c.status === "Approved" && c.type === "PURCHASE"
      ) || []
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/orders", {
        ...form,
        type: "PURCHASE",
      });
      setForm({ contractId: "", productId: "", qty: "" });
      fetchData();
      alert("Purchase Order created successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating order");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOrderChangeStatus = (id, status) => {
    API.put(`/orders/status/${id}`, { status })
      .then(() => {
        fetchData();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error updating contract status");
      });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Purchase Orders</h1>

          {user.role === ROLES.ADMIN && (
            <>
              <PurchaseOrderForm
                contracts={contracts}
                form={form}
                setForm={setForm}
                handleCreate={handleCreate}
              />
              <h2 className="text-xl font-semibold mb-3">
                Your Purchase Orders
              </h2>
            </>
          )}

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Created At</th>
                {user.role === ROLES.VENDOR && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((o) => o.type === "PURCHASE")
                .map((o) => (
                  <tr key={o.id} className="text-center border-t">
                    <td>{o.id}</td>
                    <td>{o.product?.name}</td>
                    <td>{o.qty}</td>
                    <td>{o.status}</td>
                    <td>{o.createdAt?.split("T")[0]}</td>
                    {user.role === ROLES.VENDOR && o.status === "Pending" && (
                      <td className="flex justify-center py-1">
                        <button
                          onClick={() =>
                            handleOrderChangeStatus(o.id, "Approved")
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleOrderChangeStatus(o.id, "Rejected")
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;
