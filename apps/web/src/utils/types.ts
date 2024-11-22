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
