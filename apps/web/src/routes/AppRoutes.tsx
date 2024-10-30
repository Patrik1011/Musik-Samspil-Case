// AppRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import DummyComponent from "../components/DummyComponent";

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
      <Route path="/" element={<Register />} /> 
    </Routes>
  );
};

export default AppRoutes;
