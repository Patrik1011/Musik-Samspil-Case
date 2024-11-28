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
  instrument?: string;
}

export type OnboardingEntity = {
  phone_number: string;
  bio: string;
};
