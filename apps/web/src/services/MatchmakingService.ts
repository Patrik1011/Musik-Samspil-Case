import { getRequest, postRequest } from "../utils/api";
import { Ensemble } from "./EnsembleService";
import { Match, Coordinates } from "../utils/types";

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

  getMatches: async (): Promise<Match[]> => {
    const response = await getRequest("/matchmaking/matches");
    return response as Match[];
  },
};
