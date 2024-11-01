import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DummyComponent from "../components/DummyComponent";

const AuthenticatedRoutes: React.FC = () => (
  <Route element={<ProtectedRoute />}>
    <Route path="/dummy" element={<DummyComponent />} />
  </Route>
);

export default AuthenticatedRoutes;