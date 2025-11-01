import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const VendorDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
          <p>Upload invoices and track payments.</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
