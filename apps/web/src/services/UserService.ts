import { getRequest, putRequest } from "../utils/api";
import { UserEntity } from "../utils/types";

export const userService = {
  getCurrentUser: async () => {
    return await getRequest<UserEntity>("/users/me");
  },

  updateProfile: async (updateData: Partial<UserEntity>) => {
    return await putRequest<UserEntity>("/users/me", updateData);
  },
};
