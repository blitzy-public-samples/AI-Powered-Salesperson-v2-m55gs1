import { Router } from 'express';
import { SKUService } from '@/services/skuService';
import { validateRequest } from '@/middleware/validateRequest';
import { asyncHandler } from '@/middleware/errorHandler';
import { authenticate } from '@/middleware/auth';
import { formatResponse } from '@/utils/responseFormatter';
import { SKU, NewSKURequest, UpdateSKURequest, SKUSearchParams } from '@/types';

// Create Express router instance for SKU routes
const router = Router();

// Create instance of SKUService for handling SKU-related logic
const skuService = new SKUService();

// Create a new SKU
router.post('/', authenticate, validateRequest(NewSKURequest), asyncHandler(async (req, res) => {
  // Extract SKU data from request body
  const skuData: NewSKURequest = req.body;

  // Call skuService.createSKU with SKU data
  const createdSKU = await skuService.createSKU(skuData);

  // Format and send response with created SKU
  res.status(201).json(formatResponse(createdSKU));
}));

// Retrieve a specific SKU by ID
router.get('/:skuId', authenticate, asyncHandler(async (req, res) => {
  // Extract SKU ID from request parameters
  const { skuId } = req.params;

  // Call skuService.getSKU with SKU ID
  const sku = await skuService.getSKU(skuId);

  // Format and send response with SKU data
  res.json(formatResponse(sku));
}));

// Update an existing SKU
router.put('/:skuId', authenticate, validateRequest(UpdateSKURequest), asyncHandler(async (req, res) => {
  // Extract SKU ID from request parameters
  const { skuId } = req.params;

  // Extract update data from request body
  const updateData: UpdateSKURequest = req.body;

  // Call skuService.updateSKU with SKU ID and update data
  const updatedSKU = await skuService.updateSKU(skuId, updateData);

  // Format and send response with updated SKU data
  res.json(formatResponse(updatedSKU));
}));

// Delete a specific SKU
router.delete('/:skuId', authenticate, asyncHandler(async (req, res) => {
  // Extract SKU ID from request parameters
  const { skuId } = req.params;

  // Call skuService.deleteSKU with SKU ID
  await skuService.deleteSKU(skuId);

  // Format and send response confirming deletion
  res.json(formatResponse({ message: 'SKU deleted successfully' }));
}));

// Search for SKUs based on provided parameters
router.get('/search', authenticate, validateRequest(SKUSearchParams), asyncHandler(async (req, res) => {
  // Extract search parameters from query string
  const searchParams: SKUSearchParams = req.query;

  // Call skuService.searchSKUs with search parameters
  const matchingSKUs = await skuService.searchSKUs(searchParams);

  // Format and send response with list of matching SKUs
  res.json(formatResponse(matchingSKUs));
}));

export default router;