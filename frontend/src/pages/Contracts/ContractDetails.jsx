// src/pages/Contracts/ContractDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";

const ContractDetails = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    API.get(`/contracts/${id}`).then((res) =>
      setContract(res.data.contract || res.data)
    );
  }, [id]);

  if (!contract) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Contract Details</h1>
          <div className="bg-white shadow rounded p-6">
            <p>
              <strong>Contract ID:</strong> {contract.id}
            </p>
            <p>
              <strong>Type:</strong> {contract.type}
            </p>
            <p>
              <strong>Product:</strong> {contract.product?.name}
            </p>
            <p>
              <strong>Party:</strong> {contract.party?.name}
            </p>
            <p>
              <strong>Total Qty:</strong> {contract.totalQty}
            </p>
            <p>
              <strong>Balance Qty:</strong> {contract.balanceQty}
            </p>
            <p>
              <strong>Validity:</strong> {contract.validityStart?.split("T")[0]}{" "}
              → {contract.validityEnd?.split("T")[0]}
            </p>
            <p>
              <strong>Terms:</strong> {contract.terms || "—"}
            </p>
            <p>
              <strong>Status:</strong> {contract.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
