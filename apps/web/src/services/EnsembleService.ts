import { getRequest, postRequest, putRequest } from "../utils/api";
import { Instrument } from "../enums/Instrument";

export interface EnsembleMember {
  _id: string;
  user_id: string;
  ensemble_id: string;
  first_name: string;
  last_name: string;
  instrument: Instrument;
  is_host: boolean;
}

export interface Ensemble {
  _id: string;
  name: string;
  description: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  openPositions: Instrument[];
  isActive: boolean;
  members: EnsembleMember[];
}

export interface CreateEnsembleInput extends Record<string, unknown> {
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

  getEnsemble: async (id: string): Promise<Ensemble> => {
    const response = await getRequest(`/ensemble/${id}`);
    return response as Ensemble;
  },

  updateEnsemble: async (id: string, data: Partial<Ensemble>): Promise<Ensemble> => {
    const response = await putRequest(`/ensemble/${id}`, data);
    return response as Ensemble;
  },

  getEnsembleMembers: async (ensembleId: string): Promise<EnsembleMember[]> => {
    const response = await getRequest(`/ensemble-membership/ensemble/${ensembleId}`);
    return response as EnsembleMember[];
  },
};
