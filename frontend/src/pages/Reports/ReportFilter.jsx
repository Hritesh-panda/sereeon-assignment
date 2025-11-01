// src/pages/Reports/ReportFilter.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const ReportFilter = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "orders",
    status: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(filters).toString();
    navigate(`/reports/list?${query}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Generate Reports</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-gray-700 mb-2">Report Type</label>
              <select
                className="border p-2 w-full"
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                <option value="orders">Orders</option>
                <option value="invoices">Invoices</option>
                <option value="payments">Payments</option>
                <option value="transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <select
                className="border p-2 w-full"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Paid">Paid</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                className="border p-2 w-full"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                className="border p-2 w-full"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 col-span-2 mt-4"
            >
              Generate Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;
