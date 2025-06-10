import React from "react";
import { Plus, Eye, Flag, Settings, LucideIcon } from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
  badge?: number;
}

interface QuickActionsProps {
  userRole: "admin" | "moderator";
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole }) => {
  const adminActions: QuickAction[] = [
    {
      id: "add-user",
      title: "Thêm người dùng",
      description: "Tạo tài khoản mới",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => console.log("Add user"),
    },
    {
      id: "review-content",
      title: "Kiểm duyệt nội dung",
      description: "Xem nội dung chờ duyệt",
      icon: Eye,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log("Review content"),
      badge: 5,
    },
    {
      id: "handle-reports",
      title: "Xử lý báo cáo",
      description: "Xem báo cáo vi phạm",
      icon: Flag,
      color: "bg-red-500 hover:bg-red-600",
      onClick: () => console.log("Handle reports"),
      badge: 8,
    },
    {
      id: "system-settings",
      title: "Cài đặt hệ thống",
      description: "Cấu hình platform",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
      onClick: () => console.log("System settings"),
    },
  ];

  const moderatorActions: QuickAction[] = [
    {
      id: "review-content",
      title: "Kiểm duyệt nội dung",
      description: "Xem nội dung chờ duyệt",
      icon: Eye,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => console.log("Review content"),
      badge: 3,
    },
    {
      id: "handle-reports",
      title: "Xử lý báo cáo",
      description: "Xem báo cáo vi phạm",
      icon: Flag,
      color: "bg-red-500 hover:bg-red-600",
      onClick: () => console.log("Handle reports"),
      badge: 8,
    },
  ];

  const actions = userRole === "admin" ? adminActions : moderatorActions;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thao tác nhanh
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-colors text-left relative group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
              <div className="ml-3">
                <action.icon className="w-5 h-5" />
                {action.badge && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                    {action.badge}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
