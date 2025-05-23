import { Instrument } from "../enums/Instrument";

export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
};

export type AuthResponseType = {
  accessToken: string;
  onboarded: boolean;
};

export interface UserEntity {
  id?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  bio?: string;
  instruments?: Instrument[];
  location: {
    city: string;
    country: string;
    address: string;
  };
}

export type OnboardingEntity = {
  phone_number: string;
  bio: string;
};

export type Ensemble = {
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
};

export type EnsembleMember = {
  _id: string;
  user_id: string;
  ensemble_id: string;
  member: {
    first_name: string;
    last_name: string;
  };
  instrument: Instrument;
  is_host: boolean;
};

export type Match = {
  _id: string;
  user: UserEntity;
  ensemble: {
    name: string;
    description: string;
    open_positions: Instrument[];
  };
  ensemble_id: string;
  created_at: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
  radius?: number;
};
