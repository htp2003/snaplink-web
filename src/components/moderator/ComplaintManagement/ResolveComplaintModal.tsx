import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import {
  ComplaintDetailResponse,
  ComplaintStatus,
  ResolveComplaintRequest,
} from "../../../types/moderator/ComplaintManagement.types";

interface ResolveComplaintModalProps {
  complaint: ComplaintDetailResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (data: ResolveComplaintRequest) => Promise<boolean>;
  loading: boolean;
}

const ResolveComplaintModal: React.FC<ResolveComplaintModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onResolve,
  loading,
}) => {
  const [formData, setFormData] = useState<ResolveComplaintRequest>({
    status: ComplaintStatus.RESOLVED,
    resolutionNotes: "",
  });
  const [errors, setErrors] = useState<Partial<ResolveComplaintRequest>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        status: ComplaintStatus.RESOLVED,
        resolutionNotes: complaint?.resolutionNotes || "",
      });
      setErrors({});
    }
  }, [isOpen, complaint]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ResolveComplaintRequest> = {};

    if (!formData.status.trim()) {
      newErrors.status = "Status is required";
    }

    if (!formData.resolutionNotes.trim()) {
      newErrors.resolutionNotes = "Resolution notes are required";
    } else if (formData.resolutionNotes.length > 500) {
      newErrors.resolutionNotes =
        "Resolution notes must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await onResolve(formData);
    if (success) {
      onClose();
    }
  };

  const handleInputChange = (
    field: keyof ResolveComplaintRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={!loading ? onClose : undefined}
        ></div>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 z-[10000]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900">
                Resolve Complaint #{complaint?.complaintId}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Complaint Summary */}
          {complaint && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Complaint Summary
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {complaint.complaintType}
                </p>
                <p>
                  <span className="font-medium">Reporter:</span>{" "}
                  {complaint.reporterInfo?.fullName}
                </p>
                <p>
                  <span className="font-medium">Reported User:</span>{" "}
                  {complaint.reportedUserInfo?.fullName}
                </p>
              </div>
              {complaint.description && (
                <div className="mt-3">
                  <p className="font-medium text-gray-700 text-sm mb-1">
                    Description:
                  </p>
                  <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                    {complaint.description}
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resolution Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.status ? "border-red-300" : "border-gray-300"
                }`}
                disabled={loading}
              >
                <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                <option value={ComplaintStatus.REJECTED}>Rejected</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>

            {/* Resolution Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Notes <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.resolutionNotes}
                onChange={(e) =>
                  handleInputChange("resolutionNotes", e.target.value)
                }
                rows={4}
                maxLength={500}
                placeholder="Explain how this complaint was resolved or why it was rejected..."
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.resolutionNotes ? "border-red-300" : "border-gray-300"
                }`}
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.resolutionNotes ? (
                  <p className="text-sm text-red-600">
                    {errors.resolutionNotes}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Provide detailed information about the resolution
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  {formData.resolutionNotes.length}/500
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Once resolved, this complaint
                    cannot be reopened. Make sure you have thoroughly
                    investigated the issue.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Resolve Complaint"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render to document.body to avoid z-index issues
  return createPortal(modalContent, document.body);
};

export default ResolveComplaintModal;
