import { Router } from 'express';
import { AuthService } from '@/services/authService';
import { validateRequest } from '@/middleware/validateRequest';
import { asyncHandler } from '@/middleware/errorHandler';
import { formatResponse } from '@/utils/responseFormatter';
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from '@/types';

// Create Express router instance for auth routes
const router = Router();

// Create instance of AuthService for handling authentication logic
const authService = new AuthService();

// Handle user login
const login = asyncHandler(async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  // Call authService.login with credentials
  const { token, user } = await authService.login(email, password);

  // Format and send response with token and user data
  res.json(formatResponse({ token, user }));
});

// Handle user registration
const register = asyncHandler(async (req, res) => {
  // Extract user data from request body
  const userData = req.body;

  // Call authService.register with user data
  const { token, user } = await authService.register(userData);

  // Format and send response with token and user data
  res.json(formatResponse({ token, user }));
});

// Handle user logout
const logout = asyncHandler(async (req, res) => {
  // Extract token from request headers
  const token = req.headers.authorization?.split(' ')[1];

  // Call authService.logout with token
  await authService.logout(token);

  // Format and send response confirming logout
  res.json(formatResponse({ message: 'Logged out successfully' }));
});

// Handle token refresh
const refreshToken = asyncHandler(async (req, res) => {
  // Extract refresh token from request body
  const { refreshToken } = req.body;

  // Call authService.refreshToken with refresh token
  const newAccessToken = await authService.refreshToken(refreshToken);

  // Format and send response with new access token
  res.json(formatResponse({ token: newAccessToken }));
});

// Define routes with their respective handlers and middleware
router.post('/login', validateRequest(LoginRequest), login);
router.post('/register', validateRequest(RegisterRequest), register);
router.post('/logout', logout);
router.post('/refresh-token', validateRequest(RefreshTokenRequest), refreshToken);

export default router;