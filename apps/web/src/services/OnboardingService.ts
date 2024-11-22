import { getRequest, postRequest } from "../utils/api.ts";
import { OnboardingType } from "../utils/types.ts";

export const onboardingService = {
  getOnboardingStatus: async () => {
    const response = await getRequest<{ isOnboarded: boolean }>("/users/onboarding-status");
    return response.isOnboarded;
  },
  onBoardingProcess: async (credentials: OnboardingType) => {
    await postRequest("/users/onboarding-process", credentials);
  },
};
