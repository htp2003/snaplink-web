// pages/admin/BookingManagement.tsx
import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, MapPin, Camera, User } from "lucide-react";
import { mockBookings, type Booking } from "../../mocks/bookings";

const BookingManagement: React.FC = () => {
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    setTimeout(() => {
      setBookingList(mockBookings);
      setLoading(false);
    }, 500);
  }, []);

  // Filter bookings
  const filteredBookings = bookingList.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.photographerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.venueName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: Booking["status"]): string => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: Booking["status"]): string => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (id: number, newStatus: Booking["status"]) => {
    setBookingList((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      )
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Quản lý đặt chỗ</h1>
        <p className="text-gray-600">
          Theo dõi và quản lý tất cả booking trên hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Chờ xác nhận
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {bookingList.filter((b) => b.status === "pending").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Cần xử lý</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
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
                {bookingList.filter((b) => b.status === "confirmed").length}
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
                {bookingList.filter((b) => b.status === "completed").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Thành công</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Đã hủy</p>
              <p className="text-3xl font-bold text-red-600">
                {bookingList.filter((b) => b.status === "cancelled").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Không thành công</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng, nhiếp ảnh gia, địa điểm..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhiếp ảnh gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
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
                    <div className="text-sm font-medium text-gray-900">
                      #{booking.id.toString().padStart(4, "0")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.customerName}
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
                          {booking.photographerName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {booking.venueName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(booking.date).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.time}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Xem
                    </button>

                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "confirmed")
                          }
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(booking.id, "cancelled")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Hủy
                        </button>
                      </>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "completed")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Hoàn thành
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Không tìm thấy booking nào phù hợp"
                : "Chưa có booking nào"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
