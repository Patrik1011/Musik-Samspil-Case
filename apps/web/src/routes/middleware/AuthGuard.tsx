import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (isAuthenticated) {
        const status = await onboardingService.getOnboardingStatus();
        console.log("status", status);
        setIsOnboarded(status);
      }
      setLoading(false);
    };

    checkOnboardingStatus();
  }, [isAuthenticated]);

  useEffect(() => {
    console.log("Effect Triggered");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isOnboarded:", isOnboarded);
    console.log("loading:", loading);
    if (loading) {
      return;
    }

    if (isProtected) {
      if (!isAuthenticated) {
        console.log("Redirecting: User not authenticated.");
        navigate(redirectTo);
      } else if (!isOnboarded) {
        console.log("Redirecting: User not onboarded.");
        navigate("/onboarding");
      }
    } else if (isAuthenticated) {
      console.log("Redirecting: Authenticated and onboarded user.");
      navigate("/home");
    }
  }, [isAuthenticated, isProtected, navigate, redirectTo, isOnboarded, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return element;
};
