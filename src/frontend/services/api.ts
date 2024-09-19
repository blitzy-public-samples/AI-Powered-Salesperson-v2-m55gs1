import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '@/utils/storage';
import { handleApiError } from '@/utils/errorHandler';
import { API_BASE_URL } from '@/config';

// Create and configure the Axios instance for API requests
const createApiInstance = (): AxiosInstance => {
  // Create a new Axios instance with API_BASE_URL
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });

  // Set default headers including Content-Type
  instance.defaults.headers.common['Content-Type'] = 'application/json';

  // Add request interceptor for adding authorization token
  instance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(handleApiError(error))
  );

  return instance;
};

// Create the configured Axios instance
const api: AxiosInstance = createApiInstance();

// Wrapper function for GET requests
const get = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Wrapper function for POST requests
const post = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Wrapper function for PUT requests
const put = async (url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.put(url, data, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Wrapper function for DELETE requests
const delete_ = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  try {
    const response = await api.delete(url, config);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export { api, get, post, put, delete_ as delete };