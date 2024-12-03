import { getRequest, postRequest } from "../utils/api";
import { Ensemble } from "./EnsembleService";

interface Coordinates {
  latitude: number;
  longitude: number;
  radius?: number;
}

export const matchmakingService = {
  getRecommendations: async ({ latitude, longitude }: Coordinates): Promise<Ensemble[]> => {
    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    const response = await getRequest(`/matchmaking/recommendations?${queryParams}`);
    return response as Ensemble[];
  },

  createMatch: async (ensembleId: string, liked: boolean): Promise<void> => {
    await postRequest("/matchmaking/match", {
      ensembleId,
      liked,
    });
  },
};
