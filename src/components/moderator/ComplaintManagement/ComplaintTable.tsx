import React from "react";
import { Eye, MessageSquare } from "lucide-react";
import {
  ComplaintResponse,
  STATUS_COLORS,
  ComplaintStatus,
} from "../../../types/moderator/ComplaintManagement.types";

interface ComplaintTableProps {
  complaints: ComplaintResponse[];
  loading: boolean;
  onViewDetail: (complaintId: number) => void;
  currentPage: number;
  pageSize: number;
}

const ComplaintTable: React.FC<ComplaintTableProps> = ({
  complaints,
  loading,
  onViewDetail,
  currentPage,
  pageSize,
}) => {
  const getStatusBadge = (status: string) => {
    let colorClass = "bg-gray-100 text-gray-800";

    switch (status) {
      case "Under Review":
      case "Pending":
        colorClass = "bg-yellow-100 text-yellow-800";
        break;
      case "Resolved":
        colorClass = "bg-green-100 text-green-800";
        break;
      case "Rejected":
        colorClass = "bg-red-100 text-red-800";
        break;
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRowNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reporter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No complaints found</p>
                </td>
              </tr>
            ) : (
              complaints.map((complaint, index) => (
                <tr key={complaint.complaintId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getRowNumber(index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {complaint.reporterName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {complaint.reporterEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {complaint.reportedUserName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {complaint.reportedUserEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {complaint.complaintType || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(complaint.status || "")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(complaint.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetail(complaint.complaintId)}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-md hover:bg-blue-50"
                      title="View Details & Manage"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintTable;
