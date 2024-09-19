import { Router } from 'express';
import { QuoteService } from '@/services/quoteService';
import { validateRequest } from '@/middleware/validateRequest';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate } from '@/middleware/auth';
import { formatResponse } from '@/utils/responseFormatter';
import { Quote, NewQuoteRequest, UpdateQuoteRequest } from '@/types';

// Create Express router instance for quote routes
const router: Router = Router();

// Create instance of QuoteService for handling quote-related logic
const quoteService = new QuoteService();

// Generate a new quote
router.post('/generate', authenticate, validateRequest(NewQuoteRequest), asyncHandler(async (req, res) => {
    // Extract quote parameters from request body
    const quoteParams = req.body;

    // Call quoteService.generateQuote with parameters
    const generatedQuote = await quoteService.generateQuote(quoteParams);

    // Format and send response with generated quote
    res.json(formatResponse(generatedQuote));
}));

// Retrieve a specific quote by ID
router.get('/:quoteId', authenticate, asyncHandler(async (req, res) => {
    // Extract quote ID from request parameters
    const { quoteId } = req.params;

    // Call quoteService.getQuote with quote ID
    const quote = await quoteService.getQuote(quoteId);

    // Format and send response with quote data
    res.json(formatResponse(quote));
}));

// Update an existing quote
router.put('/:quoteId', authenticate, validateRequest(UpdateQuoteRequest), asyncHandler(async (req, res) => {
    // Extract quote ID from request parameters
    const { quoteId } = req.params;

    // Extract update data from request body
    const updateData = req.body;

    // Call quoteService.updateQuote with quote ID and update data
    const updatedQuote = await quoteService.updateQuote(quoteId, updateData);

    // Format and send response with updated quote data
    res.json(formatResponse(updatedQuote));
}));

// Delete a specific quote
router.delete('/:quoteId', authenticate, asyncHandler(async (req, res) => {
    // Extract quote ID from request parameters
    const { quoteId } = req.params;

    // Call quoteService.deleteQuote with quote ID
    await quoteService.deleteQuote(quoteId);

    // Format and send response confirming deletion
    res.json(formatResponse({ message: 'Quote deleted successfully' }));
}));

// Retrieve a list of quotes for a user
router.get('/', authenticate, asyncHandler(async (req, res) => {
    // Extract user ID from authenticated request
    const userId = req.user.id;

    // Extract pagination parameters from query string
    const { page, limit } = req.query;

    // Call quoteService.listQuotes with user ID and pagination parameters
    const quotes = await quoteService.listQuotes(userId, { page: Number(page), limit: Number(limit) });

    // Format and send response with list of quotes
    res.json(formatResponse(quotes));
}));

export default router;