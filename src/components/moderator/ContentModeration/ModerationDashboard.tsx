// src/components/admin/ContentModeration/ModerationDashboard.tsx

import React, { useState } from "react";
import {
  Shield,
  Image as ImageIcon,
  MessageSquare,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useContentModeration } from "../../../hooks/moderator/ContentModeration.hooks";
import { ContentType } from "../../../types/moderator/ContentModeration.types";
import ContentModeration from "./ContentModeration";
import PhotographerModeration from "./PhotographerModeration";

// Quick Stats Component
const QuickStats: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow-sm border animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Pending Review",
      value: stats.totalPending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Items awaiting moderation",
    },
    {
      title: "Approved Today",
      value: stats.totalApproved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Successfully approved",
    },
    {
      title: "Flagged Content",
      value: stats.flaggedImages || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Content requiring attention",
    },
    {
      title: "Total Processed",
      value: stats.totalApproved + stats.totalRejected,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "All time processed",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

// Category Overview Component
const CategoryOverview: React.FC<{
  stats: any;
  onCategoryClick: (category: ContentType) => void;
}> = ({ stats, onCategoryClick }) => {
  if (!stats) return null;

  const categories = [
    {
      key: "photographers" as ContentType,
      label: "Photographers",
      icon: Users,
      pending: stats.pendingPhotographers || 0,
      total: stats.pendingPhotographers || 0,
      color: "blue",
    },
    {
      key: "venues" as ContentType,
      label: "Venues",
      icon: MapPin,
      pending: stats.pendingVenues || 0,
      total: stats.pendingVenues || 0,
      color: "green",
    },
    {
      key: "events" as ContentType,
      label: "Events",
      icon: Calendar,
      pending: stats.pendingEvents || 0,
      total: stats.pendingEvents || 0,
      color: "purple",
    },
    {
      key: "images" as ContentType,
      label: "Images",
      icon: ImageIcon,
      pending: stats.flaggedImages || 0,
      total: stats.flaggedImages || 0,
      color: "orange",
    },
    {
      key: "reviews" as ContentType,
      label: "Reviews",
      icon: MessageSquare,
      pending: stats.pendingReviews || 0,
      total: stats.pendingReviews || 0,
      color: "red",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        blue: {
          bg: "bg-blue-50",
          text: "text-blue-600",
          border: "border-blue-200",
        },
        green: {
          bg: "bg-green-50",
          text: "text-green-600",
          border: "border-green-200",
        },
        purple: {
          bg: "bg-purple-50",
          text: "text-purple-600",
          border: "border-purple-200",
        },
        orange: {
          bg: "bg-orange-50",
          text: "text-orange-600",
          border: "border-orange-200",
        },
        red: {
          bg: "bg-red-50",
          text: "text-red-600",
          border: "border-red-200",
        },
      };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Content Categories
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <button
              key={category.key}
              onClick={() => onCategoryClick(category.key)}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105`}
            >
              <div className="text-center">
                <category.icon
                  className={`w-8 h-8 ${colors.text} mx-auto mb-2`}
                />
                <h4 className="font-medium text-gray-900 mb-1">
                  {category.label}
                </h4>
                <div className="space-y-1">
                  <p className={`text-xl font-bold ${colors.text}`}>
                    {category.pending}
                  </p>
                  <p className="text-xs text-gray-500">
                    {category.pending > 0 ? "pending review" : "all clear"}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity: React.FC = () => {
  // Mock recent activity data - in real app this would come from an API
  const activities = [
    {
      id: 1,
      type: "photographer_verified",
      message: "John Doe photographer profile verified",
      time: "2 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "image_flagged",
      message: "Image reported for inappropriate content",
      time: "15 minutes ago",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: 3,
      type: "venue_approved",
      message: "Sunset Studio venue approved",
      time: "1 hour ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 4,
      type: "review_moderated",
      message: "Negative review moderated and resolved",
      time: "2 hours ago",
      icon: MessageSquare,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <activity.icon className={`w-5 h-5 ${activity.color} mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
        View all activity →
      </button>
    </div>
  );
};

// Main Dashboard Component
const ModerationDashboard: React.FC = () => {
  const {
    stats,
    activeTab,
    setActiveTab,
    loading,
    apiStatus,
    testAPI,
    refreshData,
  } = useContentModeration();

  const [showDetailedView, setShowDetailedView] = useState(false);

  const handleCategoryClick = (category: ContentType) => {
    setActiveTab(category);
    setShowDetailedView(true);
  };

  const handleBackToDashboard = () => {
    setShowDetailedView(false);
  };

  // If showing detailed view, render the appropriate component
  if (showDetailedView) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Render appropriate detailed component */}
        {activeTab === "photographers" ? (
          <PhotographerModeration />
        ) : (
          <ContentModeration />
        )}
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Moderation Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Monitor and manage platform content and user verifications
            </p>
            {apiStatus && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <strong>API Status:</strong>{" "}
                <span className="text-blue-700">{apiStatus}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={testAPI}
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Test API</span>
            </button>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={stats} />

      {/* Category Overview */}
      <CategoryOverview stats={stats} onCategoryClick={handleCategoryClick} />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => handleCategoryClick("photographers")}
              className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                Review Photographers
              </span>
              {stats?.pendingPhotographers > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingPhotographers}
                </span>
              )}
            </button>

            <button
              onClick={() => handleCategoryClick("images")}
              className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <ImageIcon className="w-5 h-5 text-orange-600 mr-2" />
                Moderate Images
              </span>
              {stats?.flaggedImages > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.flaggedImages}
                </span>
              )}
            </button>

            <button
              onClick={() => handleCategoryClick("venues")}
              className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                Review Venues
              </span>
              {stats?.pendingVenues > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingVenues}
                </span>
              )}
            </button>

            <button
              onClick={() => handleCategoryClick("reviews")}
              className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <span className="flex items-center">
                <MessageSquare className="w-5 h-5 text-purple-600 mr-2" />
                Handle Reviews
              </span>
              {stats?.pendingReviews > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingReviews}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationDashboard;
