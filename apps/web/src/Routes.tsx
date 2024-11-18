import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
//import { useAuth } from "./context/AuthContext";
import Login from "./pages/unauthenticated/auth/Login";
import Register from "./pages/unauthenticated/auth/Register";
import Home from "./pages/authenticated/Home";
import Profile from "./pages/authenticated/Profile";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store.ts";

const RoutesComponent: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const routes = [
    {
      path: "/login",
      component: Login,
      protected: false,
    },
    {
      path: "/register",
      component: Register,
      protected: false,
    },
    {
      path: "/home",
      component: Home,
      protected: true,
    },
    {
      path: "/profile",
      component: Profile,
      protected: true,
    },
  ];

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.protected && !isAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <route.component />
            )
          }
        />
      ))}
    </Routes>
  );
};

export default RoutesComponent;
