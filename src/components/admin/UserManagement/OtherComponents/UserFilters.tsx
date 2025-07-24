// src/components/admin/UserManagement/OtherComponents/UserFilters.tsx

import React from "react";
import { Search, Filter, ChevronDown, ArrowUpDown } from "lucide-react";
import { SortField, SortOrder } from "../../../../types/UserManagement.types";

// Search Bar Component
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => (
  <div className="lg:col-span-2">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search users by name, email, or username..."
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </div>
);

// Role Filter Component
interface RoleFilterProps {
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
}

export const RoleFilter: React.FC<RoleFilterProps> = ({
  roleFilter,
  onRoleFilterChange,
}) => (
  <div>
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <select
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
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
);

// Sort Dropdown Component
interface SortDropdownProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => (
  <div>
    <div className="relative">
      <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <select
        value={`${sortBy}-${sortOrder}`}
        onChange={(e) => {
          const [field] = e.target.value.split("-");
          onSortChange(field as SortField);
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
);

// Filters Section Component
interface UserFiltersProps {
  searchTerm: string;
  roleFilter: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  userListLength: number;
  filteredUsersLength: number;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (role: string) => void;
  onSortChange: (field: SortField) => void;
  onClearFilters: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  roleFilter,
  sortBy,
  sortOrder,
  userListLength,
  filteredUsersLength,
  onSearchChange,
  onRoleFilterChange,
  onSortChange,
  onClearFilters,
}) => {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
          <RoleFilter
            roleFilter={roleFilter}
            onRoleFilterChange={onRoleFilterChange}
          />
          <SortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredUsersLength} of {userListLength} users
            {roleFilter !== "all" && ` • Filtered by: ${roleFilter}`}
            {searchTerm && ` • Search: "${searchTerm}"`}
          </p>
          {(roleFilter !== "all" || searchTerm) && (
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
