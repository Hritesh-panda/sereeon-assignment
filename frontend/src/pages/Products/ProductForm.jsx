// src/pages/Products/ProductForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    unit: "",
    stock: "",
  });

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`).then((res) => setForm(res.data.product));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await API.put(`/products/${id}`, form);
        alert("Product updated successfully!");
      } else {
        await API.post("/products", form);
        alert("Product added successfully!");
      }
      navigate("/products");
    } catch (err) {
      alert("Error saving product");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Product Name"
              className="border p-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="SKU"
              className="border p-2"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="border p-2"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Unit (e.g., kg, piece)"
              className="border p-2"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              className="border p-2"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />

            <button
              type="submit"
              className="col-span-2 bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
            >
              {isEdit ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
