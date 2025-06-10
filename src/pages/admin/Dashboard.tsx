// pages/admin/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Users,
  Camera,
  MapPin,
  Calendar,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import StatsCard from "../../components/dashboard/StatsCard";
import ChartContainer from "../../components/dashboard/ChartContainer";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import {
  mockDashboardStats,
  mockBookingsByMonth,
  mockUserGrowth,
  mockRevenueByMonth,
  mockRecentActivities,
  formatCurrency,
  type DashboardStats,
  type Activity,
} from "../../mocks/dashboard";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats(mockDashboardStats);
      setActivities(mockRecentActivities);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hệ thống SnapLink</p>
          </div>
          <div className="text-sm text-gray-500">Đang tải...</div>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <StatsCard
              key={i}
              title=""
              value=""
              icon={Users}
              color="blue"
              loading={true}
            />
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="" data={[]} type="line" loading={true} />
          <ChartContainer title="" data={[]} type="bar" loading={true} />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Không thể tải dữ liệu dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống SnapLink</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          change={{ value: 12.5, type: "increase" }}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Nhiếp ảnh gia"
          value={stats.totalPhotographers}
          change={{ value: 8.2, type: "increase" }}
          icon={Camera}
          color="green"
        />
        <StatsCard
          title="Địa điểm"
          value={stats.totalVenues}
          change={{ value: 5.7, type: "increase" }}
          icon={MapPin}
          color="purple"
        />
        <StatsCard
          title="Booking tháng này"
          value={stats.totalBookings}
          change={{ value: 15.3, type: "increase" }}
          icon={Calendar}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Doanh thu tháng này"
          value={formatCurrency(stats.monthlyRevenue)}
          change={{ value: 22.1, type: "increase" }}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          change={{ value: 3.2, type: "increase" }}
          icon={UserCheck}
          color="blue"
        />
        <StatsCard
          title="Chờ phê duyệt"
          value={stats.pendingApprovals}
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard
          title="Báo cáo mới"
          value={stats.recentReports}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Booking theo tháng"
          data={mockBookingsByMonth}
          type="line"
          color="#3B82F6"
        />
        <ChartContainer
          title="Tăng trưởng người dùng"
          data={mockUserGrowth}
          type="bar"
          color="#10B981"
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 gap-6">
        <ChartContainer
          title="Doanh thu theo tháng (VND)"
          data={mockRevenueByMonth.map((item) => ({
            name: item.name,
            value: item.value / 1000000, // Convert to millions for better display
          }))}
          type="line"
          color="#8B5CF6"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions userRole="admin" />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
