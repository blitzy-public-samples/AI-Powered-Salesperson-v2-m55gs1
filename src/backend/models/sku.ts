import { Model, DataTypes, Sequelize } from 'sequelize';
import { SKUCategory } from '@/types';

class SKU extends Model {
  public id!: string;
  public code!: string;
  public name!: string;
  public description?: string;
  public category!: SKUCategory;
  public price!: number;
  public cost?: number;
  public stockQuantity!: number;
  public isActive!: boolean;
  public metadata?: object;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Custom method to format JSON representation
  public toJSON(): object {
    // Create a copy of the instance's values
    const values = { ...this.get() };
    
    // Format decimal values to fixed precision
    if (values.price) values.price = parseFloat(values.price.toFixed(2));
    if (values.cost) values.cost = parseFloat(values.cost.toFixed(2));
    
    // Return the modified object
    return values;
  }

  // Class method to define associations
  public static associate(models: any): void {
    // Associate SKU with QuoteItem (hasMany)
    SKU.hasMany(models.QuoteItem, { foreignKey: 'skuId' });
  }

  // Hooks
  public static beforeCreate(sku: SKU): void {
    // Validate SKU code format
    if (!/^[A-Z0-9]{6,10}$/.test(sku.code)) {
      throw new Error('Invalid SKU code format. It should be 6-10 alphanumeric characters.');
    }

    // Ensure price and cost are non-negative
    if (sku.price < 0 || (sku.cost !== undefined && sku.cost < 0)) {
      throw new Error('Price and cost must be non-negative.');
    }
  }

  public static beforeUpdate(sku: SKU): void {
    // Validate SKU code format if changed
    if (sku.changed('code') && !/^[A-Z0-9]{6,10}$/.test(sku.code)) {
      throw new Error('Invalid SKU code format. It should be 6-10 alphanumeric characters.');
    }

    // Ensure price and cost are non-negative if changed
    if ((sku.changed('price') && sku.price < 0) || 
        (sku.changed('cost') && sku.cost !== undefined && sku.cost < 0)) {
      throw new Error('Price and cost must be non-negative.');
    }
  }

  public static afterUpdate(sku: SKU): void {
    // Log SKU update in audit trail if significant fields changed
    const significantFields = ['name', 'description', 'category', 'price', 'cost', 'isActive'];
    if (significantFields.some(field => sku.changed(field))) {
      // TODO: Implement audit trail logging
      console.log(`SKU ${sku.code} updated. Audit trail should be logged.`);
    }
  }
}

// Initialize the SKU model
SKU.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(...Object.values(SKUCategory)),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
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
  },
  {
    sequelize: new Sequelize('database', 'username', 'password', {
      host: 'localhost',
      dialect: 'mysql',
    }),
    modelName: 'SKU',
    tableName: 'skus',
    hooks: {
      beforeCreate: SKU.beforeCreate,
      beforeUpdate: SKU.beforeUpdate,
      afterUpdate: SKU.afterUpdate,
    },
  }
);

export { SKU };