import { User } from '@/models/user';
import { AppError } from '@/utils/errorHandler';
import { hashPassword, comparePassword } from '@/utils/passwordUtils';
import { UserData, UpdateUserRequest } from '@/types';

class UserService {
  constructor() {
    // Initialize any necessary dependencies or connections
  }

  async createUser(userData: UserData): Promise<UserData> {
    // Validate user data
    if (!userData.email || !userData.password) {
      throw new AppError('Email and password are required', 400);
    }

    // Check if user with same email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create new User instance
    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Return formatted user data (excluding password)
    const { password, ...userDataWithoutPassword } = newUser.toObject();
    return userDataWithoutPassword;
  }

  async getUserById(userId: string): Promise<UserData> {
    // Query database for the specified user
    const user = await User.findById(userId);

    // If user not found, throw AppError
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Format and return user data (excluding password)
    const { password, ...userDataWithoutPassword } = user.toObject();
    return userDataWithoutPassword;
  }

  async updateUser(userId: string, updateData: UpdateUserRequest): Promise<UserData> {
    // Retrieve existing user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validate update data
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    // Apply updates to user data
    Object.assign(user, updateData);

    // If password is being updated, hash the new password
    if (updateData.password) {
      user.password = await hashPassword(updateData.password);
    }

    // Save updated user to database
    await user.save();

    // Return updated user data (excluding password)
    const { password, ...updatedUserData } = user.toObject();
    return updatedUserData;
  }

  async deleteUser(userId: string): Promise<void> {
    // Retrieve user to be deleted
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Remove user from database
    await User.findByIdAndDelete(userId);

    // Clean up any associated data (e.g., sessions, preferences)
    // TODO: Implement cleanup of associated data

    // Return success response
    return;
  }

  async getUserByEmail(email: string): Promise<UserData> {
    // Query database for user with specified email
    const user = await User.findOne({ email });

    // If user not found, throw AppError
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Return user data (excluding password)
    const { password, ...userDataWithoutPassword } = user.toObject();
    return userDataWithoutPassword;
  }

  async validateUserCredentials(email: string, password: string): Promise<UserData> {
    // Retrieve user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Compare provided password with stored hash
    const isPasswordValid = await comparePassword(password, user.password);

    // If passwords don't match, throw AppError
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Return user data (excluding password)
    const { password: _, ...userDataWithoutPassword } = user.toObject();
    return userDataWithoutPassword;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    // Retrieve user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validate current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update user's password in database
    user.password = hashedNewPassword;
    await user.save();

    // Return success response
    return;
  }
}

export { UserService };