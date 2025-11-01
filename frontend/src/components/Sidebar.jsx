import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const commonLinks = [
    { name: "Orders", to: "/orders" },
    { name: "Invoices", to: "/invoices" },
    { name: "Payments", to: "/payments" },
  ];

  const roleSpecificLinks = {
    ADMIN: [
      { name: "Dashboard", to: "/admin" },
      { name: "Sales Contracts", to: "/sales-contracts" },
      { name: "Purchase Contracts", to: "/purchase-contracts" },
      { name: "Reports", to: "/reports" },
      { name: "Transport", to: "/transport" },
      { name: "Products", to: "/products" },
    ],
    VENDOR: [
      { name: "Dashboard", to: "/vendor" },
      { name: "Contracts", to: "/purchase-contracts" },
      { name: "Orders", to: "/purchase-orders" },
    ],
    CUSTOMER: [
      { name: "Dashboard", to: "/customer" },
      { name: "Contracts", to: "/sales-contracts" },
      { name: "Products", to: "/products" },
      { name: "Orders", to: "/sales-orders" },
    ],
    TRANSPORT: [
      { name: "Dashboard", to: "/transport" },
      { name: "Transport Status", to: "/transport" },
    ],
  };

  const links = roleSpecificLinks[user?.role] || [];

  return (
    <aside className="bg-gray-800 text-white w-64 h-screen p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold mb-4">Menu</h2>
      {[...links, ...commonLinks].map((link) => (
        <Link
          key={link.name}
          to={link.to}
          className="block px-3 py-2 rounded hover:bg-gray-700"
        >
          {link.name}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
