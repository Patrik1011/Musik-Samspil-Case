import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../../redux/store";
import { onboardingService } from "../../services/OnboardingService.ts";

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
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [isOnboarded, setIsOnboarded] = useState(false);

  const checkOnboardingStatus = async () => {
    const status = await onboardingService.getOnboardingStatus();
    setIsOnboarded(status);
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkOnboardingStatus();
    }

    if (isProtected && !isAuthenticated) {
      navigate(redirectTo);
    }

    if (!isProtected && isAuthenticated) {
      navigate("/home");
    }
    if (isProtected && isAuthenticated && !isOnboarded) {
      navigate("/onboarding");
    }
  }, [isAuthenticated, isProtected, navigate, redirectTo, isOnboarded]);

  return element;
};
