import { getRequest, postRequest } from "../utils/api";
import { Instrument } from "../enums/Instrument";

export interface Ensemble {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  open_positions: Instrument[];
  is_active: boolean;
}

export interface CreateEnsembleInput {
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  openPositions: Instrument[];
  isActive: boolean;
}

export const ensembleService = {
  getHostedEnsembles: async (): Promise<Ensemble[]> => {
    const response = await getRequest("/ensemble/hosted");
    return response as Ensemble[];
  },

  createEnsemble: async (data: CreateEnsembleInput): Promise<Ensemble> => {
    const response = await postRequest("/ensemble", data);
    return response as Ensemble;
  },
};
