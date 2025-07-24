// src/components/admin/UserManagement/OtherComponents/UserTable.tsx

import React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Lock,
  Unlock,
  Trash2,
  Users,
  Filter,
  User,
  Shield,
  UserCheck,
  Camera,
  MapPin,
} from "lucide-react";
import {
  SimpleUser,
  SortField,
  SortOrder,
} from "../../../../types/UserManagement.types";

// Sort Icon Component
interface SortIconProps {
  field: SortField;
  currentSortBy: SortField;
  sortOrder: SortOrder;
}

const SortIcon: React.FC<SortIconProps> = ({
  field,
  currentSortBy,
  sortOrder,
}) => {
  if (currentSortBy !== field)
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  return sortOrder === "asc" ? (
    <ArrowUp className="w-4 h-4 text-blue-600" />
  ) : (
    <ArrowDown className="w-4 h-4 text-blue-600" />
  );
};

// Role Badge Component
interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
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

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
        role
      )}`}
    >
      {getRoleIcon(role)}
      <span className="ml-1">{role}</span>
    </span>
  );
};

// User Table Component
interface UserTableProps {
  users: SimpleUser[];
  sortBy: SortField;
  sortOrder: SortOrder;
  getUserRoles: (user: SimpleUser) => string[];
  onSort: (field: SortField) => void;
  onViewUser: (user: SimpleUser) => void;
  onEditUser: (user: SimpleUser) => void;
  onToggleStatus: (user: SimpleUser) => void;
  onDeleteUser: (user: SimpleUser) => void;
  onClearFilters: () => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  sortBy,
  sortOrder,
  getUserRoles,
  onSort,
  onViewUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onClearFilters,
}) => {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Matching Users
          </h3>
          <p className="text-gray-500 mb-4">
            No users match your current filters.
          </p>
          <button
            onClick={onClearFilters}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Filter className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>User</span>
                  <SortIcon
                    field="name"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort("email")}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <SortIcon
                    field="email"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort("role")}
              >
                <div className="flex items-center space-x-1">
                  <span>Role</span>
                  <SortIcon
                    field="role"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon
                    field="status"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort("created")}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <SortIcon
                    field="created"
                    currentSortBy={sortBy}
                    sortOrder={sortOrder}
                  />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => {
              const userRoles = getUserRoles(user);

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
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {userRoles.map((role, idx) => (
                        <RoleBadge key={idx} role={role} />
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
                        onClick={() => onViewUser(user)}
                        className="inline-flex items-center p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditUser(user)}
                        className="inline-flex items-center p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`inline-flex items-center p-2 rounded-lg transition-colors ${
                          user.status === "Active"
                            ? "text-red-600 bg-red-50 hover:bg-red-100"
                            : "text-green-600 bg-green-50 hover:bg-green-100"
                        }`}
                        title={
                          user.status === "Active" ? "Lock User" : "Unlock User"
                        }
                      >
                        {user.status === "Active" ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteUser(user)}
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
    </div>
  );
};

export default UserTable;
