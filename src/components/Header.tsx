// components/Header.tsx - PROFESSIONAL VERSION
import React, { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    window.location.href = "/login";
  };

  // Color scheme based on role
  const colorScheme = {
    admin: {
      primary: "blue",
      gradient: "from-blue-600 to-blue-700",
      accent: "bg-blue-500",
      text: "text-blue-600",
      textLight: "text-blue-100",
      bgActive: "bg-blue-50",
      borderActive: "border-blue-500",
      ring: "ring-blue-500",
      shadow: "shadow-blue-500/20",
    },
    moderator: {
      primary: "emerald",
      gradient: "from-emerald-600 to-emerald-700",
      accent: "bg-emerald-500",
      text: "text-emerald-600",
      textLight: "text-emerald-100",
      bgActive: "bg-emerald-50",
      borderActive: "border-emerald-500",
      ring: "ring-emerald-500",
      shadow: "shadow-emerald-500/20",
    },
  };

  const colors = colorScheme[userRole];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg border-b border-gray-100 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2">
            <div
              className={`w-6 h-6 ${colors.accent} rounded-lg flex items-center justify-center shadow-md`}
            >
              <span className="text-white font-bold text-xs">
                {userRole === "admin" ? "A" : "M"}
              </span>
            </div>
            <h1 className={`text-base font-bold ${colors.text}`}>{title}</h1>
          </div>

          {/* Mobile User Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative"
            >
              <div
                className={`w-8 h-8 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0) || (userRole === "admin" ? "A" : "M")}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </button>

            {/* Mobile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </p>
                  <p className={`text-xs ${colors.text} capitalize`}>
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="inline h-4 w-4 mr-2" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-lg border-b border-gray-100 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left side - Welcome message with enhanced typography */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white font-bold text-sm">
                    {userRole === "admin" ? "A" : "M"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Welcome back!
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced controls */}
          <div className="flex items-center space-x-3">
            {/* Enhanced Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search
                  className={`h-4 w-4 transition-colors ${
                    searchFocused ? colors.text : "text-gray-400"
                  }`}
                />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`
                  block w-72 pl-11 pr-4 py-2.5 border rounded-xl leading-5 bg-gray-50 
                  placeholder-gray-400 transition-all duration-200 ease-out
                  focus:outline-none focus:bg-white focus:shadow-lg focus:scale-105
                  ${
                    searchFocused
                      ? `focus:ring-2 focus:${colors.ring} focus:border-transparent`
                      : "border-gray-200 hover:border-gray-300"
                  }
                  text-sm font-medium
                `}
              />
              {/* Search suggestions hint */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                    K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Notifications with badge */}
            <div className="relative">
              <button className="relative p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-105 group">
                <Bell className="h-5 w-5" />
                {/* Enhanced notification badge */}
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-lg">
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                      3
                    </span>
                  </span>
                </span>
              </button>
            </div>

            {/* Settings */}
            <button className="p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-105">
              <Settings className="h-5 w-5" />
            </button>

            {/* Enhanced User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md group"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className={`w-9 h-9 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}
                    >
                      <span className="text-white font-semibold text-sm">
                        {user?.name?.charAt(0) ||
                          (userRole === "admin" ? "A" : "M")}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                      {user?.name || "User"}
                    </p>
                    <p
                      className={`text-xs ${colors.text} capitalize font-medium`}
                    >
                      {user?.role || userRole}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Enhanced Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 overflow-hidden">
                    {/* User info header */}
                    <div
                      className={`px-4 py-4 bg-gradient-to-r ${colors.gradient} relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/10"></div>
                      <div className="relative flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 ${colors.accent} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white font-bold">
                            {user?.name?.charAt(0) ||
                              (userRole === "admin" ? "A" : "M")}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {user?.name}
                          </p>
                          <p
                            className={`text-sm ${colors.textLight} capitalize`}
                          >
                            {user?.role}
                          </p>
                          <p className="text-xs text-white/70">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items - Simplified */}
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-10 lg:hidden"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </>
  );
};

export default Header;
