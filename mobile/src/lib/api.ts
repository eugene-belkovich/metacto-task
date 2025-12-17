import axios from 'axios';
import { config } from './config';
import { secureStore } from './secure-store';

export const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (requestConfig) => {
  const token = await secureStore.getToken();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await secureStore.removeToken();
    }
    return Promise.reject(error);
  }
);
