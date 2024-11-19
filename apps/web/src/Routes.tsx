import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/unauthenticated/auth/Login";
import Register from "./pages/unauthenticated/auth/Register";
import Home from "./pages/authenticated/Home";
import Profile from "./pages/authenticated/Profile";
import PrivateRoute from "./PrivateRoute.tsx";

const RoutesComponent: React.FC = () => {
  const routes = [
    {
      path: "/login",
      component: <Login />,
      protected: false,
    },
    {
      path: "/register",
      component: <Register />,
      protected: false,
    },
    {
      path: "/home",
      component: <Home />,
      protected: true,
    },
    {
      path: "/profile",
      component: <Profile />,
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
            <PrivateRoute
              element={route.component}
              redirectTo="/login"
              protected={route.protected}
            />
          }
        />
      ))}
    </Routes>
  );
};

export default RoutesComponent;
