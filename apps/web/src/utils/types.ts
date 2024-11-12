export type LoginType = {
 username: string;
 password: string;
};

export type RegisterType = {
 username: string;
 password: string;
 email: string;
};

export type AuthResponseType = {
 token: string;
 user: any;
};