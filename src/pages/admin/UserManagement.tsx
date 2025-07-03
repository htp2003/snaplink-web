import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Lock,
  Unlock,
  Trash2,
  Filter,
  Users,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shield,
  Camera,
  MapPin,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authService } from "../../services/authService";
import UserDetailModal from "../../components/admin/modals/UserDetailModal";
import EditUserModal from "../../components/admin/modals/EditUserModal";
import {
  DeleteUserModal,
  ToggleStatusModal,
} from "../../components/admin/modals/ConfirmationModals";

// Simplified User interface
interface SimpleUser {
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
  [key: string]: any;
}

const UserManagement: React.FC = () => {
  const [userList, setUserList] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState<
    "name" | "email" | "role" | "status" | "created"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SimpleUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SimpleUser | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [togglingUser, setTogglingUser] = useState<SimpleUser | null>(null);

  // Helper functions for user roles (updated for new API format)
  const getUserRoles = (user: SimpleUser): string[] => {
    // New API format has roles.$values array
    if (user.roles?.$values && Array.isArray(user.roles.$values)) {
      return user.roles.$values;
    }

    // Fallback to navigation properties (old format)
    const roles: string[] = [];
    if (user.administrators?.$values?.length > 0) roles.push("Admin");
    if (user.moderators?.$values?.length > 0) roles.push("Moderator");
    if (user.photographers?.$values?.length > 0) roles.push("Photographer");
    if (user.locationOwners?.$values?.length > 0) roles.push("Venue Owner");

    // If no specific roles, default to User
    if (roles.length === 0) roles.push("User");

    return roles;
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Moderator":
        return "bg-blue-100 text-blue-800";
      case "Photographer":
        return "bg-green-100 text-green-800";
      case "Venue Owner":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-3 h-3" />;
      case "Moderator":
        return <UserCheck className="w-3 h-3" />;
      case "Photographer":
        return <Camera className="w-3 h-3" />;
      case "Venue Owner":
        return <MapPin className="w-3 h-3" />;
      default:
        return <User className="w-3 h-3" />;
    }
  };

  const getPrimaryRole = (user: SimpleUser): string => {
    const roles = getUserRoles(user);
    // Priority: Admin > Moderator > Photographer > Venue Owner > User
    if (roles.includes("Admin")) return "Admin";
    if (roles.includes("Moderator")) return "Moderator";
    if (roles.includes("Photographer")) return "Photographer";
    if (roles.includes("Venue Owner")) return "Venue Owner";
    return "User";
  };

  // Direct API call without service wrapper
  const loadUsers = async (roleFilter?: string) => {
    try {
      setLoading(true);
      const token = authService.getToken();

      let endpoint = "";

      // Sử dụng đúng endpoint dựa vào role filter
      if (!roleFilter || roleFilter === "all") {
        endpoint = "/api/User/all";
      } else {
        // Map UI role names to API role names (confirmed lowercase works)
        const roleMapping: Record<string, string> = {
          admin: "admin",
          moderator: "moderator",
          photographer: "photographer",
          "venue owner": "locationowner", // Cần test - có thể là "venue_owner"
          user: "user",
        };

        const apiRoleName = roleMapping[roleFilter.toLowerCase()] || roleFilter;
        endpoint = `/api/User/by-role/${apiRoleName}`;
      }

      console.log("🔗 Calling endpoint:", endpoint);

      const response = await fetch(
        `https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", response.status, errorText);

        if (response.status === 404 && roleFilter && roleFilter !== "all") {
          toast.error(
            `Role "${roleFilter}" not found or no users with this role.`
          );
          setUserList([]);
          return;
        } else {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("📥 Raw API response:", data);

      // Parse response data (same logic as before)
      let usersArray: SimpleUser[] = [];

      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data?.$values && Array.isArray(data.$values)) {
        usersArray = data.$values;
      } else if (data?.data && Array.isArray(data.data)) {
        usersArray = data.data;
      } else if (data?.users && Array.isArray(data.users)) {
        usersArray = data.users;
      } else {
        console.log("❌ Unknown response format:", data);
        throw new Error("Invalid API response format");
      }

      console.log("✅ Parsed users:", usersArray.length);
      setUserList([...usersArray]);
      toast.success(`Loaded ${usersArray.length} users successfully!`);
    } catch (error) {
      console.error("💥 API Error:", error);
      toast.error("Failed to load users");
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 Component mounted, loading users...");
    loadUsers();
  }, []);

  // Reload users when role filter changes
  useEffect(() => {
    if (roleFilter !== "all") {
      console.log("🎭 Role filter changed to:", roleFilter);
      loadUsers(roleFilter);
    }
  }, [roleFilter]);

  const handleRoleFilterChange = (newRole: string) => {
    setRoleFilter(newRole);
    if (newRole === "all") {
      loadUsers(); // Load all users
    }
    // For specific roles, useEffect will trigger loadUsers(roleFilter)
  };

  // Filter and sort users (simplified since role filtering now done by API)
  const filteredAndSortedUsers = (() => {
    // Only filter by search term since role filtering is done by API
    let filtered = userList.filter((user) => {
      if (!searchTerm) return true;

      const search = searchTerm.toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.userName?.toLowerCase().includes(search)
      );
    });

    // Sort the filtered results
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
  })();

  // Role statistics
  const roleStats = {
    admin: userList.filter((u) => getUserRoles(u).includes("Admin")).length,
    moderator: userList.filter((u) => getUserRoles(u).includes("Moderator"))
      .length,
    photographer: userList.filter((u) =>
      getUserRoles(u).includes("Photographer")
    ).length,
    venueOwner: userList.filter((u) => getUserRoles(u).includes("Venue Owner"))
      .length,
    user: userList.filter((u) => getPrimaryRole(u) === "User").length,
  };

  // Log current state
  console.log("🎨 RENDER - Current state:");
  console.log("  - userList.length:", userList.length);
  console.log("  - loading:", loading);
  console.log(
    "  - filteredAndSortedUsers.length:",
    filteredAndSortedUsers.length
  );
  console.log("  - roleFilter:", roleFilter);
  console.log("  - searchTerm:", searchTerm);

  // Role statistics
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  console.log("🔍 Filtered users:", filteredAndSortedUsers.length);

  // Management Functions
  const handleViewUser = async (user: SimpleUser) => {
    try {
      console.log("👁️ View user:", user.fullName);

      // Get detailed user info via API
      const token = authService.getToken();
      const response = await fetch(
        `https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net/api/User/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        console.log("📥 User detail data:", userData);

        setSelectedUser(userData);
        setShowModal(true);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Không thể tải thông tin chi tiết user");

      // Fallback to basic info
      setSelectedUser(user);
      setShowModal(true);
    }
  };

  const handleEditUser = (user: SimpleUser) => {
    console.log("✏️ Edit user:", user.fullName);
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (user: SimpleUser) => {
    console.log(`🔒 Toggle status for user ${user.userId}`);
    setTogglingUser(user);
    setShowToggleModal(true);
  };

  const confirmToggleStatus = async (user: SimpleUser) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    const action = user.status === "Active" ? "locked" : "unlocked";

    try {
      // TODO: Implement actual API call for status toggle
      // For now, simulate the action
      console.log("Would call API to update user status:", {
        userId: user.userId,
        status: newStatus,
      });

      // Update local state optimistically
      setUserList((prev) =>
        prev.map((u) =>
          u.userId === user.userId ? { ...u, status: newStatus } : u
        )
      );

      toast.success(`User ${user.fullName} has been ${action}`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
      throw error;
    }
  };

  const handleDeleteUser = async (user: SimpleUser) => {
    console.log(`🗑️ Delete user ${user.userId}`);
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async (user: SimpleUser) => {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net/api/User/delete/${user.userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setUserList((prev) => prev.filter((u) => u.userId !== user.userId));
        toast.success(`User ${user.fullName} has been deleted`);
        console.log("✅ User deleted successfully");
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
      throw error;
    }
  };

  const handleCreateUser = () => {
    console.log("➕ Create new user");
    toast("Create User modal - Coming soon!");
    // TODO: Open create user modal
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              User Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and monitor all users in the system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateUser}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
            <button
              onClick={loadUsers}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">
                  {userList.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Admins</p>
                <p className="text-xl font-bold text-gray-900">
                  {roleStats.admin}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Moderators</p>
                <p className="text-xl font-bold text-gray-900">
                  {roleStats.moderator}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Camera className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">
                  Photographers
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {roleStats.photographer}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MapPin className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">
                  Venue Owners
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {roleStats.venueOwner}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">
                  Regular Users
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {roleStats.user}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or username..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={roleFilter}
                  onChange={(e) => handleRoleFilterChange(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="moderator">Moderators</option>
                  <option value="photographer">Photographers</option>
                  <option value="venue owner">Venue Owners</option>
                  <option value="user">Regular Users</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field as typeof sortBy);
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="email-asc">Email A-Z</option>
                  <option value="email-desc">Email Z-A</option>
                  <option value="role-asc">Role A-Z</option>
                  <option value="role-desc">Role Z-A</option>
                  <option value="status-asc">Status A-Z</option>
                  <option value="status-desc">Status Z-A</option>
                  <option value="created-asc">Oldest First</option>
                  <option value="created-desc">Newest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedUsers.length} of {userList.length} users
              {roleFilter !== "all" && ` • Filtered by: ${roleFilter}`}
              {searchTerm && ` • Search: "${searchTerm}"`}
            </p>
            {(roleFilter !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setRoleFilter("all");
                  setSearchTerm("");
                  loadUsers(); // Reload all users
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredAndSortedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>User</span>
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Role</span>
                      <SortIcon field="role" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("created")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Created</span>
                      <SortIcon field="created" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user, index) => {
                  const userRoles = getUserRoles(user);
                  const primaryRole = getPrimaryRole(user);

                  return (
                    <tr
                      key={user.userId || index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-sm">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {user.fullName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {userRoles.map((role, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                role
                              )}`}
                            >
                              {getRoleIcon(role)}
                              <span className="ml-1">{role}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <>
                              <Unlock className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="inline-flex items-center p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="inline-flex items-center p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                              user.status === "Active"
                                ? "text-red-600 bg-red-50 hover:bg-red-100"
                                : "text-green-600 bg-green-50 hover:bg-green-100"
                            }`}
                            title={
                              user.status === "Active"
                                ? "Lock User"
                                : "Unlock User"
                            }
                          >
                            {user.status === "Active" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="inline-flex items-center p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {userList.length === 0 ? "No Users Found" : "No Matching Users"}
            </h3>
            <p className="text-gray-500 mb-4">
              {userList.length === 0
                ? "There are no users in the system yet."
                : `No users match your current filters (${
                    roleFilter !== "all" ? `Role: ${roleFilter}` : ""
                  }${searchTerm ? `, Search: "${searchTerm}"` : ""}).`}
            </p>
            {userList.length === 0 ? (
              <button
                onClick={loadUsers}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Users</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setRoleFilter("all");
                  setSearchTerm("");
                }}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Filter className="w-4 h-4" />
                <span>Clear All Filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onUserUpdated={loadUsers}
      />

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onUserUpdated={loadUsers}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        user={deletingUser}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUser(null);
        }}
        onConfirm={confirmDeleteUser}
      />

      {/* Toggle Status Modal */}
      <ToggleStatusModal
        user={togglingUser}
        isOpen={showToggleModal}
        onClose={() => {
          setShowToggleModal(false);
          setTogglingUser(null);
        }}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
};

export default UserManagement;
