import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '@/models/user';
import { ChatSessionStatus } from '@/types';

class ChatSession extends Model {
  public id!: string;
  public userId!: string;
  public status!: ChatSessionStatus;
  public startTime!: Date;
  public endTime?: Date;
  public context?: object;
  public metadata?: object;

  // Custom method to format JSON representation
  public toJSON(): object {
    // Create a copy of the instance's values
    const values = { ...this.get() };

    // Format dates to ISO strings
    if (values.startTime) {
      values.startTime = values.startTime.toISOString();
    }
    if (values.endTime) {
      values.endTime = values.endTime.toISOString();
    }

    // Return the modified object
    return values;
  }

  // Class method to define associations
  public static associate(models: any): void {
    // Associate ChatSession with User (belongsTo)
    ChatSession.belongsTo(models.User, { foreignKey: 'userId' });

    // Associate ChatSession with ChatMessage (hasMany)
    ChatSession.hasMany(models.ChatMessage, { foreignKey: 'chatSessionId' });
  }

  // Hook to set endTime when session is closed
  public static beforeUpdate(session: ChatSession): void {
    if (session.changed('status') && session.status === ChatSessionStatus.CLOSED) {
      session.endTime = new Date();
    }
  }
}

// Initialize the ChatSession model
const initChatSession = (sequelize: Sequelize): typeof ChatSession => {
  ChatSession.init(
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
        type: DataTypes.ENUM(...Object.values(ChatSessionStatus)),
        allowNull: false,
        defaultValue: ChatSessionStatus.ACTIVE,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      context: {
        type: DataTypes.JSON,
        allowNull: true,
        description: 'Stores contextual information for the chat session',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        description: 'Stores additional metadata about the chat session',
      },
    },
    {
      sequelize,
      modelName: 'ChatSession',
      hooks: {
        beforeUpdate: ChatSession.beforeUpdate,
      },
    }
  );

  return ChatSession;
};

export default initChatSession;