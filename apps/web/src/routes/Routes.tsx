import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthGuard } from "./middleware/AuthGuard.ts";
import { routes } from "./config/routes";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <AuthGuard
              element={route.component}
              redirectTo="/login"
              protected={route.protected}
              isPublic={route.isPublic}
            />
          }
        />
      ))}
    </Routes>
  );
};

export default RoutesComponent;
