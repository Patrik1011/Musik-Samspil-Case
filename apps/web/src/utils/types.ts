export type LoginType = {
  email: string;
  password: string;
};

export type RegisterType = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
};

export type AuthResponseType = {
  accessToken: string;
};

export type OnboardingEntity = {
  phone_number: string;
  instrument: string;
  bio: string;
};
