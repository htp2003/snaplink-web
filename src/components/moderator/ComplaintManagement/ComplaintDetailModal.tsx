// Updated ComplaintDetailModal.tsx
import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Camera,
  ExternalLink,
  Calendar,
  Image,
  FolderOpen,
} from "lucide-react";
import {
  ComplaintDetailResponse,
  STATUS_COLORS,
  ComplaintStatus,
} from "../../../types/moderator/ComplaintManagement.types";
import { PhotoDeliveryResponse } from "../../../services/photoDeliveryService";
import { bookingService } from "../../../services/bookingService";

interface ComplaintDetailModalProps {
  complaint: ComplaintDetailResponse | null;
  photoDelivery?: PhotoDeliveryResponse | null;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  photoDeliveryLoading?: boolean;
  onUpdateStatus?: (id: number, status: string) => Promise<boolean>;
  onAssignModerator?: (id: number, moderatorId: number) => Promise<boolean>;
}

const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  photoDelivery,
  isOpen,
  onClose,
  loading,
  photoDeliveryLoading = false,
  onUpdateStatus,
  onAssignModerator,
}) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [resolutionNotes, setResolutionNotes] = React.useState("");
  const [showActions, setShowActions] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && complaint) {
      setResolutionNotes(complaint.resolutionNotes || "");
      setShowActions(canTakeAction(complaint.status || ""));
    }
  }, [isOpen, complaint]);

  const canTakeAction = (status: string) => {
    return status === "Pending" || status === "Under Review";
  };

  const handleResolve = async () => {
    if (
      !complaint ||
      !onUpdateStatus ||
      !onAssignModerator ||
      !resolutionNotes.trim()
    )
      return;

    setIsProcessing(true);
    try {
      // Step 1: Assign moderator
      console.log(
        "Step 1: Assigning moderator ID 1 to complaint:",
        complaint.complaintId
      );
      const assignSuccess = await onAssignModerator(complaint.complaintId, 1);
      if (!assignSuccess) {
        throw new Error("Failed to assign moderator");
      }
      console.log("Step 1 completed: Moderator assigned successfully");

      // Step 2: Update status to Resolved
      console.log("Step 2: Updating complaint status to Resolved");
      const updateSuccess = await onUpdateStatus(
        complaint.complaintId,
        "Resolved"
      );

      if (updateSuccess) {
        console.log("Step 2 completed: Complaint status updated to Resolved");

        // Step 3: If has bookingId, cancel booking
        if (complaint.bookingId) {
          console.log("Step 3: Cancelling booking:", complaint.bookingId);
          try {
            await bookingService.cancelBooking(complaint.bookingId);
            console.log("Step 3 completed: Booking cancelled successfully");
          } catch (bookingError) {
            console.warn("Failed to cancel booking:", bookingError);
          }
        }
        onClose();
      }
    } catch (error: any) {
      console.error("Resolve process failed:", error);
      alert("Failed to resolve complaint: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!complaint || !onUpdateStatus) return;

    const confirmed = window.confirm(
      `Are you sure you want to reject complaint #${complaint.complaintId}?`
    );

    if (confirmed) {
      setIsProcessing(true);
      try {
        const success = await onUpdateStatus(complaint.complaintId, "Rejected");
        if (success) {
          // If has bookingId, complete booking (complaint rejected = no issue)
          if (complaint.bookingId) {
            console.log(
              "Completing booking after rejecting complaint:",
              complaint.bookingId
            );
            try {
              await bookingService.completeBooking(complaint.bookingId);
              console.log(
                "Booking completed successfully after complaint rejection"
              );
            } catch (bookingError) {
              console.warn("Failed to complete booking:", bookingError);
            }
          }
          onClose();
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    const colorClass =
      STATUS_COLORS[status as ComplaintStatus] || "bg-gray-100 text-gray-800";
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
      >
        {status}
      </span>
    );
  };

  const getPhotoDeliveryStatusBadge = (status: string) => {
    let colorClass = "bg-gray-100 text-gray-800";

    switch (status?.toLowerCase()) {
      case "pending":
        colorClass = "bg-yellow-100 text-yellow-800";
        break;
      case "uploaded":
      case "delivered":
        colorClass = "bg-green-100 text-green-800";
        break;
      case "expired":
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
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDriveLinkClick = (driveLink: string) => {
    window.open(driveLink, "_blank", "noopener,noreferrer");
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium text-gray-900">
                Complaint Details #{complaint?.complaintId}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {loading ? (
            <div className="animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : complaint ? (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    {getStatusBadge(complaint.status || "")}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <p className="text-sm text-gray-900">
                      {complaint.complaintType || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking ID
                    </label>
                    <p className="text-sm text-gray-900">
                      {complaint.bookingId || "Not related to booking"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(complaint.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Updated At
                    </label>
                    <p className="text-sm text-gray-900">
                      {formatDate(complaint.updatedAt)}
                    </p>
                  </div>

                  {complaint.moderatorInfo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Moderator
                      </label>
                      <p className="text-sm text-gray-900">
                        {complaint.moderatorInfo.fullName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  Description
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {complaint.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Photo Delivery Information */}
              {complaint.bookingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera className="inline h-4 w-4 mr-1" />
                    Photo Delivery Information (Booking ID:{" "}
                    {complaint.bookingId})
                  </label>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    {photoDeliveryLoading ? (
                      <div className="animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                        </div>
                        <p className="text-sm text-blue-600 mt-2">
                          Loading photo delivery data...
                        </p>
                      </div>
                    ) : photoDelivery ? (
                      <div className="space-y-4">
                        {/* Drive Link as "Xem ảnh" Button */}
                        {photoDelivery.driveLink && (
                          <div>
                            <button
                              onClick={() =>
                                handleDriveLinkClick(photoDelivery.driveLink!)
                              }
                              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium transition-colors"
                              title="Open photo gallery"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Xem ảnh
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </button>
                          </div>
                        )}

                        {/* Notes */}
                        {photoDelivery.notes && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Delivery Notes:
                            </label>
                            <div className="bg-white p-3 rounded-md border border-blue-200">
                              <p className="text-sm text-gray-900">
                                {photoDelivery.notes}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Show message if no drive link */}
                        {!photoDelivery.driveLink && (
                          <div className="text-center py-2">
                            <p className="text-sm text-gray-500">
                              Photos not yet uploaded by photographer
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Camera className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">
                          No photo delivery information available for this
                          booking
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Resolution Notes */}
              {complaint.resolutionNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Notes
                  </label>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {complaint.resolutionNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reporter Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Reporter
                  </h4>
                  {complaint.reporterInfo ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {complaint.reporterInfo.fullName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {complaint.reporterInfo.email}
                        </span>
                      </div>
                      {complaint.reporterInfo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {complaint.reporterInfo.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {complaint.reporterInfo.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            complaint.reporterInfo.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {complaint.reporterInfo.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Reporter information not available
                    </p>
                  )}
                </div>

                {/* Reported User Info */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Reported User
                  </h4>
                  {complaint.reportedUserInfo ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {complaint.reportedUserInfo.fullName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {complaint.reportedUserInfo.email}
                        </span>
                      </div>
                      {complaint.reportedUserInfo.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {complaint.reportedUserInfo.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {complaint.reportedUserInfo.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            complaint.reportedUserInfo.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {complaint.reportedUserInfo.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Reported user information not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No complaint data available</p>
            </div>
          )}

          {/* Footer with Actions */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            {showActions && complaint && (
              <>
                {/* Resolution Notes Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Notes{" "}
                    {canTakeAction(complaint.status || "") && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Add resolution notes or comments..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={
                      isProcessing || !canTakeAction(complaint.status || "")
                    }
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {resolutionNotes.length}/500 characters
                  </p>
                </div>

                {/* Action Buttons */}
                {canTakeAction(complaint.status || "") && (
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleResolve}
                        disabled={isProcessing || !resolutionNotes.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : "Resolve"}
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={isProcessing}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : "Reject"}
                      </button>
                    </div>

                    <button
                      onClick={onClose}
                      disabled={isProcessing}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      Close
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Close button only when no actions */}
            {!showActions && (
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render to document.body to avoid z-index issues
  return createPortal(modalContent, document.body);
};

export default ComplaintDetailModal;
