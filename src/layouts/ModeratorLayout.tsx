// layouts/ModeratorLayout.tsx - UPDATED: REMOVED DASHBOARD NAVIGATION
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Shield, AlertTriangle } from "lucide-react";

const ModeratorLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // MODERATOR NAVIGATION - CONTENT & REPORTS ONLY (NO DASHBOARD)
  const moderatorNavigation = [
    {
      name: "Content Moderation",
      href: "/moderator/content",
      icon: Shield,
    },
    {
      name: "Report Handling",
      href: "/moderator/reports",
      icon: AlertTriangle,
    },
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
          navigation={moderatorNavigation}
          title="SnapLink Moderator"
          userRole="moderator"
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
              navigation={moderatorNavigation}
              title="SnapLink Moderator"
              userRole="moderator"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={toggleSidebarMobile}
          sidebarCollapsed={sidebarCollapsed}
          title="SnapLink Moderator"
          userRole="moderator"
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

export default ModeratorLayout;
