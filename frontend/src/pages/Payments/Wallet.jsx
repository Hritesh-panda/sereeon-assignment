// src/pages/Payments/Wallet.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Wallet = () => {
  const { user } = useAuth();
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState({ credit: 0, debit: 0, balance: 0 });

  const fetchLedger = async () => {
    const res = await API.get(`/ledgers/${user.id}`);
    const records = res.data.ledger || [];
    setLedger(records);

    const credit = records.reduce((sum, r) => sum + r.credit, 0);
    const debit = records.reduce((sum, r) => sum + r.debit, 0);
    setSummary({ credit, debit, balance: credit - debit });
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">My Wallet</h1>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded shadow text-center">
              <h3 className="text-gray-600">Total Credit</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{summary.credit}
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <h3 className="text-gray-600">Total Debit</h3>
              <p className="text-2xl font-bold text-red-600">
                ₹{summary.debit}
              </p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <h3 className="text-gray-600">Current Balance</h3>
              <p className="text-2xl font-bold text-blue-600">
                ₹{summary.balance}
              </p>
            </div>
          </div>

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">#</th>
                <th>Description</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Balance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((l) => (
                <tr key={l.id} className="text-center border-t">
                  <td>{l.id}</td>
                  <td>{l.description || "—"}</td>
                  <td className="text-green-600">₹{l.credit}</td>
                  <td className="text-red-600">₹{l.debit}</td>
                  <td className="font-semibold">₹{l.balance}</td>
                  <td>{l.date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
