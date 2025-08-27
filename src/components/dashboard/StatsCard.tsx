// components/dashboard/StatsCard.tsx
import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "indigo";
  change?: string | { value: number; type: "increase" | "decrease" };
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

  // Format the change value for display
  const formatChange = () => {
    if (!change) return null;
    if (typeof change === "string") return change;
    return `${change.type === "increase" ? "+" : "-"}${change.value}%`;
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
              <span className="text-sm text-gray-500">{formatChange()}</span>
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

export default StatsCard;
