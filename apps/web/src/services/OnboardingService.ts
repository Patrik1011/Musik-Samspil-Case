import { getRequest, postRequest } from "../utils/api.ts";
import { OnboardingEntity } from "../utils/types.ts";

export const onboardingService = {
  getOnboardingStatus: async () => {
    const response = await getRequest<{ onboarded: boolean }>("/users/onboarding-status");
    return response.onboarded;
  },
  onBoardingProcess: async (credentials: OnboardingEntity) => {
    await postRequest("/users/onboarding", credentials);
  },
};
