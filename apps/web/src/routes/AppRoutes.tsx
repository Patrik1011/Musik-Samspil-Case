// AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "../components/auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import DummyComponent from "../components/DummyComponent";
import Login from "../components/Auth/Login";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dummy" element={<DummyComponent />} />
      </Route>

      {/* Default Route */}
      <Route path="/" element={<Login />} /> 
    </Routes>
  );
};

export default AppRoutes;
