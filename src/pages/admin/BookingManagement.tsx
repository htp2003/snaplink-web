// src/pages/admin/BookingManagement.tsx

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Camera,
  User,
  RefreshCw,
  Filter,
  Search,
  Check,
  X,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Hooks
import {
  useBookingManagement,
  useBookingFilters,
  useBookingStats,
  useBookingActions,
} from "../../hooks/admin/BookingManagement.hooks";

// Types
import {
  BookingData,
  BookingStatus,
} from "../../types/admin/BookingManagement.types";

const BookingManagement: React.FC = () => {
  // Main hooks
  const {
    bookingList,
    loading,
    selectedBookings,
    loadBookings,
    getBookingDetails,
    updateBookingStatus,
    bulkUpdateStatus,
    setSelectedBookings,
  } = useBookingManagement();

  const {
    searchTerm,
    statusFilter,
    dateFilter,
    sortBy,
    sortOrder,
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    filteredAndSortedBookings,
    getCustomerName,
    getPhotographerName,
    getLocationName,
    handleSort,
    clearFilters,
  } = useBookingFilters(bookingList);

  const { stats } = useBookingStats(bookingList);

  const {
    actionLoading,
    handleConfirmBooking,
    handleCancelBooking,
    handleCompleteBooking,
  } = useBookingActions(loadBookings, updateBookingStatus);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Status labels and colors
  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "in_progress":
        return "Đang thực hiện";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <Check className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Event handlers
  const handleViewBooking = async (booking: BookingData) => {
    try {
      const bookingData = await getBookingDetails(booking.id);
      setSelectedBooking(bookingData || booking);
      setShowDetailModal(true);
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết booking");
      setSelectedBooking(booking);
      setShowDetailModal(true);
    }
  };

  const handleSelectBooking = (bookingId: number) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredAndSortedBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredAndSortedBookings.map((b) => b.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý đặt chỗ</h1>
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-blue-600" />
              Booking Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and monitor all bookings in the system
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadBookings}
              disabled={loading}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Chờ xác nhận
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
                <p className="text-xs text-gray-500 mt-1">Cần xử lý</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Đã xác nhận
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.confirmed}
                </p>
                <p className="text-xs text-gray-500 mt-1">Đang thực hiện</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Hoàn thành
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.completed}
                </p>
                <p className="text-xs text-gray-500 mt-1">Thành công</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Đã hủy</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
                <p className="text-xs text-gray-500 mt-1">Không thành công</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, nhiếp ảnh gia, địa điểm..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedBookings.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-600">
              {selectedBookings.length} booking(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => bulkUpdateStatus("confirmed")}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => bulkUpdateStatus("cancelled")}
                disabled={actionLoading}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredAndSortedBookings.length} of {bookingList.length}{" "}
          bookings
        </div>
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedBookings.length ===
                        filteredAndSortedBookings.length &&
                      filteredAndSortedBookings.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("date")}
                >
                  Booking ID & Date
                  {sortBy === "date" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("customer")}
                >
                  Khách hàng
                  {sortBy === "customer" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("photographer")}
                >
                  Nhiếp ảnh gia
                  {sortBy === "photographer" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  Trạng thái
                  {sortBy === "status" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("amount")}
                >
                  Số tiền
                  {sortBy === "amount" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #
                        {booking.bookingCode ||
                          booking.id.toString().padStart(4, "0")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDateTime(booking.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getCustomerName(booking)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customer?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Camera className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getPhotographerName(booking)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.photographer?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {getLocationName(booking)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(booking.startDatetime).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.startDatetime).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        -{" "}
                        {new Date(booking.endDatetime).toLocaleTimeString(
                          "vi-VN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.totalAmount
                        ? formatCurrency(booking.totalAmount)
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Xem
                      </button>

                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 disabled:opacity-50"
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                          >
                            Hủy
                          </button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => handleCompleteBooking(booking.id)}
                          disabled={actionLoading}
                          className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 disabled:opacity-50"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAndSortedBookings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "Không tìm thấy booking nào phù hợp với bộ lọc"
                : "Chưa có booking nào trong hệ thống"}
            </div>
          )}
        </div>
      </div>

      {/* TODO: Add Booking Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Chi tiết Booking</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Booking ID:</h4>
                  <p className="text-gray-600">
                    #{selectedBooking.bookingCode || selectedBooking.id}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Khách hàng:</h4>
                  <p className="text-gray-600">
                    {getCustomerName(selectedBooking)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.customer?.email}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Nhiếp ảnh gia:</h4>
                  <p className="text-gray-600">
                    {getPhotographerName(selectedBooking)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.photographer?.email}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Thời gian:</h4>
                  <p className="text-gray-600">
                    {formatDateTime(selectedBooking.startDatetime)} -{" "}
                    {formatDateTime(selectedBooking.endDatetime)}
                  </p>
                </div>

                {selectedBooking.specialRequests && (
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Yêu cầu đặc biệt:
                    </h4>
                    <p className="text-gray-600">
                      {selectedBooking.specialRequests}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900">Trạng thái:</h4>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {getStatusLabel(selectedBooking.status)}
                  </span>
                </div>

                {selectedBooking.totalAmount && (
                  <div>
                    <h4 className="font-medium text-gray-900">Tổng tiền:</h4>
                    <p className="text-gray-600">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
