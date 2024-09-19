import { Model, DataTypes, Sequelize } from 'sequelize';
import { hashPassword } from '@/utils/passwordUtils';
import { UserRole } from '@/types';

class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public firstName?: string;
  public lastName?: string;
  public lastLogin?: Date;
  public isActive!: boolean;

  // Customize JSON representation of the user
  public toJSON(): object {
    // Create a copy of the instance's values
    const values = { ...this.get() };
    // Delete the password field from the copy
    delete values.password;
    // Return the modified object
    return values;
  }

  // Define the model's attributes
  public static initialize(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM(...Object.values(UserRole)),
          allowNull: false,
          defaultValue: UserRole.SALESPERSON,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
        hooks: {
          // Hash the user's password before creating the record
          beforeCreate: async (user: User) => {
            if (user.password) {
              user.password = await hashPassword(user.password);
            }
          },
          // Hash the user's password before updating if it has changed
          beforeUpdate: async (user: User) => {
            if (user.changed('password')) {
              user.password = await hashPassword(user.password);
            }
          },
        },
      }
    );
  }
}

export { User };