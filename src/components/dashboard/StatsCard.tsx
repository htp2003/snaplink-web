// components/dashboard/StatsCard.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    green: "bg-green-500 text-green-600 bg-green-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    orange: "bg-orange-500 text-orange-600 bg-orange-50",
    red: "bg-red-500 text-red-600 bg-red-50",
  };

  const [bgColor, textColor, lightBg] = colorClasses[color].split(" ");

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div
          className={`w-10 h-10 ${lightBg} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${textColor}`} />
        </div>
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>

      {change && (
        <div className="flex items-center">
          <span
            className={`text-sm font-medium ${
              change.type === "increase" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change.type === "increase" ? "+" : "-"}
            {Math.abs(change.value)}%
          </span>
          <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
