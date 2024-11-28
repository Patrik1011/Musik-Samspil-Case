import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface AuthGuardProps {
  element: ReactElement;
  redirectTo: string;
  protected: boolean;
  isPublic?: boolean;
}

export const AuthGuard = ({
  element,
  redirectTo,
  protected: isProtected,
  isPublic = false,
}: AuthGuardProps): ReactElement => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isProtected && !isAuthenticated) {
      navigate(redirectTo);
    }

    if (!isProtected && isAuthenticated && !isPublic) {
      navigate("/home");
    }
  }, [isAuthenticated, isProtected, isPublic, navigate, redirectTo]);

  return element;
};
