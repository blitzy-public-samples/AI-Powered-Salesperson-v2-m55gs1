import { api } from '@/services/api';
import { User, LoginCredentials, RegisterData } from '@/types';
import { setToken, removeToken, getToken } from '@/utils/storage';
import { AUTH_ENDPOINTS } from '@/config';

// Function to authenticate user
export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    // Send POST request to login endpoint with credentials
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
    
    // Extract token from response
    const { token, user } = response.data;
    
    // Store token using setToken utility
    setToken(token);
    
    // Return user data from response
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Function to log out user
export async function logout(): Promise<void> {
  try {
    // Send POST request to logout endpoint
    await api.post(AUTH_ENDPOINTS.LOGOUT);
    
    // Remove stored token using removeToken utility
    removeToken();
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

// Function to register new user
export async function register(userData: RegisterData): Promise<User> {
  try {
    // Send POST request to register endpoint with user data
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
    
    // Extract token from response
    const { token, user } = response.data;
    
    // Store token using setToken utility
    setToken(token);
    
    // Return user data from response
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Function to refresh authentication token
export async function refreshToken(): Promise<string> {
  try {
    // Get current token using getToken utility
    const currentToken = getToken();
    
    // Send POST request to refresh token endpoint with current token
    const response = await api.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { token: currentToken });
    
    // Extract new token from response
    const { token } = response.data;
    
    // Store new token using setToken utility
    setToken(token);
    
    // Return new token
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
}

// Function to get current user data
export async function getCurrentUser(): Promise<User> {
  try {
    // Send GET request to current user endpoint
    const response = await api.get(AUTH_ENDPOINTS.CURRENT_USER);
    
    // Return user data from response
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
}