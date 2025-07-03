// services/userService.ts
import { apiClient, replaceUrlParams } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

export interface User {
  // Actual API fields based on response
  userId: number; // Not 'id'
  userName: string;
  email: string;
  passwordHash?: string;
  phoneNumber?: string;
  fullName: string;
  profileImage?: string;
  bio?: string;
  createAt: string; // Not 'createdAt'
  updateAt: string; // Not 'updatedAt'
  status: string; // "Active", etc.

  // Navigation properties (có thể ignore for now)
  administrators?: any;
  bookings?: any;
  locationOwners?: any;
  photographers?: any;
  userRoles?: any;
  // ... other navigation properties

  // Computed fields for UI
  roles?: string[]; // Will be computed from userRoles if needed
}

export interface CreateUserDto {
  userName: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
}

export interface UpdateUserDto {
  userId: number;
  fullName?: string;
  phoneNumber?: string;
  passwordHash?: string;
  profileImage?: string;
  bio?: string;
}

class UserService {
  // Get all users
  async getAllUsers() {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS_ALL);
  }

  // Get user by ID
  async getUserById(userId: number) {
    const endpoint = replaceUrlParams(API_ENDPOINTS.USERS_BY_ID, {
      userId: userId.toString(),
    });
    return apiClient.get<User>(endpoint);
  }

  // Get users by role
  async getUsersByRole(roleName: string) {
    const endpoint = replaceUrlParams(API_ENDPOINTS.USERS_BY_ROLE, {
      roleName,
    });
    return apiClient.get<User[]>(endpoint);
  }

  // Create admin user
  async createAdmin(userData: CreateUserDto) {
    return apiClient.post<User>(API_ENDPOINTS.USERS_CREATE_ADMIN, userData);
  }

  // Create moderator user
  async createModerator(userData: CreateUserDto) {
    return apiClient.post<User>(API_ENDPOINTS.USERS_CREATE_MODERATOR, userData);
  }

  // Update user
  async updateUser(userData: UpdateUserDto) {
    return apiClient.put<User>(API_ENDPOINTS.USERS_UPDATE, userData);
  }

  // Delete user
  async deleteUser(userId: number) {
    const endpoint = replaceUrlParams(API_ENDPOINTS.USERS_DELETE, {
      userId: userId.toString(),
    });
    return apiClient.delete(endpoint);
  }

  // Assign roles to user
  async assignRoles(userId: number, roleIds: number[]) {
    return apiClient.post(API_ENDPOINTS.USERS_ASSIGN_ROLES, {
      userId,
      roleIds,
    });
  }

  // Get user by email (if needed for profile completion)
  async getUserByEmail(email: string) {
    return apiClient.get<User>(
      `/api/User/GetUserByEmail?email=${encodeURIComponent(email)}`
    );
  }
}

export const userService = new UserService();
