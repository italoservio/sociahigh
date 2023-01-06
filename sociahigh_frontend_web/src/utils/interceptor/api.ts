import axios, {AxiosError} from 'axios';
import {useContext} from 'react';
import {AppContext} from '../../contexts/app-context/app-context';
import {ACCESS_TOKEN_KEY} from '../constants';

export function useInterceptor() {
  const {logOut} = useContext(AppContext);

  const api = axios.create();

  api.interceptors.request.use(config => {
    const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (access_token) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${access_token}`,
      };
    }

    return config;
  });

  api.interceptors.response.use(
    response => response,
    error => {
      if (error instanceof AxiosError && error.status === 403) logOut();
      throw error;
    },
  );

  return api;
}
