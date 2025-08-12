// src/components/admin/ContentModeration/PhotographerModeration.tsx

import React, { useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Camera,
  DollarSign,
  AlertTriangle,
  Filter,
  Search,
} from "lucide-react";
import { usePhotographerModeration } from "../../../hooks/moderator/ContentModeration.hooks";
import {
  PhotographerModerationItem,
  VerificationStatus,
} from "../../../types/moderator/ContentModeration.types";
import ContentDetailModal from "./ContentDetailModal";

interface PhotographerCardProps {
  photographer: PhotographerModerationItem;
  onVerify: (id: number, status: VerificationStatus, notes?: string) => void;
  onViewDetails: (photographer: PhotographerModerationItem) => void;
  loading?: boolean;
  actionLoading?: number | null;
}

const PhotographerCard: React.FC<PhotographerCardProps> = ({
  photographer,
  onVerify,
  onViewDetails,
  loading,
  actionLoading,
}) => {
  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return "bg-green-100 text-green-800";
      case VerificationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case VerificationStatus.SUSPENDED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case VerificationStatus.REJECTED:
        return <XCircle className="w-4 h-4 text-red-600" />;
      case VerificationStatus.SUSPENDED:
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const isActionLoading = actionLoading === photographer.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {photographer.profileImage ? (
              <img
                src={photographer.profileImage}
                alt={photographer.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {photographer.fullName}
              </h3>
              <div className="flex items-center space-x-2">
                {getStatusIcon(photographer.verificationStatus)}
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    photographer.verificationStatus
                  )}`}
                >
                  {photographer.verificationStatus}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {photographer.email}
            </p>
            {photographer.phoneNumber && (
              <p className="text-xs text-gray-400">
                {photographer.phoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {photographer.averageRating.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <Camera className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {photographer.totalReviews}
              </span>
            </div>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">
                {photographer.hourlyRate
                  ? `$${photographer.hourlyRate}`
                  : "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-500">Rate/hr</p>
          </div>
        </div>

        {/* Experience & Equipment */}
        {(photographer.yearsExperience || photographer.equipment) && (
          <div className="mb-4">
            {photographer.yearsExperience && (
              <p className="text-xs text-gray-600 mb-1">
                <strong>Experience:</strong> {photographer.yearsExperience}{" "}
                years
              </p>
            )}
            {photographer.equipment && (
              <p className="text-xs text-gray-600 truncate">
                <strong>Equipment:</strong> {photographer.equipment}
              </p>
            )}
          </div>
        )}

        {/* Bio */}
        {photographer.bio && (
          <div className="mb-4">
            <p className="text-xs text-gray-600 line-clamp-2">
              {photographer.bio}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={() => onViewDetails(photographer)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </button>

          {photographer.verificationStatus === VerificationStatus.PENDING && (
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  onVerify(photographer.id, VerificationStatus.REJECTED)
                }
                disabled={loading || isActionLoading}
                className="flex items-center text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <XCircle className="w-4 h-4 mr-1" />
                )}
                Reject
              </button>
              <button
                onClick={() =>
                  onVerify(photographer.id, VerificationStatus.VERIFIED)
                }
                disabled={loading || isActionLoading}
                className="flex items-center text-green-600 hover:text-green-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-1" />
                )}
                Verify
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PhotographerModeration: React.FC = () => {
  const { photographers, loading, actionLoading, verifyPhotographer, refresh } =
    usePhotographerModeration();

  const [selectedPhotographer, setSelectedPhotographer] =
    useState<PhotographerModerationItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "all">(
    "all"
  );

  // Filter photographers
  const filteredPhotographers = photographers.filter((photographer) => {
    const matchesSearch =
      photographer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photographer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      photographer.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get counts by status
  const statusCounts = {
    all: photographers.length,
    pending: photographers.filter(
      (p) => p.verificationStatus === VerificationStatus.PENDING
    ).length,
    verified: photographers.filter(
      (p) => p.verificationStatus === VerificationStatus.VERIFIED
    ).length,
    rejected: photographers.filter(
      (p) => p.verificationStatus === VerificationStatus.REJECTED
    ).length,
    suspended: photographers.filter(
      (p) => p.verificationStatus === VerificationStatus.SUSPENDED
    ).length,
  };

  const handleVerifyPhotographer = async (
    id: number,
    status: VerificationStatus,
    notes?: string
  ) => {
    await verifyPhotographer(id, status, notes);
  };

  const handleViewDetails = (photographer: PhotographerModerationItem) => {
    setSelectedPhotographer(photographer);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Photographer Verification
          </h2>
          <button
            onClick={refresh}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <div className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}>🔄</div>
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            {
              key: "all",
              label: "Total",
              count: statusCounts.all,
              color: "text-gray-600",
            },
            {
              key: "pending",
              label: "Pending",
              count: statusCounts.pending,
              color: "text-yellow-600",
            },
            {
              key: "verified",
              label: "Verified",
              count: statusCounts.verified,
              color: "text-green-600",
            },
            {
              key: "rejected",
              label: "Rejected",
              count: statusCounts.rejected,
              color: "text-red-600",
            },
            {
              key: "suspended",
              label: "Suspended",
              count: statusCounts.suspended,
              color: "text-gray-600",
            },
          ].map((stat) => (
            <div key={stat.key} className="text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.count}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search photographers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as VerificationStatus | "all")
              }
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value={VerificationStatus.PENDING}>Pending</option>
              <option value={VerificationStatus.VERIFIED}>Verified</option>
              <option value={VerificationStatus.REJECTED}>Rejected</option>
              <option value={VerificationStatus.SUSPENDED}>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredPhotographers.length} of {photographers.length}{" "}
            photographers
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading photographers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotographers.map((photographer) => (
              <PhotographerCard
                key={photographer.id}
                photographer={photographer}
                onVerify={handleVerifyPhotographer}
                onViewDetails={handleViewDetails}
                loading={loading}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}

        {!loading && filteredPhotographers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No photographers found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No photographers have registered yet"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ContentDetailModal
        content={selectedPhotographer}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedPhotographer(null);
        }}
        onApprove={(id) => {
          handleVerifyPhotographer(id, VerificationStatus.VERIFIED);
          setDetailModalOpen(false);
          setSelectedPhotographer(null);
        }}
        onReject={(id) => {
          handleVerifyPhotographer(id, VerificationStatus.REJECTED);
          setDetailModalOpen(false);
          setSelectedPhotographer(null);
        }}
      />
    </div>
  );
};

export default PhotographerModeration;
