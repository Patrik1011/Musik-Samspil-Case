import React from "react";
import { Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const UnauthenticatedRoutes: React.FC = () => (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Login />} />
  </>
);

export default UnauthenticatedRoutes;