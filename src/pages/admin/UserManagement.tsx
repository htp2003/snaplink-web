// src/pages/admin/UserManagement.tsx

import React, { useState } from "react";
import { Users, Plus, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

// Hooks
import {
  useUserManagement,
  useUserFilters,
  useUserStats,
} from "../../hooks/UserManagement.hooks";

// Components
import UserStatsSection from "../../components/admin/UserManagement/OtherComponents/UserStats";
import UserFilters from "../../components/admin/UserManagement/OtherComponents/UserFilters";
import UserTable from "../../components/admin/UserManagement/OtherComponents/UserTable";

// Types
import { SimpleUser } from "../../types/UserManagement.types";

// Modals
import UserDetailModal from "../../components/admin/UserManagement/modals/UserDetailModal";
import EditUserModal from "../../components/admin/UserManagement/modals/EditUserModal";
import {
  DeleteUserModal,
  ToggleStatusModal,
} from "../../components/admin/UserManagement/modals/ConfirmationModals";

const UserManagement: React.FC = () => {
  // Hooks
  const {
    userList,
    loading,
    loadUsers,
    getUserDetails,
    deleteUser,
    toggleUserStatus,
  } = useUserManagement();
  const {
    searchTerm,
    roleFilter,
    sortBy,
    sortOrder,
    setSearchTerm,
    setRoleFilter,
    filteredAndSortedUsers,
    getUserRoles,
    handleSort,
    clearFilters,
  } = useUserFilters(userList);
  const { roleStats, totalUsers } = useUserStats(userList, getUserRoles);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SimpleUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SimpleUser | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [togglingUser, setTogglingUser] = useState<SimpleUser | null>(null);

  // Event handlers
  const handleRoleFilterChange = (newRole: string) => {
    setRoleFilter(newRole);
    loadUsers(newRole === "all" ? undefined : newRole);
  };

  const handleViewUser = async (user: SimpleUser) => {
    try {
      const userData = await getUserDetails(user.userId);
      setSelectedUser(userData || user);
      setShowModal(true);
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết user");
      setSelectedUser(user);
      setShowModal(true);
    }
  };

  const handleEditUser = (user: SimpleUser) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleToggleStatus = (user: SimpleUser) => {
    setTogglingUser(user);
    setShowToggleModal(true);
  };

  const confirmToggleStatus = async (user: SimpleUser) => {
    const success = await toggleUserStatus(user.userId, user.status);
    const action = user.status === "Active" ? "locked" : "unlocked";

    if (success) {
      toast.success(`User ${user.fullName} has been ${action}`);
    } else {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = (user: SimpleUser) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async (user: SimpleUser) => {
    const success = await deleteUser(user.userId);
    if (success) {
      toast.success(`User ${user.fullName} has been deleted`);
    } else {
      toast.error("Failed to delete user");
    }
  };

  const handleCreateUser = () => {
    toast("Create User modal - Coming soon!");
  };

  const handleClearFilters = () => {
    clearFilters();
    loadUsers();
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
      {/* Header */}
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
              onClick={() =>
                loadUsers(roleFilter === "all" ? undefined : roleFilter)
              }
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <UserStatsSection roleStats={roleStats} totalUsers={totalUsers} />
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        userListLength={userList.length}
        filteredUsersLength={filteredAndSortedUsers.length}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={handleRoleFilterChange}
        onSortChange={handleSort}
        onClearFilters={handleClearFilters}
      />

      {/* User Table */}
      <UserTable
        users={filteredAndSortedUsers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        getUserRoles={getUserRoles}
        onSort={handleSort}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        onClearFilters={handleClearFilters}
      />

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onUserUpdated={() =>
          loadUsers(roleFilter === "all" ? undefined : roleFilter)
        }
      />

      <EditUserModal
        user={editingUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onUserUpdated={() =>
          loadUsers(roleFilter === "all" ? undefined : roleFilter)
        }
      />

      <DeleteUserModal
        user={deletingUser}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingUser(null);
        }}
        onConfirm={confirmDeleteUser}
      />

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
