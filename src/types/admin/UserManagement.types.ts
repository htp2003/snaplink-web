// src/types/UserManagement.types.ts

export interface SimpleUser {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
  createAt: string;
  updateAt: string;
  status: string;
  roles?: string[];
  administrators?: any[];
  moderators?: any[];
  photographers?: any[];
  locationOwners?: any[];
  userRoles?: any[];
  [key: string]: any;
}

export interface UserStats {
  admin: number;
  moderator: number;
  photographer: number;
  venueOwner: number;
  user: number;
}

export type SortField = "name" | "email" | "role" | "status" | "created";
export type SortOrder = "asc" | "desc";
