import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useSimpleComplaintManagement } from "../../hooks/moderator/SimpleComplaintManagement.hooks";
import ComplaintTable from "../../components/moderator/ComplaintManagement/ComplaintTable";
import ComplaintFilters from "../../components/moderator/ComplaintManagement/ComplaintFilters";
import ComplaintDetailModal from "../../components/moderator/ComplaintManagement/ComplaintDetailModal";
// import SimpleModalTest from '../../components/moderator/ComplaintManagement/SimpleModalTest';
import ResolveComplaintModal from "../../components/moderator/ComplaintManagement/ResolveComplaintModal";
import { ComplaintStatus } from "../../types/moderator/ComplaintManagement.types";
import { complaintService } from "../../services/complaintService";
import { toast } from "react-hot-toast";

const ComplaintManagement: React.FC = () => {
  const {
    // Data
    complaints,
    complaintDetail,
    complaintTypes,
    complaintStatuses,
    pagination,

    // Loading states
    loading,

    // Filters
    filters,

    // Actions
    fetchComplaints,
    resolveComplaint,
    updateComplaintStatus,
    setFilters,
    resetFilters,

    // Modal states
    modals,
    setDetailModal,
    setResolveModal,

    // Selected complaint
    selectedComplaintId,
  } = useSimpleComplaintManagement();

  const assignModerator = async (
    id: number,
    moderatorId: number
  ): Promise<boolean> => {
    try {
      await complaintService.assignModerator(id, moderatorId);
      toast.success("Moderator assigned successfully");
      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to assign moderator"
      );
      console.error("Assign moderator error:", error);
      return false;
    }
  };

  // Calculate stats
  const stats = {
    total: pagination.total,
    underReview: complaints.filter(
      (c) => c.status === "Pending" || c.status === "Under Review"
    ).length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    rejected: complaints.filter((c) => c.status === "Rejected").length,
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchComplaints({
      page,
      pageSize: pagination.pageSize,
      ...filters,
    });
  };

  // Handle resolve complaint
  const handleResolveComplaint = async (data: any) => {
    if (selectedComplaintId) {
      const success = await resolveComplaint(selectedComplaintId, data);
      if (success) {
        setResolveModal(false);
      }
      return success;
    }
    return false;
  };

  // Handle update status with confirmation
  const handleUpdateStatus = async (id: number, status: string) => {
    const complaint = complaints.find((c) => c.complaintId === id);
    if (!complaint) return;

    const action = status === "Rejected" ? "reject" : "update";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} complaint #${id} from "${complaint.reporterName}" about "${complaint.reportedUserName}"?`
    );

    if (confirmed) {
      await updateComplaintStatus(id, status);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Complaint Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Review and manage user complaints
          </p>
        </div>
        <button
          onClick={() => fetchComplaints()}
          disabled={loading.list}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading.list ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Complaints
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Under Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.underReview}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.resolved}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Rejected
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.rejected}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ComplaintFilters
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        complaintTypes={complaintTypes}
        complaintStatuses={complaintStatuses}
        loading={loading.list}
      />

      {/* Table - Updated: loại bỏ onResolve và onUpdateStatus từ table */}
      <ComplaintTable
        complaints={complaints}
        loading={loading.list}
        onViewDetail={(id) => setDetailModal(true, id)}
        currentPage={pagination.current}
        pageSize={pagination.pageSize}
      />

      {/* Detail Modal - Updated: thêm onResolve và onUpdateStatus */}
      <ComplaintDetailModal
        complaint={complaintDetail}
        isOpen={modals.detail}
        onClose={() => setDetailModal(false)}
        loading={loading.detail}
        onUpdateStatus={updateComplaintStatus}
        onAssignModerator={assignModerator}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current <= 1 || loading.list}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={
                pagination.current >= pagination.totalPages || loading.list
              }
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.current - 1) * pagination.pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.current * pagination.pageSize,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current <= 1 || loading.list}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const page = i + 1;
                    const isActive = page === pagination.current;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={loading.list}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          isActive
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={
                    pagination.current >= pagination.totalPages || loading.list
                  }
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
    </div>
  );
};

export default ComplaintManagement;
