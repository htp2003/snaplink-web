// src/hooks/UserManagement.hooks.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import {
  SimpleUser,
  UserStats,
  SortField,
  SortOrder,
} from "../../types/admin/UserManagement.types";

const API_BASE =
  "https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net/api";

// Main hook for user management
export const useUserManagement = () => {
  const [userList, setUserList] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all users by fetching from all role endpoints
  const loadAllUsersByRoles = useCallback(async () => {
    try {
      const token = authService.getToken();
      const roleTypes = [
        "admin",
        "moderator",
        "photographer",
        "locationowner",
        "user",
      ];

      const rolePromises = roleTypes.map(async (role) => {
        try {
          const response = await fetch(`${API_BASE}/User/by-role/${role}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
          }
          return [];
        } catch (error) {
          console.error(`Error fetching role ${role}:`, error);
          return [];
        }
      });

      const roleResults = await Promise.all(rolePromises);

      // Merge all users, avoiding duplicates
      const userMap = new Map<number, SimpleUser>();
      roleResults.flat().forEach((user: SimpleUser) => {
        const existingUser = userMap.get(user.userId);
        if (existingUser) {
          const mergedRoles = [
            ...new Set([...(existingUser.roles || []), ...(user.roles || [])]),
          ];
          userMap.set(user.userId, { ...existingUser, roles: mergedRoles });
        } else {
          userMap.set(user.userId, { ...user });
        }
      });

      const allUsers = Array.from(userMap.values());
      setUserList(allUsers);
      toast.success(`Loaded ${allUsers.length} users successfully!`);
    } catch (error) {
      console.error("Error loading all users:", error);
      throw error;
    }
  }, []);

  // Load users with optional role filter
  const loadUsers = useCallback(
    async (roleFilter?: string) => {
      try {
        setLoading(true);

        if (!roleFilter || roleFilter === "all") {
          await loadAllUsersByRoles();
        } else {
          const token = authService.getToken();
          const roleMapping: Record<string, string> = {
            admin: "admin",
            moderator: "moderator",
            photographer: "photographer",
            "venue owner": "locationowner",
            user: "user",
          };

          const apiRoleName =
            roleMapping[roleFilter.toLowerCase()] || roleFilter;
          const response = await fetch(
            `${API_BASE}/User/by-role/${apiRoleName}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            if (response.status === 404) {
              toast.error(`No users found with role "${roleFilter}"`);
              setUserList([]);
              return;
            }
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          const usersArray = Array.isArray(data) ? data : [];
          setUserList([...usersArray]);
          toast.success(`Loaded ${usersArray.length} users successfully!`);
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Failed to load users");
        setUserList([]);
      } finally {
        setLoading(false);
      }
    },
    [loadAllUsersByRoles]
  );

  // Get user details
  const getUserDetails = async (userId: number): Promise<SimpleUser | null> => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE}/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  // Delete user
  const deleteUser = async (userId: number): Promise<boolean> => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE}/User/delete/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUserList((prev) => prev.filter((u) => u.userId !== userId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  // Toggle user status
  const toggleUserStatus = async (
    userId: number,
    currentStatus: string
  ): Promise<boolean> => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      setUserList((prev) =>
        prev.map((u) => (u.userId === userId ? { ...u, status: newStatus } : u))
      );
      return true;
    } catch (error) {
      console.error("Error toggling user status:", error);
      return false;
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    userList,
    loading,
    loadUsers,
    getUserDetails,
    deleteUser,
    toggleUserStatus,
    setUserList,
  };
};

// Hook for filters and sorting
export const useUserFilters = (userList: SimpleUser[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const getUserRoles = (user: SimpleUser): string[] => {
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      return user.roles.map((role: any) =>
        typeof role === "string" ? role : role.name || role
      );
    }

    const roles: string[] = [];
    if (user.administrators?.length) roles.push("Admin");
    if (user.moderators?.length) roles.push("Moderator");
    if (user.photographers?.length) roles.push("Photographer");
    if (user.locationOwners?.length) roles.push("Venue Owner");

    return roles.length > 0 ? roles : ["User"];
  };

  const getPrimaryRole = (user: SimpleUser): string => {
    const roles = getUserRoles(user);
    if (roles.includes("Admin")) return "Admin";
    if (roles.includes("Moderator")) return "Moderator";
    if (roles.includes("Photographer")) return "Photographer";
    if (roles.includes("Venue Owner")) return "Venue Owner";
    return "User";
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = userList.filter((user) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.userName?.toLowerCase().includes(search)
      );
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "name":
          aValue = a.fullName?.toLowerCase() || "";
          bValue = b.fullName?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email?.toLowerCase() || "";
          bValue = b.email?.toLowerCase() || "";
          break;
        case "role":
          aValue = getPrimaryRole(a);
          bValue = getPrimaryRole(b);
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "created":
          aValue = new Date(a.createAt).getTime();
          bValue = new Date(b.createAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [userList, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return {
    searchTerm,
    roleFilter,
    sortBy,
    sortOrder,
    setSearchTerm,
    setRoleFilter,
    filteredAndSortedUsers,
    getUserRoles,
    getPrimaryRole,
    handleSort,
    clearFilters: () => {
      setSearchTerm("");
      setRoleFilter("all");
    },
  };
};

// Hook for stats calculation
export const useUserStats = (
  userList: SimpleUser[],
  getUserRoles: (user: SimpleUser) => string[]
) => {
  const roleStats: UserStats = useMemo(() => {
    const stats = {
      admin: 0,
      moderator: 0,
      photographer: 0,
      venueOwner: 0,
      user: 0,
    };

    userList.forEach((user) => {
      const roles = getUserRoles(user);
      if (roles.includes("Admin")) stats.admin++;
      else if (roles.includes("Moderator")) stats.moderator++;
      else if (roles.includes("Photographer")) stats.photographer++;
      else if (roles.includes("Venue Owner")) stats.venueOwner++;
      else stats.user++;
    });

    return stats;
  }, [userList, getUserRoles]);

  return { roleStats, totalUsers: userList.length };
};
