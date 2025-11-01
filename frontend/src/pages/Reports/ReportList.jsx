// src/pages/Reports/ReportList.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";

const ReportList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") || "orders";
  const status = queryParams.get("status");
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");

  const [data, setData] = useState([]);

  const fetchReport = async () => {
    const params = { status, startDate, endDate };
    const res = await API.get(`/reports/${type}`, { params });
    setData(res.data.records || []);
  };

  useEffect(() => {
    fetchReport();
  }, [type, status, startDate, endDate]);

  const renderTable = () => {
    if (data.length === 0) return <p>No records found.</p>;

    switch (type) {
      case "orders":
        return (
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.id} className="text-center border-t">
                  <td>{o.id}</td>
                  <td>{o.product?.name}</td>
                  <td>{o.qty}</td>
                  <td>{o.status}</td>
                  <td>{o.createdAt?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "invoices":
        return (
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th>#</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((inv) => (
                <tr key={inv.id} className="text-center border-t">
                  <td>{inv.id}</td>
                  <td>#{inv.orderId}</td>
                  <td>₹{inv.amount}</td>
                  <td>{inv.tax}%</td>
                  <td>{inv.status}</td>
                  <td>{inv.createdAt?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "payments":
        return (
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th>#</th>
                <th>Payer</th>
                <th>Payee</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id} className="text-center border-t">
                  <td>{p.id}</td>
                  <td>{p.payer?.name}</td>
                  <td>{p.payee?.name}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.mode}</td>
                  <td>{p.status}</td>
                  <td>{p.date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "transport":
        return (
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th>#</th>
                <th>Order</th>
                <th>Truck No</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.id} className="text-center border-t">
                  <td>{t.id}</td>
                  <td>#{t.orderId}</td>
                  <td>{t.truckNo}</td>
                  <td>{t.driverName}</td>
                  <td>{t.status}</td>
                  <td>{t.createdAt?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return <p>Select a report type.</p>;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 capitalize">{type} Report</h1>
          {renderTable()}
        </div>
      </div>
    </div>
  );
};

export default ReportList;
