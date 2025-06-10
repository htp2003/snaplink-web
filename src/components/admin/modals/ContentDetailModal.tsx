import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Calendar, Eye, CheckCircle, XCircle } from "lucide-react";
import { ContentModeration } from "../../../mocks/content";

interface ContentDetailModalProps {
  content: ContentModeration | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !content) return null;

  const getTypeLabel = (type: ContentModeration["type"]): string => {
    switch (type) {
      case "photographer_profile":
        return "Hồ sơ nhiếp ảnh gia";
      case "venue_photos":
        return "Ảnh địa điểm";
      case "photographer_portfolio":
        return "Bộ sưu tập ảnh";
      default:
        return "Khác";
    }
  };

  const getStatusColor = (status: ContentModeration["status"]): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(content.id);
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(content.id);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
      }}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Chi tiết nội dung</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{content.title}</h3>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  content.status
                )}`}
              >
                {content.status === "approved"
                  ? "Đã duyệt"
                  : content.status === "rejected"
                  ? "Đã từ chối"
                  : "Chờ duyệt"}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{content.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Thông tin người gửi
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{content.user.name}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{content.user.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Chi tiết nội dung
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">
                    Loại: {getTypeLabel(content.type)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">
                    Ngày tạo:{" "}
                    {new Date(content.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample content preview */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              Xem trước nội dung
            </h4>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <Eye className="w-6 h-6 text-gray-400" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Hình ảnh mẫu - {getTypeLabel(content.type)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Đóng
          </button>

          {content.status === "pending" && (
            <div className="space-x-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Từ chối
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ContentDetailModal;
