import { AI_BACKEND_API_URL } from '@env';
import axios, { AxiosResponse } from 'axios';

const apiBaseUrl = AI_BACKEND_API_URL;

const httpClient = axios.create({
  baseURL: apiBaseUrl
});

const apiClient = {
  get: async <T extends any>(url: string, params?: any) => {
    const response = await httpClient.get<T>(url, { params });
    return response.data;
  },
  post: async <T extends any, D extends any>(url: string, data?: any) => {
    const response = await httpClient.post<T, AxiosResponse<T>, D>(url, data);
    return response.data;
  },
  put: async <T extends any, D extends any>(url: string, data?: any) => {
    const response = await httpClient.put<T, AxiosResponse<T>, D>(url, data);
    return response.data;
  },
  delete: async <T extends any>(url: string, params?: any) => {
    const response = await httpClient.delete<T>(url, { params });
    return response.data;
  }
};

export default apiClient;
