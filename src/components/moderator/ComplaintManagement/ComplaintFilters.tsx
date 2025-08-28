import React from "react";
import { Search, Filter, X } from "lucide-react";
import { ComplaintFilters as Filters } from "../../../types/moderator/ComplaintManagement.types";

interface ComplaintFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onResetFilters: () => void;
  complaintTypes: string[];
  complaintStatuses: string[];
  loading?: boolean;
}

const ComplaintFilters: React.FC<ComplaintFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  complaintTypes,
  complaintStatuses,
  loading = false,
}) => {
  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value.length > 0
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search complaints..."
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || ""}
            onChange={(e) => onFiltersChange({ status: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">All Statuses</option>
            {complaintStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <select
            value={filters.complaintType || ""}
            onChange={(e) => onFiltersChange({ complaintType: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="">All Types</option>
            {complaintTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <input
            type="date"
            placeholder="From date"
            value={filters.dateFrom || ""}
            onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* Date To */}
        <div>
          <input
            type="date"
            placeholder="To date"
            value={filters.dateTo || ""}
            onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Filter Actions */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filters applied</span>
          </div>
          <button
            onClick={onResetFilters}
            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintFilters;
