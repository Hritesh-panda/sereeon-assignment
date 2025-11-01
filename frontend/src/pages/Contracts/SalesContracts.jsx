// src/pages/Contracts/SalesContracts.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import ROLES from "../../constants/role";
import SalesContractForm from "./SalesContractForm";

const SalesContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    totalQty: "",
    validityStart: "",
    validityEnd: "",
    terms: "",
  });

  const fetchContracts = async () => {
    const res = await API.get("/contracts");
    setContracts(res.data.contracts || res.data);
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products || res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/contracts", {
        ...form,
        type: "SALES",
        partyId: user.id,
      });
      setForm({
        productId: "",
        totalQty: "",
        validityStart: "",
        validityEnd: "",
        terms: "",
      });
      fetchContracts();
      alert("Sales contract created successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating contract");
    }
  };

  const handleContractStatusChange = (id, status) => {
    API.put(`/contracts/status/${id}`, { status })
      .then(() => {
        fetchContracts();
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error updating contract status");
      });
  };

  // useEffect(() => {
  //   API.get("/products").then((res) => setProducts(res.data.products));
  // }, []);
  useEffect(() => {
    fetchContracts();
    fetchProducts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Sales Contracts</h1>

          {user.role === ROLES.CUSTOMER && (
            <>
              <SalesContractForm
                form={form}
                setForm={setForm}
                handleCreate={handleCreate}
                products={products}
              />
              <h2 className="text-xl font-semibold mb-3">Your Contracts</h2>
            </>
          )}

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2">ID</th>
                  <th>Product</th>
                  <th>Total Qty</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Validity</th>
                  {user.role === ROLES.ADMIN && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {contracts.map((c) => (
                  <tr key={c.id} className="text-center border-t">
                    <td className="p-2">{c.id}</td>
                    <td>{c.product?.name}</td>
                    <td>{c.totalQty}</td>
                    <td>{c.balanceQty}</td>
                    <td
                      className={`font-semibold ${
                        c.status === "Approved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {c.status}
                    </td>
                    <td>
                      {c.validityStart?.split("T")[0]} →{" "}
                      {c.validityEnd?.split("T")[0]}
                    </td>
                    {user.role === ROLES.ADMIN && c.status === "Pending" && (
                      <td>
                        <button
                          onClick={() =>
                            handleContractStatusChange(c.id, "Approved")
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleContractStatusChange(c.id, "Rejected")
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
    </div>
  );
};

export default SalesContracts;
