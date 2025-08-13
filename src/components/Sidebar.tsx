// components/Sidebar.tsx - FIXED VERSION
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, X, Menu } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle: () => void;
  navigation: NavigationItem[];
  title: string;
  userRole: "admin" | "moderator";
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggle,
  navigation,
  title,
  userRole,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    // Use window.location.href instead of navigate to avoid white screen
    window.location.href = "/login";
  };

  const isCurrentPath = (path: string) => {
    // Handle index routes
    if (path === "/admin" && userRole === "admin") {
      return location.pathname === "/admin";
    }
    if (path === "/moderator" && userRole === "moderator") {
      return location.pathname === "/moderator";
    }
    return location.pathname.startsWith(path);
  };

  // Color scheme based on role
  const colorScheme = {
    admin: {
      primary: "blue",
      bg: "bg-blue-600",
      text: "text-blue-700",
      bgLight: "bg-blue-100",
      bgHover: "hover:bg-blue-700",
    },
    moderator: {
      primary: "green",
      bg: "bg-green-600",
      text: "text-green-700",
      bgLight: "bg-green-100",
      bgHover: "hover:bg-green-700",
    },
  };

  const colors = colorScheme[userRole];

  return (
    <div
      className={`
        bg-white shadow-lg transition-all duration-300 ease-in-out h-full
        relative flex flex-col
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
        {!collapsed && (
          <h1 className={`text-xl font-bold ${colors.text}`}>{title}</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation - Takes up remaining space */}
      <nav className="flex-1 mt-8 px-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const current = isCurrentPath(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${
                  current
                    ? `${colors.bgLight} ${colors.text}`
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }
              `}
              title={collapsed ? item.name : ""}
            >
              <Icon
                className={`
                h-5 w-5 transition-colors flex-shrink-0
                ${
                  current
                    ? colors.text
                    : "text-gray-400 group-hover:text-gray-500"
                }
                ${collapsed ? "" : "mr-3"}
              `}
              />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info and logout - Fixed at bottom of sidebar only */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center">
              <div
                className={`h-8 w-8 ${colors.bg} rounded-full flex items-center justify-center`}
              >
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || (userRole === "admin" ? "A" : "M")}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
