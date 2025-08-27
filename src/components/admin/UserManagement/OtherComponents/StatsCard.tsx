// components/dashboard/StatsCard.tsx
import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "indigo";
  change?: string;
  trend?: "up" | "down" | "neutral" | "attention";
  alert?: boolean;
  loading?: boolean;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  yellow: "bg-yellow-50 text-yellow-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  trend = "neutral",
  alert = false,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "attention":
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 ${
        alert ? "border-orange-200 bg-orange-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-sm text-gray-500">{change}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// components/dashboard/ChartContainer.tsx
import React from "react";

interface ChartData {
  name: string;
  value: number;
  label?: string;
}

interface ChartContainerProps {
  title: string;
  data: ChartData[];
  type: "line" | "bar" | "pie";
  color?: string;
  height?: number;
  loading?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  data,
  type,
  color = "#3B82F6",
  height = 250,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊</div>
            <p>Chưa có dữ liệu</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2" style={{ height }}>
          {type === "bar" && (
            <div className="flex items-end justify-between h-full space-x-1">
              {data.slice(-10).map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${(item.value / maxValue) * 80}%`,
                      backgroundColor: color,
                      minHeight: item.value > 0 ? "4px" : "0px",
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {item.name.split("/").slice(-2).join("/")}
                  </div>
                </div>
              ))}
            </div>
          )}

          {type === "line" && (
            <div className="relative h-full">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {data.length > 1 && (
                  <polyline
                    points={data
                      .slice(-10)
                      .map(
                        (item, index) =>
                          `${
                            (index / (data.slice(-10).length - 1)) * 380 + 10
                          },${190 - (item.value / maxValue) * 170}`
                      )
                      .join(" ")}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
                {data.slice(-10).map((item, index) => (
                  <circle
                    key={index}
                    cx={(index / (data.slice(-10).length - 1)) * 380 + 10}
                    cy={190 - (item.value / maxValue) * 170}
                    r="4"
                    fill={color}
                  />
                ))}
              </svg>
              <div className="flex justify-between mt-2">
                {data.slice(-10).map((item, index) => (
                  <span key={index} className="text-xs text-gray-500">
                    {item.name.split("/").slice(-2).join("/")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Tổng:{" "}
          {data
            .reduce((sum, item) => sum + item.value, 0)
            .toLocaleString("vi-VN")}
        </div>
      )}
    </div>
  );
};

// components/dashboard/QuickActions.tsx
import React from "react";
import { AlertTriangle, Clock, FileX, Eye } from "lucide-react";

interface QuickActionsProps {
  userRole: string;
  pendingWithdrawals: number;
  pendingVerifications: number;
  reportedContent: number;
  withdrawalsList?: any[];
  verificationsList?: any[];
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userRole,
  pendingWithdrawals,
  pendingVerifications,
  reportedContent,
  withdrawalsList = [],
  verificationsList = [],
}) => {
  const actions = [
    {
      title: "Yêu cầu rút tiền",
      count: pendingWithdrawals,
      icon: Clock,
      color: "orange",
      href: "/admin/withdrawals?status=pending",
      urgent: pendingWithdrawals > 5,
    },
    {
      title: "Chờ xác thực",
      count: pendingVerifications,
      icon: AlertTriangle,
      color: "red",
      href: "/admin/verifications?status=pending",
      urgent: pendingVerifications > 3,
    },
    {
      title: "Nội dung báo cáo",
      count: reportedContent,
      icon: FileX,
      color: "purple",
      href: "/admin/reports?status=pending",
      urgent: reportedContent > 0,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cần xử lý</h3>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
              action.urgent
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <action.icon
                  className={`w-5 h-5 ${
                    action.urgent ? "text-red-600" : "text-gray-600"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">
                    {action.count} mục cần xử lý
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  action.urgent
                    ? "bg-red-100 text-red-800"
                    : action.count > 0
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {action.count}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Withdrawals Preview */}
      {withdrawalsList.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Rút tiền gần đây
          </h4>
          <div className="space-y-2">
            {withdrawalsList.slice(0, 3).map((withdrawal, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 truncate">
                  {withdrawal.userName}
                </span>
                <span className="font-medium text-red-600">
                  -{withdrawal.amount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Verifications Preview */}
      {verificationsList.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Xác thực gần đây
          </h4>
          <div className="space-y-2">
            {verificationsList.slice(0, 3).map((verification, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 truncate">
                  {verification.userName}
                </span>
                <span className="text-xs text-orange-600 capitalize">
                  {verification.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// components/dashboard/RecentActivity.tsx
import React from "react";

interface Activity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Hoạt động gần đây
      </h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Chưa có hoạt động nào
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {activity.user?.avatar ? (
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <span className="text-xs text-gray-600">
                    {activity.user?.name?.charAt(0) || "?"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { StatsCard, ChartContainer, QuickActions, RecentActivity };
