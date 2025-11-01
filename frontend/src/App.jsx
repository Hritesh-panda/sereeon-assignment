import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth
import Login from "./pages/Auth/Login";
// import Register from "./pages/Auth/Register";

// Dashboards
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import VendorDashboard from "./pages/Dashboard/VendorDashboard";
import CustomerDashboard from "./pages/Dashboard/CustomerDashboard";
import TransportDashboard from "./pages/Dashboard/TransportDashboard";

// Contracts
import SalesContracts from "./pages/Contracts/SalesContracts";
import PurchaseContracts from "./pages/Contracts/PurchaseContracts";
import ContractDetails from "./pages/Contracts/ContractDetails";

// Orders
import SalesOrders from "./pages/orders/SalesOrders";
import PurchaseOrders from "./pages/orders/PurchaseOrders";
import OrderDetails from "./pages/orders/OrderDetails";

// Invoices
import InvoiceList from "./pages/Invoices/InvoiceList";
import InvoiceView from "./pages/Invoices/InvoiceView";

// Payments
import PaymentList from "./pages/Payments/PaymentList";
import Wallet from "./pages/Payments/Wallet";

// Transport
import AssignTransport from "./pages/Transport/AssignTransport";
import TransportStatus from "./pages/Transport/TransportStatus";

// Reports
import ReportFilter from "./pages/Reports/ReportFilter";
import ReportList from "./pages/Reports/ReportList";

// products
import ProductList from "./pages/Products/ProductList";
import ProductForm from "./pages/Products/ProductForm";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ------------------ PUBLIC ROUTES ------------------ */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}

          {/* ------------------ ADMIN ROUTES ------------------ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase-contracts"
            element={
              <ProtectedRoute roles={["ADMIN", "VENDOR"]}>
                <PurchaseContracts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sales-contracts"
            element={
              <ProtectedRoute roles={["ADMIN", "CUSTOMER"]}>
                <SalesContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["ADMIN", "VENDOR", "CUSTOMER"]}>
                <PurchaseOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute roles={["ADMIN", "VENDOR", "CUSTOMER"]}>
                <InvoiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <InvoiceView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute roles={["ADMIN", "VENDOR", "CUSTOMER"]}>
                <PaymentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AssignTransport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/filter"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <ReportFilter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <ReportList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute roles={["ADMIN", "CUSTOMER"]}>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute roles={["ADMIN", "VENDOR"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute roles={["ADMIN", "VENDOR"]}>
                <ProductForm />
              </ProtectedRoute>
            }
          />

          {/* ------------------ VENDOR ROUTES ------------------ */}
          <Route
            path="/vendor"
            element={
              <ProtectedRoute roles={["VENDOR"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["VENDOR"]}>
                <PurchaseOrders />
              </ProtectedRoute>
            }
          />

          {/* ------------------ CUSTOMER ROUTES ------------------ */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/sales"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <SalesContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/sales"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <SalesOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/customer"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <InvoiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments/customer"
            element={
              <ProtectedRoute roles={["CUSTOMER"]}>
                <PaymentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute roles={["CUSTOMER", "VENDOR", "ADMIN"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />

          {/* ------------------ TRANSPORT ROUTES ------------------ */}
          <Route
            path="/transport"
            element={
              <ProtectedRoute roles={["TRANSPORT", "ADMIN"]}>
                <TransportDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport/status"
            element={
              <ProtectedRoute roles={["TRANSPORT", "ADMIN"]}>
                <TransportStatus />
              </ProtectedRoute>
            }
          />

          {/* ------------------ COMMON DETAILS ------------------ */}
          <Route
            path="/contracts/:id"
            element={
              <ProtectedRoute roles={["ADMIN", "CUSTOMER", "VENDOR"]}>
                <ContractDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute roles={["ADMIN", "CUSTOMER", "VENDOR"]}>
                <OrderDetails />
              </ProtectedRoute>
            }
          />

          {/* ------------------ FALLBACK ------------------ */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
