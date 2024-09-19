import { SKU } from '@/models/sku';
import { AppError } from '@/utils/errorHandler';
import { SKUData, NewSKURequest, UpdateSKURequest, SKUSearchParams } from '@/types';

class SKUService {
  constructor() {
    // Initialize any necessary dependencies or connections
  }

  async createSKU(skuData: NewSKURequest): Promise<SKUData> {
    // Validate SKU data
    if (!this.validateSKUData(skuData)) {
      throw new AppError('Invalid SKU data', 400);
    }

    // Check for existing SKU with same code
    const existingSKU = await SKU.findOne({ code: skuData.code });
    if (existingSKU) {
      throw new AppError('SKU with this code already exists', 409);
    }

    // Create new SKU instance
    const newSKU = new SKU(skuData);

    // Save SKU to database
    await newSKU.save();

    // Return formatted SKU data
    return this.formatSKUData(newSKU);
  }

  async getSKU(skuId: string): Promise<SKUData> {
    // Query database for the specified SKU
    const sku = await SKU.findById(skuId);

    // If SKU not found, throw AppError
    if (!sku) {
      throw new AppError('SKU not found', 404);
    }

    // Format and return SKU data
    return this.formatSKUData(sku);
  }

  async updateSKU(skuId: string, updateData: UpdateSKURequest): Promise<SKUData> {
    // Retrieve existing SKU
    const sku = await SKU.findById(skuId);
    if (!sku) {
      throw new AppError('SKU not found', 404);
    }

    // Apply updates to SKU data
    Object.assign(sku, updateData);

    // Validate updated SKU data
    if (!this.validateSKUData(sku)) {
      throw new AppError('Invalid SKU data', 400);
    }

    // Save updated SKU to database
    await sku.save();

    // Return updated SKU data
    return this.formatSKUData(sku);
  }

  async deleteSKU(skuId: string): Promise<void> {
    // Retrieve SKU to be deleted
    const sku = await SKU.findById(skuId);
    if (!sku) {
      throw new AppError('SKU not found', 404);
    }

    // Check if SKU can be safely deleted (no active quotes)
    // This step would require additional logic to check for active quotes
    // For now, we'll assume it's safe to delete

    // Remove SKU from database
    await sku.remove();

    // Return success response
    return;
  }

  async searchSKUs(searchParams: SKUSearchParams): Promise<{ skus: SKUData[], total: number }> {
    // Build database query based on search parameters
    const query: any = {};
    if (searchParams.code) query.code = { $regex: searchParams.code, $options: 'i' };
    if (searchParams.name) query.name = { $regex: searchParams.name, $options: 'i' };
    if (searchParams.minPrice) query.price = { $gte: searchParams.minPrice };
    if (searchParams.maxPrice) query.price = { ...query.price, $lte: searchParams.maxPrice };

    // Execute search query
    const skus = await SKU.find(query)
      .skip(searchParams.offset || 0)
      .limit(searchParams.limit || 10)
      .sort(searchParams.sortBy || 'createdAt');

    const total = await SKU.countDocuments(query);

    // Format SKU data
    const formattedSKUs = skus.map(sku => this.formatSKUData(sku));

    // Return list of SKUs and total count
    return { skus: formattedSKUs, total };
  }

  private validateSKUData(skuData: NewSKURequest | UpdateSKURequest): boolean {
    // Check required fields
    if (!skuData.code || !skuData.name || !skuData.price) {
      return false;
    }

    // Validate SKU code format (assuming it should be alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(skuData.code)) {
      return false;
    }

    // Validate price and quantity (if provided)
    if (skuData.price <= 0 || (skuData.quantity !== undefined && skuData.quantity < 0)) {
      return false;
    }

    // Return validation result
    return true;
  }

  private formatSKUData(sku: any): SKUData {
    return {
      id: sku._id.toString(),
      code: sku.code,
      name: sku.name,
      description: sku.description,
      price: sku.price,
      quantity: sku.quantity,
      createdAt: sku.createdAt,
      updatedAt: sku.updatedAt
    };
  }
}

export { SKUService };