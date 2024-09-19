import { Router } from 'express';
import { AdminService } from '@/services/adminService';
import { validateRequest } from '@/middleware/validateRequest';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate, authorizeAdmin } from '@/middleware/auth';
import { formatResponse } from '@/utils/responseFormatter';
import { SystemStats, AIModelConfig, UserManagementRequest } from '@/types';

// Create Express router instance for admin routes
const router = Router();

// Create instance of AdminService for handling admin-related logic
const adminService = new AdminService();

// GET /stats - Retrieve system statistics
router.get('/stats', authenticate, authorizeAdmin, asyncHandler(async (req, res) => {
  // Call adminService to get system stats
  const stats: SystemStats = await adminService.getSystemStats();
  
  // Format and send response with system statistics
  res.json(formatResponse(stats));
}));

// PUT /ai-model-config - Update AI model configuration
router.put('/ai-model-config', authenticate, authorizeAdmin, validateRequest(AIModelConfig), asyncHandler(async (req, res) => {
  // Extract AI model configuration from request body
  const newConfig: AIModelConfig = req.body;
  
  // Call adminService to update AI model config
  const updatedConfig = await adminService.updateAIModelConfig(newConfig);
  
  // Format and send response with updated configuration
  res.json(formatResponse(updatedConfig));
}));

// POST /users - Manage user accounts (create, update, delete)
router.post('/users', authenticate, authorizeAdmin, validateRequest(UserManagementRequest), asyncHandler(async (req, res) => {
  // Extract user management action and data from request body
  const { action, userData } = req.body;
  
  let result;
  
  // Call appropriate adminService method based on action
  switch (action) {
    case 'create':
      result = await adminService.createUser(userData);
      break;
    case 'update':
      result = await adminService.updateUser(userData);
      break;
    case 'delete':
      result = await adminService.deleteUser(userData.id);
      break;
    default:
      throw new Error('Invalid user management action');
  }
  
  // Format and send response with result of operation
  res.json(formatResponse(result));
}));

// GET /audit-logs - Retrieve system audit logs
router.get('/audit-logs', authenticate, authorizeAdmin, asyncHandler(async (req, res) => {
  // Extract pagination and filter parameters from query string
  const { page, limit, startDate, endDate } = req.query;
  
  // Call adminService to get audit logs
  const auditLogs = await adminService.getAuditLogs({
    page: Number(page),
    limit: Number(limit),
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined
  });
  
  // Format and send response with audit logs
  res.json(formatResponse(auditLogs));
}));

export default router;