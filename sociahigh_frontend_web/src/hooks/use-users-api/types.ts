export type AuthenticateResponse = {
  access_token: string;
  expires_at: string;
};

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type CreateAccountRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
};
