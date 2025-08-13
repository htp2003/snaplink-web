// components/Sidebar.tsx - PROFESSIONAL VERSION
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, X, Menu, ChevronRight } from "lucide-react";
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
      gradient: "from-blue-600 to-blue-700",
      accent: "bg-blue-500",
      text: "text-blue-600",
      textLight: "text-blue-100",
      bgActive: "bg-blue-50",
      borderActive: "border-blue-500",
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
      shadow: "shadow-emerald-500/20",
    },
  };

  const colors = colorScheme[userRole];

  return (
    <div
      className={`
        bg-white shadow-2xl transition-all duration-300 ease-out h-full
        relative flex flex-col border-r border-gray-100
        ${collapsed ? "w-16" : "w-72"}
      `}
    >
      {/* Sidebar Header with Gradient */}
      <div
        className={`bg-gradient-to-r ${colors.gradient} relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          <svg
            className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>
        </div>

        <div className="relative flex items-center justify-between h-16 px-4 z-10">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              {/* Logo/Icon */}
              <div
                className={`w-8 h-8 ${colors.accent} rounded-lg flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-sm">
                  {userRole === "admin" ? "A" : "M"}
                </span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">
                  {title.split(" ")[0]}
                </h1>
                <p className={`text-xs ${colors.textLight} opacity-90`}>
                  {title.split(" ").slice(1).join(" ")}
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div
              className={`w-8 h-8 ${colors.accent} rounded-lg flex items-center justify-center shadow-lg mx-auto`}
            >
              <span className="text-white font-bold text-sm">
                {userRole === "admin" ? "A" : "M"}
              </span>
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="mb-6">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              NAVIGATION
            </p>
          )}

          {navigation.map((item, index) => {
            const Icon = item.icon;
            const current = isCurrentPath(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl 
                  transition-all duration-200 ease-out transform hover:scale-[1.02]
                  ${
                    current
                      ? `${colors.bgActive} ${colors.text} shadow-lg ${colors.shadow} border-l-4 ${colors.borderActive}`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md"
                  }
                `}
                title={collapsed ? item.name : ""}
              >
                {/* Active indicator */}
                {current && !collapsed && (
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 ${colors.accent} rounded-r-full`}
                  ></div>
                )}

                <Icon
                  className={`
                    h-5 w-5 transition-all duration-200 flex-shrink-0
                    ${
                      current
                        ? colors.text
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                    ${collapsed ? "" : "mr-4"}
                  `}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {current && (
                      <ChevronRight
                        className={`h-4 w-4 ${colors.text} opacity-60`}
                      />
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Section - Enhanced */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50/50">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          } space-x-3`}
        >
          {!collapsed ? (
            <>
              {/* User Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="relative">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) ||
                        (userRole === "admin" ? "A" : "M")}
                    </span>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p
                    className={`text-xs ${colors.text} capitalize font-medium`}
                  >
                    {user?.role || userRole}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </button>
            </>
          ) : (
            /* Collapsed User Section */
            <div className="relative group">
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                title="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Đăng xuất
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
