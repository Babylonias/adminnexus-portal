// src/api/ApiService.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '@/utils/token.util';

export default class ApiService {
  protected client: AxiosInstance;
  protected baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:7011/api';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Injecte le token à chaque requête
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    });
    // Gestion globale des erreurs
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('Non autorisé - token invalide ou expiré');
          // ici tu peux émettre un event, logout, refresh, etc.
        }
        return Promise.reject(error);
      }
    );
  }

  protected get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(this.baseURL + url, { params });
  }

  protected post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(this.baseURL + url, data);
  }

  protected put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put<T>(this.baseURL + url, data);
  }

  protected delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(this.baseURL + url);
  }
}
