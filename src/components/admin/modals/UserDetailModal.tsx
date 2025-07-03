import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, Calendar, Shield, Phone, FileText } from "lucide-react";

// Use the SimpleUser interface from parent component
interface SimpleUser {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
  createAt: string;
  updateAt: string;
  status: string;
  [key: string]: any;
}

interface UserDetailModalProps {
  user: SimpleUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated?: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated,
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

  const formatDate = (dateString?: string): string => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
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
          <h2 className="text-xl font-semibold">Chi tiết người dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 mr-4 flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {user.fullName || "N/A"}
              </h3>
              <p className="text-gray-600 mb-2">@{user.userName || "N/A"}</p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </span>
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
                  Người dùng
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">User ID</div>
              <div className="font-mono text-lg">{user.userId}</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Thông tin cơ bản
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{user.email || "N/A"}</div>
                    </div>
                  </div>

                  {user.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">
                          Số điện thoại
                        </div>
                        <div className="font-medium">{user.phoneNumber}</div>
                      </div>
                    </div>
                  )}

                  {user.bio && (
                    <div className="flex items-start">
                      <FileText className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                      <div>
                        <div className="text-sm text-gray-500">Giới thiệu</div>
                        <div className="font-medium text-sm leading-relaxed">
                          {user.bio}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500" />
                  Thông tin tài khoản
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Trạng thái</div>
                    <div className="font-medium">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Username</div>
                    <div className="font-medium font-mono">
                      {user.userName || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline & Statistics */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-500" />
                  Thời gian
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Ngày tạo</div>
                    <div className="font-medium">
                      {formatDate(user.createAt)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">
                      Cập nhật lần cuối
                    </div>
                    <div className="font-medium">
                      {formatDate(user.updateAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics using navigation properties */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Thống kê</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(user.bookings as any)?.$values?.length || 0}
                    </div>
                    <div className="text-sm text-blue-600">Booking</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(user.transactions as any)?.$values?.length || 0}
                    </div>
                    <div className="text-sm text-green-600">Giao dịch</div>
                  </div>
                </div>
              </div>

              {/* Role Detection */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">
                  Vai trò & Quyền hạn
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Là admin:</span>
                    <span className="font-medium">
                      {(user.administrators as any)?.$values?.length > 0
                        ? "Có"
                        : "Không"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Là moderator:</span>
                    <span className="font-medium">
                      {(user.moderators as any)?.$values?.length > 0
                        ? "Có"
                        : "Không"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Là photographer:</span>
                    <span className="font-medium">
                      {(user.photographers as any)?.$values?.length > 0
                        ? "Có"
                        : "Không"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Chủ địa điểm:</span>
                    <span className="font-medium">
                      {(user.locationOwners as any)?.$values?.length > 0
                        ? "Có"
                        : "Không"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-2">
              Hành động quản trị
            </h5>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-3 py-1 text-sm bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300 transition-colors"
                onClick={() => alert("Chức năng gửi thông báo đang phát triển")}
              >
                Gửi thông báo
              </button>
              <button
                className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300 transition-colors"
                onClick={() =>
                  alert("Chức năng reset mật khẩu đang phát triển")
                }
              >
                Reset mật khẩu
              </button>
              <button
                className="px-3 py-1 text-sm bg-red-200 text-red-800 rounded hover:bg-red-300 transition-colors"
                onClick={() =>
                  alert("Chức năng khóa tài khoản đang phát triển")
                }
              >
                Tạm khóa tài khoản
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => alert("Chức năng chỉnh sửa đang được phát triển")}
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UserDetailModal;
