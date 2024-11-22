import { getRequest } from "../utils/api.ts";

export const onboardingService = {
  getOnboardingStatus: async () => {
    const response = await getRequest<{ isOnboarded: boolean }>("/users/onboarding-status");
    return response.isOnboarded;
  },
};
