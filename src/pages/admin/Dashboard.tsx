// pages/admin/Dashboard.tsx - SIMPLIFIED VERSION
import React from "react";
import {
  Users,
  Camera,
  MapPin,
  Calendar,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Building,
  Clock,
  RefreshCw,
} from "lucide-react";
import StatsCard from "../../components/dashboard/StatsCard";
import ChartContainer from "../../components/dashboard/ChartContainer";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import {
  useDashboard,
  useTimeRange,
  useDashboardFormatters,
} from "../../hooks/admin/useDashboard";
import { TIME_RANGES } from "../../types/admin/Dashboard.types";

const AdminDashboard: React.FC = () => {
  // Hooks
  const { currentTimeRange, setTimeRange, availableRanges } =
    useTimeRange("30d");
  const { data, loading, error, refetch, filters, setFilters } =
    useDashboard(currentTimeRange);
  const { formatCurrency, formatNumber, formatRelativeTime } =
    useDashboardFormatters();

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range as any);
    setFilters({ timeRange: range as any });
  };

  // Handle manual refresh
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    refetch();
  };

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hệ thống SnapLink</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Đang tải...
          </div>
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hệ thống SnapLink</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>

        <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-medium mb-2">
              Không thể tải dữ liệu dashboard
            </p>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data fallback
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Tổng quan hệ thống SnapLink</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tải lại
          </button>
        </div>

        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có dữ liệu hiển thị</p>
          </div>
        </div>
      </div>
    );
  }

  const { overview, charts, activities, quickActions } = data;

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống SnapLink</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <select
            value={currentTimeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableRanges.map((range) => (
              <option key={range.key} value={range.key}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          {/* Last Updated */}
          <div className="text-sm text-gray-500">
            Cập nhật: {new Date().toLocaleString("vi-VN")}
          </div>
        </div>
      </div>

      {/* Main Stats Cards - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tổng người dùng"
          value={formatNumber(overview.totalUsers)}
          icon={Users}
          color="blue"
          change={overview.totalUsers > 0 ? "+12%" : "0%"}
          trend="up"
        />
        <StatsCard
          title="Nhiếp ảnh gia"
          value={formatNumber(overview.totalPhotographers)}
          icon={Camera}
          color="green"
          change={overview.totalPhotographers > 0 ? "+8%" : "0%"}
          trend="up"
        />
        <StatsCard
          title="Chủ địa điểm"
          value={formatNumber(overview.totalVenueOwners)}
          icon={Building}
          color="purple"
          change={overview.totalVenueOwners > 0 ? "+5%" : "0%"}
          trend="up"
        />
        <StatsCard
          title="Tổng địa điểm"
          value={formatNumber(overview.totalLocations)}
          icon={MapPin}
          color="orange"
          change={overview.totalLocations > 0 ? "+3%" : "0%"}
          trend="up"
        />
      </div>

      {/* Secondary Stats - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Tổng doanh thu"
          value={formatCurrency(overview.totalRevenue)}
          icon={DollarSign}
          color="green"
          change={overview.totalRevenue > 0 ? "+15%" : "0%"}
          trend="up"
        />
        <StatsCard
          title="Tổng booking"
          value={formatNumber(overview.totalBookings)}
          icon={Calendar}
          color="blue"
          change="Chưa có dữ liệu"
          trend="neutral"
        />
        {/* Alert for pending withdrawals only */}
        {overview.pendingWithdrawals > 0 && (
          <StatsCard
            title="Chờ rút tiền"
            value={formatNumber(overview.pendingWithdrawals)}
            icon={Clock}
            color="orange"
            alert={true}
            change="Cần xử lý"
            trend="attention"
          />
        )}
      </div>

      {/* Charts Section - Only Revenue Chart */}
      {charts && (
        <>
          {/* Revenue Chart Only */}
          <div className="grid grid-cols-1 gap-6">
            <ChartContainer
              title="Doanh thu theo thời gian"
              data={charts.revenueChart.map((item) => ({
                name: new Date(item.date).toLocaleDateString("vi-VN"),
                value: item.revenue,
                label: `${formatCurrency(item.revenue)} (${item.transactions
                  } giao dịch)`,
              }))}
              type="line"
              color="#10B981"
              height={300}
            />
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Photographers */}
            {charts.topPhotographers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Nhiếp ảnh gia
                  </h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-4">
                  {charts.topPhotographers
                    .slice(0, 5)
                    .map((photographer, index) => (
                      <div
                        key={photographer.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {photographer.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {photographer.totalBookings} booking • ⭐{" "}
                              {photographer.averageRating.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {formatCurrency(photographer.totalEarnings)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Top Locations */}
            {charts.topLocations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Địa điểm
                  </h3>
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-4">
                  {charts.topLocations.slice(0, 5).map((location, index) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {location.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {location.totalBookings} booking • ⭐{" "}
                            {location.averageRating.toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {formatCurrency(location.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Methods Distribution */}
          {charts.paymentMethodsDistribution.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Phân bố phương thức thanh toán
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {charts.paymentMethodsDistribution.map((method) => (
                  <div
                    key={method.method}
                    className="text-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-gray-900">
                      {method.count}
                    </div>
                    <div className="text-sm text-gray-500 capitalize mb-1">
                      {method.method === "unknown" ? "Khác" : method.method}
                    </div>
                    <div className="text-xs text-gray-400">
                      {method.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      {formatCurrency(method.totalAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Bottom Section - Activities & Quick Actions (Simplified) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hoạt động gần đây
            </h3>

            <div className="space-y-4">
              {/* Recent Users */}
              {activities.recentUsers.slice(0, 3).map((user) => (
                <div
                  key={`user-${user.id}`}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Người dùng mới • {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatRelativeTime(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Recent Transactions */}
              {activities.recentTransactions.slice(0, 3).map((transaction) => (
                <div
                  key={`transaction-${transaction.id}`}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.userName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.description || "Giao dịch"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatRelativeTime(transaction.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {activities.recentUsers.length === 0 &&
              activities.recentTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có hoạt động gần đây</p>
                </div>
              )}
          </div>
        </div>

        {/* Quick Actions - Simplified */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thao tác nhanh
            </h3>

            <div className="space-y-3">
              {/* Only show withdrawal management if there are pending withdrawals */}
              {quickActions.pendingWithdrawals.length > 0 && (
                <button className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">
                      Quản lý rút tiền
                    </p>
                    <p className="text-sm text-orange-700">
                      {quickActions.pendingWithdrawals.length} yêu cầu chờ xử lý
                    </p>
                  </div>
                </button>
              )}

              {/* Basic management actions */}
              <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    Quản lý người dùng
                  </p>
                  <p className="text-sm text-blue-700">
                    Xem và quản lý tài khoản
                  </p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Quản lý giao dịch
                  </p>
                  <p className="text-sm text-green-700">
                    Xem lịch sử giao dịch
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;