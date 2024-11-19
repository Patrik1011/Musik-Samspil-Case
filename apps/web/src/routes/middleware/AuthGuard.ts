import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../redux/store";

interface AuthGuardProps {
  element: ReactElement;
  redirectTo: string;
  protected: boolean;
}

export const AuthGuard = ({
  element,
  redirectTo,
  protected: isProtected,
}: AuthGuardProps): ReactElement => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isProtected && !isAuthenticated) {
      navigate(redirectTo);
    }

    if (!isProtected && isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, isProtected, navigate, redirectTo]);

  return element;
};
