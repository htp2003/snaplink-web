import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  MapPin,
  DollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Import mock data (thay thế bằng API call sau)
const mockBookings = [
  {
    id: 1,
    booking_code: "BK001234",
    user_id: 3,
    photographer_id: 4,
    venue_id: 1,
    booking_date: "2025-01-20",
    start_time: "09:00",
    end_time: "11:00",
    duration_hours: 2,
    number_of_people: 2,
    special_requests: "Chụp ảnh cưới vintage style",
    photographer_fee: 1000000,
    venue_fee: 500000,
    total_amount: 1500000,
    status: "confirmed",
    confirmed_at: "2025-01-15T10:30:00Z",
    created_at: "2025-01-15T09:15:00Z",
    user_name: "John Doe",
    user_email: "john.doe@gmail.com",
    user_phone: "0903456789",
    photographer_name: "Trần Minh Phong",
    photographer_phone: "0904567890",
    venue_name: "Dreamy Studio - Quận 1",
    venue_address: "123 Nguyễn Huệ, Quận 1",
  },
  {
    id: 2,
    booking_code: "BK001235",
    user_id: 7,
    photographer_id: 5,
    venue_id: 2,
    booking_date: "2025-01-18",
    start_time: "14:00",
    end_time: "17:00",
    duration_hours: 3,
    number_of_people: 4,
    special_requests: "Chụp ảnh gia đình",
    photographer_fee: 2250000,
    venue_fee: 750000,
    total_amount: 3000000,
    status: "completed",
    confirmed_at: "2025-01-12T08:20:00Z",
    completed_at: "2025-01-18T17:30:00Z",
    created_at: "2025-01-12T08:15:00Z",
    user_name: "Nguyễn Thị Mai",
    user_email: "mai.nguyen@gmail.com",
    user_phone: "0907890123",
    photographer_name: "Lê Thị Hương",
    photographer_phone: "0905678901",
    venue_name: "Garden Paradise - Quận 7",
    venue_address: "456 Nguyễn Văn Linh, Quận 7",
  },
  {
    id: 3,
    booking_code: "BK001236",
    user_id: 8,
    photographer_id: 4,
    venue_id: null,
    booking_date: "2025-01-25",
    start_time: "16:00",
    end_time: "18:00",
    duration_hours: 2,
    number_of_people: 1,
    special_requests: "Chụp portrait cá nhân tại công viên",
    photographer_fee: 1000000,
    venue_fee: 0,
    total_amount: 1000000,
    status: "pending",
    created_at: "2025-01-14T15:30:00Z",
    user_name: "Võ Minh Tuấn",
    user_email: "tuan.vo@gmail.com",
    user_phone: "0908901234",
    photographer_name: "Trần Minh Phong",
    photographer_phone: "0904567890",
    venue_name: "Địa điểm công cộng",
    venue_address: "Công viên Tao Đàn",
  },
  {
    id: 4,
    booking_code: "BK001237",
    user_id: 3,
    photographer_id: 5,
    venue_id: 3,
    booking_date: "2025-01-22",
    start_time: "10:00",
    end_time: "12:00",
    duration_hours: 2,
    number_of_people: 3,
    special_requests: "Chụp ảnh bạn bè tại studio",
    photographer_fee: 1500000,
    venue_fee: 600000,
    total_amount: 2100000,
    status: "in_progress",
    confirmed_at: "2025-01-16T11:00:00Z",
    created_at: "2025-01-16T10:45:00Z",
    user_name: "John Doe",
    user_email: "john.doe@gmail.com",
    user_phone: "0903456789",
    photographer_name: "Lê Thị Hương",
    photographer_phone: "0905678901",
    venue_name: "Urban Studio - Quận 3",
    venue_address: "789 Võ Văn Tần, Quận 3",
  },
  {
    id: 5,
    booking_code: "BK001238",
    user_id: 7,
    photographer_id: 4,
    venue_id: 1,
    booking_date: "2025-01-16",
    start_time: "08:00",
    end_time: "10:00",
    duration_hours: 2,
    number_of_people: 2,
    special_requests: "Chụp ảnh engagement",
    photographer_fee: 1000000,
    venue_fee: 500000,
    total_amount: 1500000,
    status: "cancelled",
    cancelled_by: "user",
    cancellation_reason: "Thay đổi kế hoạch cá nhân",
    cancelled_at: "2025-01-15T20:00:00Z",
    created_at: "2025-01-14T16:20:00Z",
    user_name: "Nguyễn Thị Mai",
    user_email: "mai.nguyen@gmail.com",
    user_phone: "0907890123",
    photographer_name: "Trần Minh Phong",
    photographer_phone: "0904567890",
    venue_name: "Dreamy Studio - Quận 1",
    venue_address: "123 Nguyễn Huệ, Quận 1",
  },
];

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Format datetime
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString("vi-VN");
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Chờ xác nhận",
        icon: Clock,
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        text: "Đã xác nhận",
        icon: CheckCircle,
      },
      in_progress: {
        color: "bg-green-100 text-green-800",
        text: "Đang thực hiện",
        icon: Calendar,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        text: "Hoàn thành",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        text: "Đã hủy",
        icon: XCircle,
      },
      refunded: {
        color: "bg-gray-100 text-gray-800",
        text: "Đã hoàn tiền",
        icon: DollarSign,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    const matchesSearch =
      booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.photographer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const bookingDate = new Date(booking.booking_date);
      const now = new Date();

      switch (dateFilter) {
        case "today":
          matchesDate = bookingDate.toDateString() === now.toDateString();
          break;
        case "tomorrow":
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = bookingDate.toDateString() === tomorrow.toDateString();
          break;
        case "this_week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = bookingDate >= weekStart && bookingDate <= weekEnd;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Handle status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: newStatus,
                confirmed_at:
                  newStatus === "confirmed"
                    ? new Date().toISOString()
                    : booking.confirmed_at,
              }
            : booking
        )
      );

      toast.success(`Cập nhật trạng thái thành công!`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  // Handle view details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  // Statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.total_amount, 0),
  };

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý đặt chỗ</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Xuất báo cáo
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tổng đặt chỗ</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Chờ xác nhận</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Đã xác nhận</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Hoàn thành</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Đã hủy</h3>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Doanh thu</h3>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm mã booking, khách hàng..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          {/* Date Filter */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Tất cả ngày</option>
            <option value="today">Hôm nay</option>
            <option value="tomorrow">Ngày mai</option>
            <option value="this_week">Tuần này</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-gray-500">
            <Filter className="w-5 h-5 mr-2" />
            {filteredBookings.length} kết quả
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhiếp ảnh gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày & Giờ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.booking_code}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.duration_hours}h • {booking.number_of_people}{" "}
                      người
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.user_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.user_phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {booking.photographer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.photographer_phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(booking.booking_date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.start_time} - {booking.end_time}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="font-medium text-gray-900 truncate">
                      {booking.venue_name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {booking.venue_address}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(booking.total_amount)}
                  </div>
                  {booking.venue_fee > 0 && (
                    <div className="text-sm text-gray-500">
                      PG: {formatCurrency(booking.photographer_fee)} • Venue:{" "}
                      {formatCurrency(booking.venue_fee)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "confirmed")
                        }
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Xác nhận"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(booking.id, "cancelled")
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Hủy booking"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {booking.status === "confirmed" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking.id, "in_progress")
                      }
                      className="text-blue-600 hover:text-blue-900"
                      title="Bắt đầu thực hiện"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}

                  {booking.status === "in_progress" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(booking.id, "completed")
                      }
                      className="text-green-600 hover:text-green-900"
                      title="Hoàn thành"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có booking nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                ? "Thử thay đổi bộ lọc để xem kết quả khác"
                : "Chưa có booking nào được tạo"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Chi tiết booking: {selectedBooking.booking_code}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  Thông tin khách hàng
                </h4>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedBooking.user_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-gray-400">📧</span>
                    <span className="text-sm">
                      {selectedBooking.user_email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-gray-400">📱</span>
                    <span className="text-sm">
                      {selectedBooking.user_phone}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold mb-3 text-gray-700">
                  Nhiếp ảnh gia
                </h4>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedBooking.photographer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-gray-400">📱</span>
                    <span className="text-sm">
                      {selectedBooking.photographer_phone}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold mb-3 text-gray-700">Địa điểm</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedBooking.venue_name}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    {selectedBooking.venue_address}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  Chi tiết buổi chụp
                </h4>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày:</span>
                    <span className="font-medium">
                      {formatDate(selectedBooking.booking_date)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {selectedBooking.start_time} - {selectedBooking.end_time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời lượng:</span>
                    <span className="font-medium">
                      {selectedBooking.duration_hours} giờ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số người:</span>
                    <span className="font-medium">
                      {selectedBooking.number_of_people} người
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>

                <h4 className="font-semibold mb-3 text-gray-700">Chi phí</h4>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí nhiếp ảnh gia:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedBooking.photographer_fee)}
                    </span>
                  </div>
                  {selectedBooking.venue_fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí địa điểm:</span>
                      <span className="font-medium">
                        {formatCurrency(selectedBooking.venue_fee)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Tổng cộng:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(selectedBooking.total_amount)}
                    </span>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-700">
                      Yêu cầu đặc biệt
                    </h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                      {selectedBooking.special_requests}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold mb-3 text-gray-700">
                Lịch sử thao tác
              </h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Tạo booking:</span>
                  <span className="ml-auto font-medium">
                    {formatDateTime(selectedBooking.created_at)}
                  </span>
                </div>

                {selectedBooking.confirmed_at && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">Xác nhận:</span>
                    <span className="ml-auto font-medium">
                      {formatDateTime(selectedBooking.confirmed_at)}
                    </span>
                  </div>
                )}

                {selectedBooking.completed_at && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    <span className="text-gray-600">Hoàn thành:</span>
                    <span className="ml-auto font-medium">
                      {formatDateTime(selectedBooking.completed_at)}
                    </span>
                  </div>
                )}

                {selectedBooking.cancelled_at && (
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">
                      Hủy bởi {selectedBooking.cancelled_by}:
                    </span>
                    <span className="ml-auto font-medium">
                      {formatDateTime(selectedBooking.cancelled_at)}
                    </span>
                  </div>
                )}
              </div>

              {selectedBooking.cancellation_reason && (
                <div className="mt-3 p-3 bg-red-50 rounded">
                  <p className="text-sm text-red-700">
                    <strong>Lý do hủy:</strong>{" "}
                    {selectedBooking.cancellation_reason}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 border-t pt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>

              {selectedBooking.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, "confirmed");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Xác nhận booking
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, "cancelled");
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Hủy booking
                  </button>
                </>
              )}

              {selectedBooking.status === "confirmed" && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedBooking.id, "in_progress");
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Bắt đầu thực hiện
                </button>
              )}

              {selectedBooking.status === "in_progress" && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedBooking.id, "completed");
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Hoàn thành
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingManagement;
