// src/components/admin/UserManagement/OtherComponents/UserStats.tsx

import React from "react";
import { Users, Shield, UserCheck, Camera, MapPin, User } from "lucide-react";
import { UserStats } from "../../../../types/UserManagement.types";

// Stats Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor,
  bgColor,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    <div className="flex items-center">
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="ml-3">
        <p className="text-xs font-medium text-gray-600">{title}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// User Stats Section Component
interface UserStatsProps {
  roleStats: UserStats;
  totalUsers: number;
}

const UserStatsSection: React.FC<UserStatsProps> = ({
  roleStats,
  totalUsers,
}) => {
  const statsConfig = [
    {
      title: "Total",
      value: totalUsers,
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Admins",
      value: roleStats.admin,
      icon: Shield,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Moderators",
      value: roleStats.moderator,
      icon: UserCheck,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Photographers",
      value: roleStats.photographer,
      icon: Camera,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Venue Owners",
      value: roleStats.venueOwner,
      icon: MapPin,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Regular Users",
      value: roleStats.user,
      icon: User,
      iconColor: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
      {statsConfig.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default UserStatsSection;
