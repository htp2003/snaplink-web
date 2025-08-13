// pages/admin/TransactionManagement.tsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Lock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTransactionManagement } from "../../hooks/admin/Transaction.hooks";
import { Transaction } from "../../types/admin/Transaction.types";

const TransactionManagement: React.FC = () => {
  const {
    transactions,
    stats,
    loading,
    filters,
    totalCount,
    totalPages,
    currentPage,
    updateFilters,
    processRefund,
    getTransactionById,
    loadTransactions,
    handlePageChange,
  } = useTransactionManagement();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refundModal, setRefundModal] = useState<{
    show: boolean;
    transaction: Transaction | null;
  }>({
    show: false,
    transaction: null,
  });

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format datetime
  const formatDateTime = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleString("vi-VN");
  };

  // Get transaction type display
  const getTransactionTypeDisplay = (type: string): string => {
    const typeMap: Record<string, string> = {
      EscrowHold: "Ký quỹ",
      EscrowRelease: "Giải phóng ký quỹ",
      WalletTopUp: "Nạp ví",
      WalletTransfer: "Chuyển ví",
      BookingPayment: "Thanh toán đặt chỗ",
      Refund: "Hoàn tiền",
      Withdrawal: "Rút tiền",
      Commission: "Hoa hồng",
      Purchase: "Mua hàng", // New type
    };
    return typeMap[type] || type;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      Pending: { color: "bg-yellow-100 text-yellow-800", text: "Đang xử lý" },
      Completed: { color: "bg-green-100 text-green-800", text: "Thành công" },
      Success: { color: "bg-green-100 text-green-800", text: "Thành công" }, // New status
      Failed: { color: "bg-red-100 text-red-800", text: "Thất bại" },
      Held: { color: "bg-blue-100 text-blue-800", text: "Đang giữ" },
      Released: { color: "bg-green-100 text-green-800", text: "Đã giải phóng" },
      Cancelled: { color: "bg-gray-100 text-gray-800", text: "Đã hủy" },
    };

    const config = statusConfig[status] || statusConfig["Pending"];
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  // Handle refund
  const handleRefund = async (transaction: Transaction) => {
    const success = await processRefund(
      transaction.transactionId,
      "Admin initiated refund"
    );
    if (success) {
      setRefundModal({ show: false, transaction: null });
    }
  };

  // Handle view details
  const handleViewDetails = async (transaction: Transaction) => {
    const fullTransaction = await getTransactionById(transaction.transactionId);
    if (fullTransaction) {
      setSelectedTransaction(fullTransaction);
      setShowDetailModal(true);
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
        <div className="text-sm text-gray-500">
          Hiển thị{" "}
          {Math.min((currentPage - 1) * filters.pageSize + 1, totalCount)} đến{" "}
          {Math.min(currentPage * filters.pageSize, totalCount)} trong tổng số{" "}
          {totalCount} giao dịch
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm rounded-md ${
                page === currentPage
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý giao dịch</h1>
          <p className="text-gray-600">
            Theo dõi và quản lý tất cả giao dịch tài chính
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
          <button
            onClick={() => loadTransactions(currentPage)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Đồng bộ
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Tổng giao dịch
              </p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">Tất cả</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Thành công
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.completed + stats.success}
              </p>
              <p className="text-xs text-gray-500 mt-1">Đã hoàn thành</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Đang xử lý
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-500 mt-1">Chờ xử lý</p>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Đang giữ</p>
              <p className="text-3xl font-bold text-blue-600">{stats.held}</p>
              <p className="text-xs text-gray-500 mt-1">Ký quỹ</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Thất bại</p>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-xs text-gray-500 mt-1">Lỗi xử lý</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Tổng doanh thu
              </p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Doanh thu hôm nay
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.todayRevenue)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Tổng hoàn tiền
              </p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.totalRefunded)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm mã GD, khách hàng..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
          </div>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value as any })}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Completed">Thành công (Completed)</option>
            <option value="Success">Thành công (Success)</option>
            <option value="Pending">Đang xử lý</option>
            <option value="Failed">Thất bại</option>
            <option value="Held">Đang giữ</option>
            <option value="Released">Đã giải phóng</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value as any })}
          >
            <option value="all">Tất cả loại</option>
            <option value="BookingPayment">Thanh toán</option>
            <option value="Purchase">Mua hàng</option>
            <option value="EscrowHold">Ký quỹ</option>
            <option value="WalletTopUp">Nạp ví</option>
            <option value="Refund">Hoàn tiền</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={filters.dateRange}
            onChange={(e) =>
              updateFilters({ dateRange: e.target.value as any })
            }
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
          </select>

          <div className="flex items-center text-gray-500">
            <Filter className="w-5 h-5 mr-2" />
            {transactions.length} kết quả
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Từ/Đến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.transactionId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    #{transaction.transactionId.toString().padStart(4, "0")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {transaction.fromUserName || "System"}
                    </div>
                    {transaction.toUserName && (
                      <div className="text-gray-500">
                        → {transaction.toUserName}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-lg text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getTransactionTypeDisplay(transaction.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleTimeString(
                      "vi-VN"
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(transaction)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {(transaction.status === "Completed" ||
                    transaction.status === "Success") &&
                    (transaction.type === "BookingPayment" ||
                      transaction.type === "Purchase") && (
                      <button
                        onClick={() =>
                          setRefundModal({ show: true, transaction })
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Hoàn tiền"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có giao dịch nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.searchTerm ||
              filters.status !== "all" ||
              filters.type !== "all"
                ? "Thử thay đổi bộ lọc để xem kết quả khác"
                : "Chưa có giao dịch nào được thực hiện"}
            </p>
          </div>
        )}

        {/* Pagination */}
        <PaginationComponent />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">
                Chi tiết giao dịch #{selectedTransaction.transactionId}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Thông tin giao dịch
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">
                        #{selectedTransaction.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(selectedTransaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại:</span>
                      <span className="font-medium">
                        {getTransactionTypeDisplay(selectedTransaction.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiền tệ:</span>
                      <span className="font-medium">
                        {selectedTransaction.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Chi tiết khác
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Từ:</span>
                      <span className="font-medium">
                        {selectedTransaction.fromUserName || "System"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đến:</span>
                      <span className="font-medium">
                        {selectedTransaction.toUserName || "System"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạo lúc:</span>
                      <span className="text-sm">
                        {formatDateTime(selectedTransaction.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cập nhật:</span>
                      <span className="text-sm">
                        {formatDateTime(selectedTransaction.updatedAt)}
                      </span>
                    </div>
                    {selectedTransaction.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phương thức:</span>
                        <span className="font-medium">
                          {selectedTransaction.paymentMethod}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedTransaction.note && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-gray-700">Ghi chú</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedTransaction.note}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              {(selectedTransaction.status === "Completed" ||
                selectedTransaction.status === "Success") &&
                (selectedTransaction.type === "BookingPayment" ||
                  selectedTransaction.type === "Purchase") && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setRefundModal({
                        show: true,
                        transaction: selectedTransaction,
                      });
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Hoàn tiền
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModal.show && refundModal.transaction && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-red-600">
                Xác nhận hoàn tiền
              </h3>
              <button
                onClick={() =>
                  setRefundModal({ show: false, transaction: null })
                }
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn hoàn tiền cho giao dịch này?
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">
                    #{refundModal.transaction.transactionId}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">
                    {refundModal.transaction.fromUserName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(refundModal.transaction.amount)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() =>
                    setRefundModal({ show: false, transaction: null })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleRefund(refundModal.transaction!)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Xác nhận hoàn tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
