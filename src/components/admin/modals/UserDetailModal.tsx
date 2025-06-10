import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, Calendar, MapPin } from "lucide-react";
import { User as UserType } from "../../../mocks/users";

interface UserDetailModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
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

  if (!isOpen || !user) return null;

  const getRoleLabel = (role: UserType["role"]): string => {
    switch (role) {
      case "user":
        return "Người dùng";
      case "photographer":
        return "Nhiếp ảnh gia";
      case "venue_owner":
        return "Chủ địa điểm";
      case "admin":
        return "Quản trị viên";
      case "moderator":
        return "Kiểm duyệt viên";
      default:
        return "Khác";
    }
  };

  const getStatusColor = (status: UserType["status"]): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Chi tiết người dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(
                  user.status
                )}`}
              >
                {user.status === "active"
                  ? "Hoạt động"
                  : user.status === "inactive"
                  ? "Bị khóa"
                  : "Chờ xác nhận"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Thông tin cơ bản
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">ID: {user.id}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm">
                    Vai trò: {getRoleLabel(user.role)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Thống kê</h4>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-gray-500">Ngày tham gia:</span>
                  <span className="ml-2">15/05/2024</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Lần đăng nhập cuối:</span>
                  <span className="ml-2">10/06/2024</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Tổng booking:</span>
                  <span className="ml-2">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Đóng
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserDetailModal;
