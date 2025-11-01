// src/pages/Products/ProductList.jsx
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data.products || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            {(user.role === "ADMIN" || user.role === "VENDOR") && (
              <Link
                to="/products/new"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Product
              </Link>
            )}
          </div>

          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Stock</th>
                {user.role !== "CUSTOMER" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="text-center border-t">
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>₹{p.price}</td>
                  <td>{p.unit}</td>
                  <td>{p.stock}</td>
                  {user.role !== "CUSTOMER" && (
                    <td className="space-x-3">
                      <Link
                        to={`/products/edit/${p.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
