// src/pages/Contracts/PurchaseContracts.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import PurchaseContractForm from "./PurchaseContractForm";
import { useAuth } from "../../contexts/AuthContext";
import ROLES from "../../constants/role";

const PurchaseContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    partyId: "",
    productId: "",
    totalQty: "",
    validityStart: "",
    validityEnd: "",
    terms: "",
  });
  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data.products));
  }, []);
  const fetchData = async () => {
    const [contractsRes, productsRes, usersRes] = await Promise.all([
      API.get("/contracts"),
      API.get("/products"),
      API.get("/users/role/VENDOR"),
    ]);
    setContracts(contractsRes.data.contracts || contractsRes.data);
    setProducts(productsRes.data.products || productsRes.data);
    setVendors(usersRes.data.users || usersRes.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post("/contracts", {
      ...form,
      type: "PURCHASE",
    });
    fetchData();
    alert("Purchase contract created successfully!");
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Purchase Contracts</h1>
          {user.role === ROLES.ADMIN && (
            <>
              <PurchaseContractForm
                form={form}
                setForm={setForm}
                handleCreate={handleCreate}
                products={products}
                vendors={vendors}
              />

              <h2 className="text-xl font-semibold mb-3">
                Existing Purchase Contracts
              </h2>
            </>
          )}
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2">ID</th>
                  <th>Vendor</th>
                  <th>Product</th>
                  <th>Total Qty</th>
                  <th>Balance</th>
                  <th>Status</th>
                  {user.role === ROLES.VENDOR && (
                    <th className="p-2">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {contracts
                  .filter((c) => c.type === "PURCHASE")
                  .map((c) => (
                    <tr key={c.id} className="text-center border-t">
                      <td>{c.id}</td>
                      <td>{c.party?.name}</td>
                      <td>{c.product?.name}</td>
                      <td>{c.totalQty}</td>
                      <td>{c.balanceQty}</td>
                      <td>{c.status}</td>
                      {user.role === ROLES.VENDOR && c.status === "Pending" && (
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

export default PurchaseContracts;
