import { User } from '@/models/user';
import { ChatSession } from '@/models/chat';
import { Quote } from '@/models/quote';
import { AIModel } from '@/models/aiModel';
import { AuditLog } from '@/models/auditLog';
import { AppError } from '@/utils/errorHandler';
import { SystemStats, AIModelConfig, UserManagementRequest, AuditLogParams } from '@/types';
import { UserService } from '@/services/userService';
import { AIModelService } from '@/services/aiModelService';

class AdminService {
  private userService: UserService;
  private aiModelService: AIModelService;

  constructor(userService: UserService, aiModelService: AIModelService) {
    this.userService = userService;
    this.aiModelService = aiModelService;
  }

  async getSystemStats(): Promise<SystemStats> {
    try {
      // Query database for user count
      const userCount = await User.countDocuments();

      // Query database for active chat sessions count
      const activeChatSessions = await ChatSession.countDocuments({ status: 'active' });

      // Query database for total quotes generated
      const totalQuotes = await Quote.countDocuments();

      // Calculate system uptime
      const uptime = process.uptime();

      // Retrieve AI model performance metrics
      const aiModelMetrics = await this.aiModelService.getPerformanceMetrics();

      // Compile and return system statistics
      return {
        userCount,
        activeChatSessions,
        totalQuotes,
        uptime,
        aiModelMetrics
      };
    } catch (error) {
      throw new AppError('Failed to retrieve system stats', 500);
    }
  }

  async updateAIModelConfig(config: AIModelConfig): Promise<AIModelConfig> {
    try {
      // Validate new configuration
      if (!config || typeof config !== 'object') {
        throw new AppError('Invalid AI model configuration', 400);
      }

      // Call AIModelService to update configuration
      const updatedConfig = await this.aiModelService.updateConfig(config);

      // Log configuration change in audit log
      await AuditLog.create({
        action: 'UPDATE_AI_MODEL_CONFIG',
        details: JSON.stringify(updatedConfig),
        timestamp: new Date()
      });

      // Return updated configuration
      return updatedConfig;
    } catch (error) {
      throw new AppError('Failed to update AI model configuration', 500);
    }
  }

  async manageUser(request: UserManagementRequest): Promise<User> {
    try {
      // Validate user management request
      if (!request || !request.action || !request.userData) {
        throw new AppError('Invalid user management request', 400);
      }

      let result: User;

      // Based on action type (create, update, delete), call appropriate UserService method
      switch (request.action) {
        case 'create':
          result = await this.userService.createUser(request.userData);
          break;
        case 'update':
          result = await this.userService.updateUser(request.userData);
          break;
        case 'delete':
          result = await this.userService.deleteUser(request.userData.id);
          break;
        default:
          throw new AppError('Invalid user management action', 400);
      }

      // Log user management action in audit log
      await AuditLog.create({
        action: `USER_${request.action.toUpperCase()}`,
        details: JSON.stringify(result),
        timestamp: new Date()
      });

      // Return result of operation
      return result;
    } catch (error) {
      throw new AppError('Failed to manage user', 500);
    }
  }

  async getAuditLogs(params: AuditLogParams): Promise<{ logs: AuditLog[], total: number }> {
    try {
      // Validate audit log request parameters
      if (!params || typeof params !== 'object') {
        throw new AppError('Invalid audit log parameters', 400);
      }

      // Query database for audit logs based on parameters
      const query = {};
      if (params.startDate) query['timestamp'] = { $gte: params.startDate };
      if (params.endDate) query['timestamp'] = { ...query['timestamp'], $lte: params.endDate };
      if (params.action) query['action'] = params.action;

      // Apply pagination if specified
      const page = params.page || 1;
      const limit = params.limit || 20;
      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        AuditLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
        AuditLog.countDocuments(query)
      ]);

      // Return formatted audit logs and total count
      return { logs, total };
    } catch (error) {
      throw new AppError('Failed to retrieve audit logs', 500);
    }
  }

  async generateSystemReport(startDate: Date, endDate: Date): Promise<SystemReport> {
    try {
      // Validate date range
      if (!startDate || !endDate || startDate >= endDate) {
        throw new AppError('Invalid date range for system report', 400);
      }

      // Collect user statistics for the period
      const userStats = await User.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, count: { $sum: 1 } } }
      ]);

      // Collect chat statistics for the period
      const chatStats = await ChatSession.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Collect quote statistics for the period
      const quoteStats = await Quote.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, count: { $sum: 1 }, totalValue: { $sum: '$value' } } }
      ]);

      // Retrieve AI model performance metrics for the period
      const aiModelMetrics = await this.aiModelService.getPerformanceMetrics(startDate, endDate);

      // Compile and return comprehensive report
      return {
        period: { startDate, endDate },
        userGrowth: userStats[0]?.count || 0,
        chatActivity: chatStats.reduce((acc, stat) => ({ ...acc, [stat._id]: stat.count }), {}),
        quoteGeneration: {
          count: quoteStats[0]?.count || 0,
          totalValue: quoteStats[0]?.totalValue || 0
        },
        aiModelPerformance: aiModelMetrics
      };
    } catch (error) {
      throw new AppError('Failed to generate system report', 500);
    }
  }
}

export { AdminService };
```

This implementation provides the `AdminService` class with methods for managing admin operations in the AI-powered salesperson chat system. It includes functionality for retrieving system statistics, updating AI model configurations, managing users, retrieving audit logs, and generating system reports.