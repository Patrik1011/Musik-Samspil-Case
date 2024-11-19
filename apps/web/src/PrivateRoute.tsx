import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

interface PrivateRouteProps {
  element: React.ReactElement;
  redirectTo: string;
  protected: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  redirectTo,
  protected: isProtected,
}) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (isProtected && !isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (!isProtected && isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return element;
};

export default PrivateRoute;
