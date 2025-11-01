// src/pages/Transport/TransportStatus.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const TransportStatus = () => {
  const { user } = useAuth();
  const [transports, setTransports] = useState([]);

  const fetchTransports = async () => {
    const res = await API.get("/transport");
    setTransports(res.data.transports || []);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/transport/${id}/status`, { status });
      alert("Status updated successfully!");
      fetchTransports();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const uploadPOD = async (id, e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("podFile", file);
    try {
      await API.post(`/transport/${id}/upload-pod`, formData);
      alert("POD uploaded successfully!");
      fetchTransports();
    } catch (err) {
      alert("Error uploading POD");
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Transport Status</h1>

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2">#</th>
                <th>Order</th>
                <th>Truck</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Update</th>
                <th>POD Upload</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((t) => (
                <tr key={t.id} className="text-center border-t">
                  <td>{t.id}</td>
                  <td>#{t.orderId}</td>
                  <td>{t.truckNo}</td>
                  <td>{t.driverName}</td>
                  <td>{t.status}</td>
                  <td>
                    {user.role === "TRANSPORT" && (
                      <select
                        className="border p-1"
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                      >
                        <option>At Plant</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                      </select>
                    )}
                  </td>
                  <td>
                    {user.role === "TRANSPORT" && (
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => uploadPOD(t.id, e)}
                      />
                    )}
                    {t.podFile && (
                      <a
                        href={t.podFile}
                        target="_blank"
                        className="text-blue-600 hover:underline ml-2"
                      >
                        View
                      </a>
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

export default TransportStatus;
