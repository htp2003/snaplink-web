// layouts/ModeratorLayout.tsx
import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  Users,
  LogOut,
  Menu,
  X,
  BarChart3,
  Eye,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";

const ModeratorLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // MODERATOR NAVIGATION - WITH CONTENT MODERATION
  const navigation = [
    { name: "Dashboard", href: "/moderator", icon: BarChart3 },
    { name: "Content Moderation", href: "/moderator/content", icon: Shield },
    {
      name: "Report Handling",
      href: "/moderator/reports",
      icon: AlertTriangle,
    },
    { name: "User Management", href: "/moderator/users", icon: Users },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleSidebarMobile = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const isCurrentPath = (path: string) => {
    if (path === "/moderator") {
      return location.pathname === "/moderator";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div
          className={`
          bg-white shadow-lg transition-all duration-300 ease-in-out h-full
          ${sidebarCollapsed ? "w-16" : "w-64"}
        `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-green-900">
                SnapLink Moderator
              </h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-8 px-4 space-y-2">
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
                        ? "bg-green-100 text-green-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                  title={sidebarCollapsed ? item.name : ""}
                >
                  <Icon
                    className={`
                    h-5 w-5 transition-colors flex-shrink-0
                    ${
                      current
                        ? "text-green-700"
                        : "text-gray-400 group-hover:text-gray-500"
                    }
                    ${sidebarCollapsed ? "" : "mr-3"}
                  `}
                  />
                  {!sidebarCollapsed && item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div
              className={`flex items-center ${
                sidebarCollapsed ? "justify-center" : "justify-between"
              }`}
            >
              {!sidebarCollapsed && (
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || "M"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
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
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarVisible && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebarMobile}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-green-900">
                SnapLink Moderator
              </h1>
              <button
                onClick={toggleSidebarMobile}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="mt-8 px-4 space-y-2">
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
                          ? "bg-green-100 text-green-700"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }
                    `}
                    onClick={toggleSidebarMobile}
                  >
                    <Icon
                      className={`
                      mr-3 h-5 w-5 transition-colors
                      ${
                        current
                          ? "text-green-700"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    `}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || "M"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
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
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebarMobile}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              SnapLink Moderator
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModeratorLayout;
