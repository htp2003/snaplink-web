// components/common/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  Users,
  Image,
  Calendar,
  CreditCard,
  Settings,
  Shield,
  Flag,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  roles: ("admin" | "moderator")[];
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      path: "/admin",
      icon: <BarChart className="w-5 h-5" />,
      label: "Dashboard",
      roles: ["admin"],
    },
    {
      path: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      label: "Quản lý người dùng",
      roles: ["admin"],
    },
    {
      path: "/admin/content",
      icon: <Image className="w-5 h-5" />,
      label: "Kiểm duyệt nội dung",
      badge: 5,
      roles: ["admin"],
    },
    {
      path: "/admin/bookings",
      icon: <Calendar className="w-5 h-5" />,
      label: "Quản lý đặt chỗ",
      roles: ["admin"],
    },
    {
      path: "/admin/transactions",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Quản lý giao dịch",
      roles: ["admin"],
    },
    {
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
      label: "Cài đặt hệ thống",
      roles: ["admin"],
    },
    // Moderator menu items
    {
      path: "/moderator",
      icon: <Shield className="w-5 h-5" />,
      label: "Dashboard",
      roles: ["moderator"],
    },
    {
      path: "/moderator/content",
      icon: <Image className="w-5 h-5" />,
      label: "Kiểm duyệt nội dung",
      badge: 3,
      roles: ["moderator"],
    },
    {
      path: "/moderator/reports",
      icon: <Flag className="w-5 h-5" />,
      label: "Xử lý báo cáo",
      badge: 8,
      roles: ["moderator"],
    },
    {
      path: "/moderator/users",
      icon: <UserCheck className="w-5 h-5" />,
      label: "Quản lý người dùng",
      roles: ["moderator"],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  const isActive = (path: string) => {
    if (path === "/admin" || path === "/moderator") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`
      bg-gray-900 text-white h-screen flex flex-col transition-all duration-300 relative
      ${collapsed ? "w-16" : "w-64"}
    `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SnapLink
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {user?.role === "admin" ? "Admin Panel" : "Moderator Panel"}
              </p>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors hidden lg:block"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }
            `}
          >
            <span
              className={`
              flex-shrink-0 transition-transform duration-200
              ${isActive(item.path) ? "scale-110" : "group-hover:scale-110"}
            `}
            >
              {item.icon}
            </span>

            {!collapsed && (
              <>
                <span className="font-medium truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </>
            )}

            {collapsed && item.badge && (
              <span className="absolute left-8 top-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {item.badge > 9 ? "9+" : item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  Người dùng online
                </p>
                <p className="text-blue-200 text-xs">1,234 đang hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip for collapsed items */}
      {collapsed && (
        <style>
          {`
            .group:hover .tooltip {
              opacity: 1;
              visibility: visible;
            }
          `}
        </style>
      )}
    </div>
  );
};

export default Sidebar;
