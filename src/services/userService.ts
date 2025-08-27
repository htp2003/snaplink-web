// services/userService.ts - FIXED VERSION
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

  // Get users by role - with better error handling
  async getUsersByRole(roleName: string) {
    try {
      // Handle different role name formats that might exist in your backend
      const roleMapping: Record<string, string[]> = {
        admin: ["admin", "Admin"],
        moderator: ["moderator", "Moderator"],
        photographer: ["photographer", "Photographer"],
        "venue owner": ["owner", "locationowner", "venue_owner", "VenueOwner"],
        user: ["user", "User"],
      };

      const possibleRoleNames = roleMapping[roleName.toLowerCase()] || [
        roleName,
      ];

      // Try different role name variations
      for (const possibleRole of possibleRoleNames) {
        try {
          const endpoint = replaceUrlParams(API_ENDPOINTS.USERS_BY_ROLE, {
            roleName: possibleRole,
          });

          const response = await apiClient.get<User[]>(endpoint);

          if (response.success && response.data) {
            return response;
          }
        } catch (error) {
          // Continue to next role name variation
          console.warn(
            `Role name '${possibleRole}' failed, trying next variation`
          );
        }
      }

      // If all variations failed, return empty result
      return {
        success: false,
        message: `No users found for role: ${roleName}`,
        data: [] as User[],
      };
    } catch (error) {
      console.error("Error in getUsersByRole:", error);
      return {
        success: false,
        message: "Failed to fetch users by role",
        data: [] as User[],
      };
    }
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

  // Helper method to get all users from different roles (for dashboard)
  async getAllUsersByRoles() {
    try {
      const roleTypes = ["admin", "moderator", "photographer", "owner", "user"];

      const rolePromises = roleTypes.map(async (role) => {
        try {
          const response = await this.getUsersByRole(role);
          return response.success ? response.data : [];
        } catch (error) {
          console.warn(`Error fetching role ${role}:`, error);
          return [];
        }
      });

      const roleResults = await Promise.all(rolePromises);

      // Merge all users, avoiding duplicates
      const userMap = new Map<number, User>();
      roleResults.flat().forEach((user: User) => {
        if (!userMap.has(user.userId)) {
          userMap.set(user.userId, user);
        }
      });

      return {
        success: true,
        data: Array.from(userMap.values()),
        message: "Users loaded successfully",
      };
    } catch (error) {
      console.error("Error loading all users by roles:", error);
      return {
        success: false,
        data: [] as User[],
        message: "Failed to load users",
      };
    }
  }
}

export const userService = new UserService();
