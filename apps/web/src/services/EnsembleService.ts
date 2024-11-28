import { getRequest, postRequest, putRequest } from "../utils/api";
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
    const requestData = {
      name: data.name,
      description: data.description,
      location: {
        city: data.location.city,
        country: data.location.country,
        address: data.location.address,
      },
      open_positions: data.openPositions,
      is_active: data.isActive,
    };
    const response = await postRequest("/ensemble", requestData);
    return response as Ensemble;
  },

  getEnsemble: async (id: string): Promise<Ensemble> => {
    const response = await getRequest(`/ensemble/${id}`);
    return response as Ensemble;
  },

  updateEnsemble: async (id: string, data: Partial<Ensemble>): Promise<Ensemble> => {
    const response = await putRequest(`/ensemble/${id}`, data);
    return response as Ensemble;
  },
};
