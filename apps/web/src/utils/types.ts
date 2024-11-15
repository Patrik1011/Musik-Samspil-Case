export type LoginType = {
  username: string;
  password: string;
};

export type RegisterType = {
  username: string;
  password: string;
  email: string;
};

export type UserType = {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone_number?: string;
  bio?: string;
  instrument: string;
};

export type AuthResponseType = {
  token: string;
  user: UserType;
};
