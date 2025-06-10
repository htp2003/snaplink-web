// pages/moderator/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  Flag,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import StatsCard from "../../components/dashboard/StatsCard";
import ChartContainer from "../../components/dashboard/ChartContainer";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { mockRecentActivities, type Activity } from "../../mocks/dashboard";

interface ModeratorStats {
  pendingContent: number;
  approvedToday: number;
  rejectedToday: number;
  totalReports: number;
  resolvedReports: number;
  activeUsers: number;
}

const ModeratorDashboard: React.FC = () => {
  const [stats, setStats] = useState<ModeratorStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock moderator-specific stats
  const mockModeratorStats: ModeratorStats = {
    pendingContent: 15,
    approvedToday: 28,
    rejectedToday: 5,
    totalReports: 8,
    resolvedReports: 12,
    activeUsers: 1180,
  };

  // Mock content moderation activity over time
  const mockModerationActivity = [
    { name: "T2", value: 25, approved: 20, rejected: 5 },
    { name: "T3", value: 32, approved: 28, rejected: 4 },
    { name: "T4", value: 28, approved: 22, rejected: 6 },
    { name: "T5", value: 35, approved: 30, rejected: 5 },
    { name: "T6", value: 40, approved: 35, rejected: 5 },
    { name: "T7", value: 33, approved: 28, rejected: 5 },
  ];

  // Mock report handling stats
  const mockReportStats = [
    { name: "T2", value: 15, resolved: 12, pending: 3 },
    { name: "T3", value: 18, resolved: 16, pending: 2 },
    { name: "T4", value: 12, resolved: 10, pending: 2 },
    { name: "T5", value: 20, resolved: 18, pending: 2 },
    { name: "T6", value: 16, resolved: 14, pending: 2 },
    { name: "T7", value: 8, resolved: 6, pending: 2 },
  ];

  // Filter activities relevant to moderators
  const moderatorActivities = mockRecentActivities.filter(
    (activity) =>
      activity.type === "content_upload" || activity.type === "report_created"
  );

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setStats(mockModeratorStats);
      setActivities(moderatorActivities);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Moderator Dashboard
            </h1>
            <p className="text-gray-600">Quản lý nội dung và báo cáo</p>
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
              icon={Shield}
              color="blue"
              loading={true}
            />
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="" data={[]} type="bar" loading={true} />
          <ChartContainer title="" data={[]} type="line" loading={true} />
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
          <h1 className="text-2xl font-bold text-gray-900">
            Moderator Dashboard
          </h1>
          <p className="text-gray-600">Quản lý nội dung và báo cáo</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>

      {/* Primary Stats - Content Moderation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Nội dung chờ duyệt"
          value={stats.pendingContent}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Đã duyệt hôm nay"
          value={stats.approvedToday}
          change={{ value: 15.2, type: "increase" }}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Đã từ chối hôm nay"
          value={stats.rejectedToday}
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title="Báo cáo chờ xử lý"
          value={stats.totalReports}
          icon={Flag}
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Báo cáo đã xử lý"
          value={stats.resolvedReports}
          change={{ value: 8.7, type: "increase" }}
          icon={Shield}
          color="blue"
        />
        <StatsCard
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          change={{ value: 3.2, type: "increase" }}
          icon={UserCheck}
          color="purple"
        />
        <StatsCard
          title="Tỷ lệ duyệt"
          value="84.8%"
          change={{ value: 2.1, type: "increase" }}
          icon={Eye}
          color="green"
        />
        <StatsCard
          title="Thời gian xử lý TB"
          value="2.3h"
          change={{ value: 12.5, type: "decrease" }}
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Hoạt động kiểm duyệt (7 ngày qua)"
          data={mockModerationActivity}
          type="bar"
          color="#10B981"
        />
        <ChartContainer
          title="Xử lý báo cáo (7 ngày qua)"
          data={mockReportStats}
          type="line"
          color="#EF4444"
        />
      </div>

      {/* Priority Tasks Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Nhiệm vụ ưu tiên
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                Nội dung cần duyệt gấp
              </h4>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {stats.pendingContent}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Có {stats.pendingContent} nội dung đã chờ hơn 24h
            </p>
            <button className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium">
              Xem ngay →
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                Báo cáo nghiêm trọng
              </h4>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                3
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Báo cáo về nội dung vi phạm nghiêm trọng
            </p>
            <button className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium">
              Xử lý ngay →
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                Tài khoản cần xem xét
              </h4>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                5
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Tài khoản có hành vi đáng ngờ
            </p>
            <button className="mt-3 text-sm text-orange-600 hover:text-orange-700 font-medium">
              Kiểm tra →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions userRole="moderator" />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tóm tắt hiệu suất tuần này
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-sm text-gray-500">Nội dung đã duyệt</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">23</div>
            <div className="text-sm text-gray-500">Nội dung từ chối</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">45</div>
            <div className="text-sm text-gray-500">Báo cáo đã xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">87.2%</div>
            <div className="text-sm text-gray-500">Tỷ lệ duyệt</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
