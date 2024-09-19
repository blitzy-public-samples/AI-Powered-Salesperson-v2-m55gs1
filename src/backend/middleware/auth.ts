import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '@/utils/errorHandler';
import { UserService } from '@/services/userService';
import { UserRole, DecodedToken } from '@/types';
import { JWT_SECRET } from '@/config';

// Instance of UserService for user-related operations
const userService = new UserService();

// Middleware to authenticate incoming requests
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // If no token, throw AppError (401 Unauthorized)
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token using JWT_SECRET
    const decoded = verify(token, JWT_SECRET) as DecodedToken;

    // Fetch user from database using decoded token's userId
    const user = await userService.getUserById(decoded.userId);

    // If user not found, throw AppError (401 Unauthorized)
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Attach user object to request
    req.user = user;

    // Call next() to proceed to next middleware
    next();
  } catch (error) {
    // If verification fails, throw AppError (401 Unauthorized)
    next(new AppError('Invalid token', 401));
  }
};

// Middleware to authorize user based on roles
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Checks if user object is attached to request
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    // Check if user's role is in allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }

    // Call next() to proceed to next middleware
    next();
  };
};

// Middleware to refresh an expired token
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extract refresh token from request body
    const { refreshToken } = req.body;

    // If no refresh token, throw AppError (400 Bad Request)
    if (!refreshToken) {
      throw new AppError('No refresh token provided', 400);
    }

    // Verify refresh token using JWT_SECRET
    const decoded = verify(refreshToken, JWT_SECRET) as DecodedToken;

    // Fetch user from database using decoded token's userId
    const user = await userService.getUserById(decoded.userId);

    // If user not found, throw AppError (401 Unauthorized)
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Generate new access token
    const newAccessToken = userService.generateAccessToken(user);

    // Send new access token in response
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    // If verification fails, throw AppError (401 Unauthorized)
    next(new AppError('Invalid refresh token', 401));
  }
};