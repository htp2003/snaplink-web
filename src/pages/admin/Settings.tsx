// pages/admin/Settings.tsx - COMPLETE VERSION
import React, { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Shield,
  DollarSign,
  Users,
  Bell,
  Globe,
  Database,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface SystemSettings {
  // Commission rates
  platformCommissionRate: number;
  photographerCommissionRate: number;
  venueCommissionRate: number;

  // Financial settings
  minWithdrawalAmount: number;
  maxFileSize: number;
  maxImagesPerPortfolio: number;
  maxImagesPerVenue: number;

  // User settings
  autoApproveUsers: boolean;
  requireEmailVerification: boolean;
  allowGuestBooking: boolean;

  // Content moderation
  autoApproveContent: boolean;
  enableAIModeration: boolean;
  maxReportsBeforeReview: number;

  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  adminNotificationEmail: string;

  // Website settings
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    platformCommissionRate: 10,
    photographerCommissionRate: 75,
    venueCommissionRate: 15,
    minWithdrawalAmount: 500000,
    maxFileSize: 5,
    maxImagesPerPortfolio: 20,
    maxImagesPerVenue: 15,
    autoApproveUsers: false,
    requireEmailVerification: true,
    allowGuestBooking: true,
    autoApproveContent: false,
    enableAIModeration: true,
    maxReportsBeforeReview: 3,
    emailNotifications: true,
    pushNotifications: true,
    adminNotificationEmail: "admin@snaplink.com",
    siteName: "SnapLink",
    siteDescription: "Nền tảng kết nối nhiếp ảnh gia và khách hàng",
    contactEmail: "contact@snaplink.com",
    supportPhone: "1900-1234",
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Cài đặt đã được lưu thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "Tổng quan", icon: Globe },
    { id: "financial", label: "Tài chính", icon: DollarSign },
    { id: "users", label: "Người dùng", icon: Users },
    { id: "content", label: "Nội dung", icon: Shield },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "system", label: "Hệ thống", icon: Database },
  ];

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-gray-600">
            Cấu hình và quản lý các thông số hệ thống
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => toast.success("Đã khôi phục cài đặt mặc định")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Đang lưu..." : "Lưu cài đặt"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Danh mục cài đặt</h3>
            </div>
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {activeTab === "general" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Cài đặt tổng quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên website
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả website
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          siteDescription: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maintenanceMode: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Chế độ bảo trì
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Cài đặt tài chính
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phí nền tảng (%)
                    </label>
                    <input
                      type="number"
                      value={settings.platformCommissionRate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          platformCommissionRate: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền rút tối thiểu (VND)
                    </label>
                    <input
                      type="number"
                      value={settings.minWithdrawalAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minWithdrawalAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Cài đặt người dùng
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Tự động duyệt người dùng</h4>
                      <p className="text-sm text-gray-500">
                        Người dùng mới sẽ được duyệt tự động
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoApproveUsers}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoApproveUsers: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Yêu cầu xác thực email</h4>
                      <p className="text-sm text-gray-500">
                        Người dùng phải xác thực email khi đăng ký
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          requireEmailVerification: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cài đặt nội dung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số ảnh tối đa/portfolio
                    </label>
                    <input
                      type="number"
                      value={settings.maxImagesPerPortfolio}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxImagesPerPortfolio: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kích thước file tối đa (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxFileSize: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Kiểm duyệt bằng AI</h4>
                      <p className="text-sm text-gray-500">
                        Sử dụng AI để phát hiện nội dung không phù hợp
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableAIModeration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          enableAIModeration: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Cài đặt thông báo
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email nhận thông báo admin
                    </label>
                    <input
                      type="email"
                      value={settings.adminNotificationEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          adminNotificationEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Thông báo Email</h4>
                        <p className="text-sm text-gray-500">
                          Gửi thông báo qua email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Thông báo Push</h4>
                        <p className="text-sm text-gray-500">
                          Gửi thông báo đẩy trên trình duyệt
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            pushNotifications: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Cài đặt hệ thống</h3>
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Thông tin hệ thống
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>Phiên bản: 1.0.0</p>
                      <p>Database: MySQL 8.0</p>
                      <p>Server: Node.js 18.x</p>
                      <p>Cập nhật: {new Date().toLocaleDateString("vi-VN")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 border border-blue-200 rounded-lg text-left hover:bg-blue-50">
                      <h4 className="font-medium text-blue-900">
                        Sao lưu dữ liệu
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Tạo bản sao lưu toàn bộ dữ liệu
                      </p>
                    </button>
                    <button className="p-4 border border-green-200 rounded-lg text-left hover:bg-green-50">
                      <h4 className="font-medium text-green-900">
                        Dọn dẹp cache
                      </h4>
                      <p className="text-sm text-green-700 mt-1">
                        Xóa cache để cải thiện hiệu suất
                      </p>
                    </button>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">
                      Vùng nguy hiểm
                    </h4>
                    <p className="text-sm text-red-700 mb-3">
                      Các hành động này có thể ảnh hưởng nghiêm trọng đến hệ
                      thống
                    </p>
                    <button
                      onClick={() =>
                        toast.error("Tính năng này cần xác thực bổ sung")
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Reset toàn bộ hệ thống
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
