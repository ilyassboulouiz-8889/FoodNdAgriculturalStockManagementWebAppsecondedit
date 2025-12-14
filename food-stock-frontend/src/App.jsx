// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import StatusHistoryPage from "./pages/StatusHistoryPage";
import ProfilePage from "./pages/ProfilePage";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MyProductsPage from "./pages/MyProductsPage";
import AddProductPage from "./pages/AddProductPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import EditProductPage from "./pages/EditProductPage";
import AdminUsersPage from "./pages/AdminUsersPage";

// ❌ remove this line, it's unused now
// import ProtectedRoute from "./routes/ProtectedRoute";

function RequireAuth({ children }) {
  const { token, loading } = useAuth();

  // while (if) you ever use loading, you can show a spinner / text
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/products/my"
        element={
          <RequireAuth>
            <MyProductsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />

      <Route
        path="/products/add"
        element={
          <RequireAuth>
            <AddProductPage />
          </RequireAuth>
        }
      />

      <Route
        path="/products/:id/edit"
        element={
          <RequireAuth>
            <EditProductPage />
          </RequireAuth>
        }
      />

      <Route
        path="/admin/products"
        element={
          <RequireAuth>
            <AdminProductsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={<AdminUsersPage />}
      />
      <Route
  path="/products/:id/history"
  element={
    <RequireAuth>
      <StatusHistoryPage />
    </RequireAuth>
  }
/>

      {/* DEFAULT: go to my products */}
      <Route path="*" element={<Navigate to="/products/my" replace />} />
    </Routes>
  );
}

export default App;
