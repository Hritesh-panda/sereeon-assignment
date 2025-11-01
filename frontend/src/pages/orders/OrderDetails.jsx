// src/pages/Orders/OrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import API from "../../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then((res) => setOrder(res.data.order));
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Order Details</h1>
          <div className="bg-white p-6 rounded shadow">
            <p>
              <strong>ID:</strong> {order.id}
            </p>
            <p>
              <strong>Type:</strong> {order.type}
            </p>
            <p>
              <strong>Product:</strong> {order.product?.name}
            </p>
            <p>
              <strong>Contract:</strong> #{order.contractId}
            </p>
            <p>
              <strong>Quantity:</strong> {order.qty}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Created At:</strong> {order.createdAt?.split("T")[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
