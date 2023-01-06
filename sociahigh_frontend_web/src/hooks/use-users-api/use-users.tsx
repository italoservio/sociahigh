import {useInterceptor} from '../../utils/interceptor/api';
import {AuthenticateResponse, CreateAccountRequest, User} from './types';

export function useUsersAPI() {
  const api = useInterceptor();
  const base = import.meta.env.VITE_USER_MICROSERVICE_URL;

  async function authenticate(email: string, password: string) {
    const resource = '/api/v1/users/authenticate';
    return api.post<AuthenticateResponse>(base + resource, {email, password});
  }

  async function profile() {
    const resource = '/api/v1/users/profile';
    return api.get<User>(base + resource);
  }

  async function create(payload: CreateAccountRequest) {
    const resource = '/api/v1/users/';
    return api.post<AuthenticateResponse>(base + resource, payload);
  }

  return {authenticate, profile, create};
}
