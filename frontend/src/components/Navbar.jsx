import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Smart DMS</h1>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="font-medium">{user?.name}</span>
          <p className="text-xs">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
