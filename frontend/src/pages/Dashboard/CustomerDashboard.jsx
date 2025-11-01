import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const CustomerDashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
          <p>View your contracts, orders, and invoice summaries here.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
