// pages/admin/TransactionManagement.tsx
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "react-hot-toast";
import { mockTransactions, type Transaction } from '../../mocks/transactions';

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refundModal, setRefundModal] = useState<{
    show: boolean;
    transaction: Transaction | null;
  }>({
    show: false,
    transaction: null,
  });

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 500);
  }, []);

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

  // Get payment method badge
  const getPaymentMethodBadge = (method: Transaction['payment_method']) => {
    const methodConfig = {
      vnpay: { color: "bg-blue-100 text-blue-800", text: "VNPay" },
      momo: { color: "bg-pink-100 text-pink-800", text: "MoMo" },
      bank_transfer: { color: "bg-green-100 text-green-800", text: "Chuyển khoản" },
      cash: { color: "bg-gray-100 text-gray-800", text: "Tiền mặt" },
      wallet: { color: "bg-purple-100 text-purple-800", text: "Ví điện tử" },
    };

    const config = methodConfig[method] || methodConfig.vnpay;
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Đang xử lý" },
      completed: { color: "bg-green-100 text-green-800", text: "Thành công" },
      failed: { color: "bg-red-100 text-red-800", text: "Thất bại" },
      refunded: { color: "bg-gray-100 text-gray-800", text: "Đã hoàn tiền" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Get transaction type
  const getTransactionType = (transaction: Transaction): string => {
    if (transaction.type) return transaction.type;
    if (transaction.relatedTo?.includes('Đặt chỗ')) return "booking";
    return "other";
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.id.toString().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

    // Method filter
    const matchesMethod = methodFilter === "all" || transaction.type === methodFilter;

    // Type filter
    const transactionType = getTransactionType(transaction);
    const matchesType = typeFilter === "all" || transactionType === typeFilter;

    // Date filter
    let matchesDate = true;
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.date);
      const now = new Date();

      switch (dateRange) {
        case "today":
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = transactionDate.toDateString() === yesterday.toDateString();
          break;
        case "this_week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          matchesDate = transactionDate >= weekStart;
          break;
        case "this_month":
          matchesDate =
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesType && matchesDate;
  });

  // Handle refund
  const handleRefund = async (transaction: Transaction) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transaction.id
            ? { ...t, status: 'refunded' as const }
            : t
        )
      );

      toast.success("Hoàn tiền thành công!");
      setRefundModal({ show: false, transaction: null });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hoàn tiền");
    }
  };

  // Handle view details
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  // Calculate statistics
  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    refunded: transactions.filter((t) => t.status === "refunded").length,
    totalRevenue: transactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    totalRefunded: transactions
      .filter((t) => t.status === "refunded")
      .reduce((sum, t) => sum + t.amount, 0),
    todayRevenue: transactions
      .filter((t) => {
        const today = new Date().toDateString();
        return (
          t.status === "completed" &&
          new Date(t.date).toDateString() === today
        );
      })
      .reduce((sum, t) => sum + t.amount, 0),
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
          <p className="text-gray-600">Theo dõi và quản lý tất cả giao dịch tài chính</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Đồng bộ
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng giao dịch</p>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Thành công</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500 mt-1">Đã hoàn thành</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Đang xử lý</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500 mt-1">Chờ xử lý</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Đã hoàn tiền</p>
              <p className="text-3xl font-bold text-red-600">{stats.refunded}</p>
              <p className="text-xs text-gray-500 mt-1">Hoàn tiền</p>
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
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Doanh thu hôm nay</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.todayRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng hoàn tiền</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalRefunded)}</p>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Thành công</option>
            <option value="pending">Đang xử lý</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">Tất cả phương thức</option>
            <option value="payment">Thanh toán</option>
            <option value="withdrawal">Rút tiền</option>
            <option value="refund">Hoàn tiền</option>
          </select>

          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
          </select>

          <div className="flex items-center text-gray-500">
            <Filter className="w-5 h-5 mr-2" />
            {filteredTransactions.length} kết quả
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
                Liên quan đến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
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
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    #{transaction.id.toString().padStart(4, '0')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {transaction.relatedTo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {transaction.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-lg text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {transaction.type === 'payment' ? 'Thanh toán' : 
                     transaction.type === 'withdrawal' ? 'Rút tiền' : 'Hoàn tiền'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">
                    {new Date(transaction.date).toLocaleDateString('vi-VN')}
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

                  {transaction.status === "completed" && (
                    <button
                      onClick={() => setRefundModal({ show: true, transaction })}
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

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có giao dịch nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all" || methodFilter !== "all"
                ? "Thử thay đổi bộ lọc để xem kết quả khác"
                : "Chưa có giao dịch nào được thực hiện"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">Chi tiết giao dịch #{selectedTransaction.id}</h3>
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
                  <h4 className="font-semibold mb-3 text-gray-700">Thông tin giao dịch</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">#{selectedTransaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-bold text-lg">{formatCurrency(selectedTransaction.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày:</span>
                      <span className="font-medium">{new Date(selectedTransaction.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Chi tiết khác</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Khách hàng:</span>
                      <span className="font-medium">{selectedTransaction.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Liên quan:</span>
                      <span className="text-sm">{selectedTransaction.relatedTo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại:</span>
                      <span className="font-medium">
                        {selectedTransaction.type === 'payment' ? 'Thanh toán' : 
                         selectedTransaction.type === 'withdrawal' ? 'Rút tiền' : 'Hoàn tiền'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedTransaction.status === "completed" && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setRefundModal({ show: true, transaction: selectedTransaction });
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
              <h3 className="text-lg font-bold text-red-600">Xác nhận hoàn tiền</h3>
              <button
                onClick={() => setRefundModal({ show: false, transaction: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">Bạn có chắc chắn muốn hoàn tiền cho giao dịch này?</p>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">#{refundModal.transaction.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">{refundModal.transaction.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-red-600">{formatCurrency(refundModal.transaction.amount)}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setRefundModal({ show: false, transaction: null })}
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