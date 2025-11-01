import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import ROLES from "../../constants/role";

const DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: "/admin",
  [ROLES.VENDOR]: "/vendor",
  [ROLES.CUSTOMER]: "/customer",
};

const Login = () => {
  const [email, setEmail] = useState("hritesh@example.com");
  const [password, setPassword] = useState("123456");
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
      navigate(DASHBOARD_ROUTES[res.data.user.role]);
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (!loading && user) navigate(DASHBOARD_ROUTES[user.role]);
  }, [user, loading]);

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
