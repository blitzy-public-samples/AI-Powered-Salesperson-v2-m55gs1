import { Router } from 'express';
import { ChatService } from '@/services/chatService';
import { validateRequest } from '@/middleware/validateRequest';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate } from '@/middleware/auth';
import { formatResponse } from '@/utils/responseFormatter';
import { ChatMessage, ChatSession, NewChatRequest } from '@/types';

// Create an Express router instance for chat routes
const router = Router();

// Create an instance of ChatService for handling chat-related logic
const chatService = new ChatService();

// Route to initiate a new chat session
router.post('/start', authenticate, validateRequest(NewChatRequest), asyncHandler(async (req, res) => {
    // Extract user ID from authenticated request
    const userId = req.user.id;

    // Call chatService to start a new chat
    const newSession = await chatService.startNewChat(userId);

    // Format and send response with new chat session data
    res.json(formatResponse(newSession));
}));

// Route to send a new message in a chat
router.post('/send', authenticate, validateRequest(ChatMessage), asyncHandler(async (req, res) => {
    // Extract chat session ID and message content from request body
    const { sessionId, content } = req.body;

    // Call chatService to send the message and get AI response
    const result = await chatService.sendMessage(sessionId, content);

    // Format and send response with sent message and AI response
    res.json(formatResponse(result));
}));

// Route to retrieve chat history for a user
router.get('/history', authenticate, asyncHandler(async (req, res) => {
    // Extract user ID from authenticated request
    const userId = req.user.id;

    // Call chatService to get chat history
    const history = await chatService.getChatHistory(userId);

    // Format and send response with chat history
    res.json(formatResponse(history));
}));

// Route to retrieve a specific chat session
router.get('/:sessionId', authenticate, asyncHandler(async (req, res) => {
    // Extract chat session ID from request parameters
    const { sessionId } = req.params;

    // Call chatService to get chat session data
    const session = await chatService.getChatSession(sessionId);

    // Format and send response with chat session data
    res.json(formatResponse(session));
}));

export default router;