import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '@/models/user';
import { SKU } from '@/models/sku';
import { QuoteStatus } from '@/types';

class Quote extends Model {
  public id!: string;
  public userId!: string;
  public status!: QuoteStatus;
  public totalAmount!: number;
  public discountAmount!: number;
  public taxAmount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public expiresAt?: Date;
  public notes?: string;
  public metadata?: object;

  // Custom method to format JSON representation of the quote
  public toJSON(): object {
    // Create a copy of the instance's values
    const values = { ...this.get() };

    // Format dates to ISO strings
    values.createdAt = values.createdAt.toISOString();
    values.updatedAt = values.updatedAt.toISOString();
    if (values.expiresAt) {
      values.expiresAt = values.expiresAt.toISOString();
    }

    // Format decimal values to fixed precision
    values.totalAmount = parseFloat(values.totalAmount).toFixed(2);
    values.discountAmount = parseFloat(values.discountAmount).toFixed(2);
    values.taxAmount = parseFloat(values.taxAmount).toFixed(2);

    // Return the modified object
    return values;
  }

  // Method to calculate and update quote totals
  public async calculateTotals(): Promise<void> {
    // Fetch all associated QuoteItems
    const quoteItems = await this.getQuoteItems();

    // Calculate subtotal from QuoteItems
    const subtotal = quoteItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Apply discount if any
    const discountedTotal = subtotal - this.discountAmount;

    // Calculate tax amount
    this.taxAmount = discountedTotal * 0.1; // Assuming 10% tax rate

    // Set totalAmount
    this.totalAmount = discountedTotal + this.taxAmount;

    // Save the updated quote
    await this.save();
  }

  // Define associations with other models
  static associate(models: any) {
    // Associate Quote with User (belongsTo)
    Quote.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

    // Associate Quote with QuoteItem (hasMany)
    Quote.hasMany(models.QuoteItem, { foreignKey: 'quoteId', as: 'quoteItems' });
  }

  // Hooks
  static hooks = {
    // Sets the expiration date before creating the quote
    beforeCreate: (quote: Quote) => {
      if (!quote.expiresAt) {
        quote.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      }
    },

    // Performs actions after creating the quote
    afterCreate: (quote: Quote) => {
      // Log quote creation in audit trail
      console.log(`Quote created: ${quote.id}`);
      // TODO: Implement proper audit trail logging
    },

    // Performs actions after updating the quote
    afterUpdate: (quote: Quote) => {
      // Log quote update in audit trail
      console.log(`Quote updated: ${quote.id}`);
      // TODO: Implement proper audit trail logging
    }
  };
}

Quote.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(QuoteStatus)),
      allowNull: false,
      defaultValue: QuoteStatus.DRAFT,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      description: 'Stores additional metadata about the quote',
    },
  },
  {
    sequelize: new Sequelize('database', 'username', 'password', {
      host: 'localhost',
      dialect: 'postgres',
    }),
    modelName: 'Quote',
    tableName: 'quotes',
    hooks: Quote.hooks,
  }
);

export { Quote };

// Human tasks:
// TODO: Implement proper audit trail logging in afterCreate and afterUpdate hooks