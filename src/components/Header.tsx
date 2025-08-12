// components/Header.tsx - UPDATED VERSION
import React from "react";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  title: string;
  userRole: "admin" | "moderator";
}

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  sidebarCollapsed,
  title,
  userRole,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    // Use window.location.href instead of navigate to avoid white screen
    window.location.href = "/login";
  };

  // Color scheme based on role
  const colorScheme = {
    admin: {
      bg: "bg-blue-600",
      text: "text-blue-700",
      bgLight: "bg-blue-100",
      border: "border-blue-200",
    },
    moderator: {
      bg: "bg-green-600",
      text: "text-green-700",
      bgLight: "bg-green-100",
      border: "border-green-200",
    },
  };

  const colors = colorScheme[userRole];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className={`text-lg font-semibold ${colors.text}`}>{title}</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side */}
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome back, {user?.name || "User"}
            </h2>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-3">
              <div
                className={`h-8 w-8 ${colors.bg} rounded-full flex items-center justify-center`}
              >
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || (userRole === "admin" ? "A" : "M")}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name}
                </p>
                <p className={`text-xs ${colors.text} capitalize`}>
                  {user?.role}
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
