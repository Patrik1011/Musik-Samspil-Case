import React from "react";
import { Routes } from "react-router-dom";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "./routes/UnauthenticatedRoutes";

const Router: React.FC = () => {
  return (
    <Routes>
      <UnauthenticatedRoutes />
      <AuthenticatedRoutes />
    </Routes>
  );
};

export default Router;