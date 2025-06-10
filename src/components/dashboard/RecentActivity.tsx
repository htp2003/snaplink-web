import React from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { User, Image, Calendar, AlertTriangle } from "lucide-react";

interface Activity {
  id: string;
  type:
    | "user_register"
    | "content_upload"
    | "booking_created"
    | "report_created";
  title: string;
  description: string;
  user: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
}) => {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "user_register":
        return <User className="w-4 h-4 text-green-600" />;
      case "content_upload":
        return <Image className="w-4 h-4 text-blue-600" />;
      case "booking_created":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case "report_created":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "user_register":
        return "bg-green-50 border-green-200";
      case "content_upload":
        return "bg-blue-50 border-blue-200";
      case "booking_created":
        return "bg-purple-50 border-purple-200";
      case "report_created":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Hoạt động gần đây
      </h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getActivityColor(
                activity.type
              )}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.timestamp, {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">bởi {activity.user}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        Xem tất cả hoạt động
      </button>
    </div>
  );
};
export default RecentActivity;
