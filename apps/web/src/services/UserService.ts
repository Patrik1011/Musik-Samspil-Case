import { getRequest, putRequest, postRequest } from "../utils/api";
import { UserEntity } from "../utils/types";
import { OnboardingEntity } from "../utils/types.ts";

export const userService = {
  getCurrentUser: async () => {
    return await getRequest<UserEntity>("/users/me");
  },

  updateProfile: async (updateData: Partial<UserEntity>) => {
    return await putRequest<UserEntity>("/users/me", updateData);
  },

  getInstruments: async () => {
    return await getRequest<string[]>("/users/instruments");
  },

  getOnboardingStatus: async () => {
    return await getRequest<{ onboarded: boolean }>("/users/onboarding-status");
  },

  onBoardingProcess: async (credentials: OnboardingEntity) => {
    return await postRequest("/users/onboarding", credentials);
  },
};
