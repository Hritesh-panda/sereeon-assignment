import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalContracts: 0,
    totalOrders: 0,
    pendingInvoices: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contracts, orders, invoices] = await Promise.all([
          API.get("/contracts"),
          API.get("/orders"),
          API.get("/invoices"),
        ]);
        setStats({
          totalContracts:
            contracts.data.total || contracts.data.contracts?.length,
          totalOrders: orders.data.orders?.length,
          pendingInvoices: invoices.data.invoices?.filter(
            (inv) => inv.status === "Pending"
          ).length,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-gray-600">Total Contracts</h3>
              <p className="text-2xl font-semibold">{stats.totalContracts}</p>
            </div>
            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-gray-600">Total Orders</h3>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white shadow p-6 rounded">
              <h3 className="text-gray-600">Pending Invoices</h3>
              <p className="text-2xl font-semibold">{stats.pendingInvoices}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
