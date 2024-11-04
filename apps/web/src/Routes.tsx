import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from './components/unauthenticated/auth/Login';
import Register from './components/unauthenticated/auth/Register';
import DummyComponent from './components/authenticated/DummyComponent';

const RoutesComponent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const routes = [
    {
      path: '/login',
      component: Login,
      protected: false,
    },
    {
      path: '/register',
      component: Register,
      protected: false,
    },
    {
      path: '/dummy',
      component: DummyComponent,
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
