import { Router } from 'express';
import { UserService } from '@/services/userService';
import { validateRequest } from '@/middleware/validateRequest';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate } from '@/middleware/auth';
import { formatResponse } from '@/utils/responseFormatter';
import { User, UpdateUserRequest } from '@/types';

// Create Express router instance for user routes
const router = Router();

// Create instance of UserService for handling user-related logic
const userService = new UserService();

// GET /me - Retrieve current user's profile
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  // Extract user ID from authenticated request
  const userId = req.user.id;

  // Call userService.getUserById with user ID
  const user = await userService.getUserById(userId);

  // Format and send response with user data
  res.json(formatResponse<User>(user));
}));

// PUT /me - Update current user's profile
router.put('/me', authenticate, validateRequest(UpdateUserRequest), asyncHandler(async (req, res) => {
  // Extract user ID from authenticated request
  const userId = req.user.id;

  // Extract update data from request body
  const updateData = req.body;

  // Call userService.updateUser with user ID and update data
  const updatedUser = await userService.updateUser(userId, updateData);

  // Format and send response with updated user data
  res.json(formatResponse<User>(updatedUser));
}));

// POST /change-password - Change current user's password
router.post('/change-password', authenticate, validateRequest(ChangePasswordRequest), asyncHandler(async (req, res) => {
  // Extract user ID from authenticated request
  const userId = req.user.id;

  // Extract old and new passwords from request body
  const { oldPassword, newPassword } = req.body;

  // Call userService.changePassword with user ID, old password, and new password
  await userService.changePassword(userId, oldPassword, newPassword);

  // Format and send response confirming password change
  res.json(formatResponse({ message: 'Password changed successfully' }));
}));

// DELETE /me - Delete current user's account
router.delete('/me', authenticate, asyncHandler(async (req, res) => {
  // Extract user ID from authenticated request
  const userId = req.user.id;

  // Call userService.deleteUser with user ID
  await userService.deleteUser(userId);

  // Format and send response confirming account deletion
  res.json(formatResponse({ message: 'User account deleted successfully' }));
}));

export default router;