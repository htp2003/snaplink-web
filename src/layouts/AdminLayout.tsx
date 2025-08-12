// layouts/AdminLayout.tsx - FIXED VERSION
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Users, Calendar, CreditCard, Settings, BarChart3 } from "lucide-react";

const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // ADMIN NAVIGATION - NO CONTENT MODERATION
  const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Booking Management", href: "/admin/bookings", icon: Calendar },
    {
      name: "Transaction Management",
      href: "/admin/transactions",
      icon: CreditCard,
    },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleSidebarMobile = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          navigation={adminNavigation}
          title="SnapLink Admin"
          userRole="admin"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarVisible && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleSidebarMobile}
          />
          <div className="fixed left-0 top-0 h-full">
            <Sidebar
              onToggle={toggleSidebarMobile}
              navigation={adminNavigation}
              title="SnapLink Admin"
              userRole="admin"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={toggleSidebarMobile}
          sidebarCollapsed={sidebarCollapsed}
          title="SnapLink Admin"
          userRole="admin"
        />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
