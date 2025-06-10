import { useState, useEffect } from "react";
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

// Mock transactions data
const mockTransactions = [
  {
    id: 1,
    booking_id: 1,
    payer_id: 3,
    recipient_id: 4,
    amount: 1500000,
    payment_method: "vnpay",
    transaction_id: "VNP123456789",
    status: "completed",
    paid_at: "2025-01-15T10:35:00Z",
    created_at: "2025-01-15T10:30:00Z",
    payer_name: "John Doe",
    payer_email: "john.doe@gmail.com",
    recipient_name: "Trần Minh Phong",
    recipient_email: "photographer1@gmail.com",
    booking_code: "BK001234",
    description: "Thanh toán chụp ảnh cưới vintage",
  },
  {
    id: 2,
    booking_id: 2,
    payer_id: 7,
    recipient_id: 5,
    amount: 3000000,
    payment_method: "momo",
    transaction_id: "MOMO987654321",
    status: "completed",
    paid_at: "2025-01-12T08:25:00Z",
    created_at: "2025-01-12T08:20:00Z",
    payer_name: "Nguyễn Thị Mai",
    payer_email: "mai.nguyen@gmail.com",
    recipient_name: "Lê Thị Hương",
    recipient_email: "photographer2@gmail.com",
    booking_code: "BK001235",
    description: "Thanh toán chụp ảnh gia đình",
  },
  {
    id: 3,
    booking_id: 4,
    payer_id: 3,
    recipient_id: 5,
    amount: 2100000,
    payment_method: "bank_transfer",
    transaction_id: "BANK456789123",
    status: "pending",
    created_at: "2025-01-16T11:05:00Z",
    payer_name: "John Doe",
    payer_email: "john.doe@gmail.com",
    recipient_name: "Lê Thị Hương",
    recipient_email: "photographer2@gmail.com",
    booking_code: "BK001237",
    description: "Thanh toán chụp ảnh bạn bè tại studio",
  },
  {
    id: 4,
    booking_id: 5,
    payer_id: 7,
    recipient_id: 4,
    amount: 1500000,
    payment_method: "vnpay",
    transaction_id: "VNP789123456",
    status: "refunded",
    paid_at: "2025-01-14T16:25:00Z",
    refunded_at: "2025-01-15T20:30:00Z",
    refund_reason: "Booking cancelled by user",
    created_at: "2025-01-14T16:20:00Z",
    payer_name: "Nguyễn Thị Mai",
    payer_email: "mai.nguyen@gmail.com",
    recipient_name: "Trần Minh Phong",
    recipient_email: "photographer1@gmail.com",
    booking_code: "BK001238",
    description: "Thanh toán chụp ảnh engagement (đã hoàn tiền)",
  },
  {
    id: 5,
    booking_id: null,
    payer_id: 4,
    recipient_id: null,
    amount: 500000,
    payment_method: "bank_transfer",
    transaction_id: "WITHDRAW123456",
    status: "completed",
    paid_at: "2025-01-10T14:00:00Z",
    created_at: "2025-01-10T13:55:00Z",
    payer_name: "Trần Minh Phong",
    payer_email: "photographer1@gmail.com",
    recipient_name: "System Withdrawal",
    recipient_email: "system@snaplink.com",
    booking_code: null,
    description: "Rút tiền về tài khoản ngân hàng",
    type: "withdrawal",
  },
  {
    id: 6,
    booking_id: null,
    payer_id: 5,
    recipient_id: null,
    amount: 100000,
    payment_method: "vnpay",
    transaction_id: "VNP_PREMIUM_123",
    status: "completed",
    paid_at: "2025-01-08T09:15:00Z",
    created_at: "2025-01-08T09:10:00Z",
    payer_name: "Lê Thị Hương",
    payer_email: "photographer2@gmail.com",
    recipient_name: "SnapLink Platform",
    recipient_email: "billing@snaplink.com",
    booking_code: null,
    description: "Nâng cấp gói Premium - 1 tháng",
    type: "subscription",
  },
  {
    id: 7,
    booking_id: null,
    payer_id: 6,
    recipient_id: null,
    amount: 50000,
    payment_method: "momo",
    transaction_id: "MOMO_BOOST_789",
    status: "completed",
    paid_at: "2025-01-05T16:30:00Z",
    created_at: "2025-01-05T16:25:00Z",
    payer_name: "Phạm Văn Dương",
    payer_email: "venueowner@gmail.com",
    recipient_name: "SnapLink Platform",
    recipient_email: "billing@snaplink.com",
    booking_code: null,
    description: "Boost venue listing - 1 tuần",
    type: "promotion",
  },
];

function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refundModal, setRefundModal] = useState({
    show: false,
    transaction: null,
  });

  // Load data
  useEffect(() => {
    setTimeout(() => {
      setTransactions(mockTransactions);
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

  // Format datetime
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString("vi-VN");
  };

  // Get payment method badge
  const getPaymentMethodBadge = (method) => {
    const methodConfig = {
      vnpay: { color: "bg-blue-100 text-blue-800", text: "VNPay" },
      momo: { color: "bg-pink-100 text-pink-800", text: "MoMo" },
      bank_transfer: {
        color: "bg-green-100 text-green-800",
        text: "Chuyển khoản",
      },
      cash: { color: "bg-gray-100 text-gray-800", text: "Tiền mặt" },
      wallet: { color: "bg-purple-100 text-purple-800", text: "Ví điện tử" },
    };

    const config = methodConfig[method] || methodConfig.vnpay;
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Đang xử lý" },
      completed: { color: "bg-green-100 text-green-800", text: "Thành công" },
      failed: { color: "bg-red-100 text-red-800", text: "Thất bại" },
      refunded: { color: "bg-gray-100 text-gray-800", text: "Đã hoàn tiền" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Đã hủy" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  // Get transaction type
  const getTransactionType = (transaction) => {
    if (transaction.type) return transaction.type;
    if (transaction.booking_id) return "booking";
    return "other";
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.transaction_id
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.payer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.booking_code &&
        transaction.booking_code
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    // Method filter
    const matchesMethod =
      methodFilter === "all" || transaction.payment_method === methodFilter;

    // Type filter
    const transactionType = getTransactionType(transaction);
    const matchesType = typeFilter === "all" || transactionType === typeFilter;

    // Date filter
    let matchesDate = true;
    if (dateRange !== "all") {
      const transactionDate = new Date(transaction.created_at);
      const now = new Date();

      switch (dateRange) {
        case "today":
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate =
            transactionDate.toDateString() === yesterday.toDateString();
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

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMethod &&
      matchesType &&
      matchesDate
    );
  });

  // Handle refund
  const handleRefund = async (transaction) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transaction.id
            ? {
                ...t,
                status: "refunded",
                refunded_at: new Date().toISOString(),
                refund_reason: "Admin refund",
              }
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
  const handleViewDetails = (transaction) => {
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
      .filter((t) => t.status === "completed" && t.booking_id)
      .reduce((sum, t) => sum + t.amount, 0),
    totalRefunded: transactions
      .filter((t) => t.status === "refunded")
      .reduce((sum, t) => sum + t.amount, 0),
    todayRevenue: transactions
      .filter((t) => {
        const today = new Date().toDateString();
        return (
          t.status === "completed" &&
          new Date(t.created_at).toDateString() === today &&
          t.booking_id
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý giao dịch</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Tổng giao dịch
              </h3>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Thành công</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <RefreshCw className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Đang xử lý</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Hoàn tiền</h3>
              <p className="text-2xl font-bold text-red-600">
                {stats.refunded}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Tổng doanh thu
              </h3>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">DT hôm nay</h3>
              <p className="text-lg font-bold text-blue-600">
                {formatCurrency(stats.todayRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <TrendingDown className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Đã hoàn tiền
              </h3>
              <p className="text-lg font-bold text-gray-600">
                {formatCurrency(stats.totalRefunded)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm mã GD, tên người dùng..."
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
            <option value="completed">Thành công</option>
            <option value="pending">Đang xử lý</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>

          {/* Method Filter */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">Tất cả phương thức</option>
            <option value="vnpay">VNPay</option>
            <option value="momo">MoMo</option>
            <option value="bank_transfer">Chuyển khoản</option>
            <option value="cash">Tiền mặt</option>
          </select>

          {/* Type Filter */}
          <select
            className="border border-gray-300 rounded-md px-3 py-2"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            <option value="booking">Đặt chỗ</option>
            <option value="withdrawal">Rút tiền</option>
            <option value="subscription">Đăng ký</option>
            <option value="promotion">Quảng cáo</option>
          </select>

          {/* Date Filter */}
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

          {/* Results count */}
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
                Mã giao dịch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người gửi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người nhận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian
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
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.transaction_id}
                    </div>
                    {transaction.booking_code && (
                      <div className="text-sm text-gray-500">
                        Booking: {transaction.booking_code}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.payer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.payer_email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.recipient_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.recipient_email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-bold text-lg text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPaymentMethodBadge(transaction.payment_method)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium">
                      {formatDateTime(transaction.created_at)}
                    </div>
                    {transaction.paid_at &&
                      transaction.status === "completed" && (
                        <div className="text-xs text-gray-500">
                          Hoàn thành: {formatDateTime(transaction.paid_at)}
                        </div>
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

                  {transaction.status === "completed" &&
                    transaction.booking_id && (
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

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có giao dịch nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ||
              statusFilter !== "all" ||
              methodFilter !== "all" ||
              typeFilter !== "all"
                ? "Thử thay đổi bộ lọc để xem kết quả khác"
                : "Chưa có giao dịch nào được thực hiện"}
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Chi tiết giao dịch: {selectedTransaction.transaction_id}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  Thông tin giao dịch
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">
                      {selectedTransaction.transaction_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(selectedTransaction.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    {getPaymentMethodBadge(selectedTransaction.payment_method)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                  {selectedTransaction.booking_code && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking:</span>
                      <span className="font-medium">
                        {selectedTransaction.booking_code}
                      </span>
                    </div>
                  )}
                </div>

                <h4 className="font-semibold mb-3 mt-6 text-gray-700">
                  Người gửi
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên:</span>
                    <span className="font-medium">
                      {selectedTransaction.payer_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-sm">
                      {selectedTransaction.payer_email}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold mb-3 mt-6 text-gray-700">
                  Người nhận
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên:</span>
                    <span className="font-medium">
                      {selectedTransaction.recipient_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-sm">
                      {selectedTransaction.recipient_email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Thời gian</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạo lúc:</span>
                    <span className="font-medium">
                      {formatDateTime(selectedTransaction.created_at)}
                    </span>
                  </div>
                  {selectedTransaction.paid_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thanh toán:</span>
                      <span className="font-medium">
                        {formatDateTime(selectedTransaction.paid_at)}
                      </span>
                    </div>
                  )}
                  {selectedTransaction.refunded_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hoàn tiền:</span>
                      <span className="font-medium">
                        {formatDateTime(selectedTransaction.refunded_at)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedTransaction.description && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-gray-700">Mô tả</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                      {selectedTransaction.description}
                    </p>
                  </div>
                )}

                {selectedTransaction.refund_reason && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-gray-700">
                      Lý do hoàn tiền
                    </h4>
                    <p className="text-red-600 text-sm bg-red-50 p-3 rounded">
                      {selectedTransaction.refund_reason}
                    </p>
                  </div>
                )}

                {/* Transaction Type */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-gray-700">
                    Loại giao dịch
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      getTransactionType(selectedTransaction) === "booking"
                        ? "bg-blue-100 text-blue-800"
                        : getTransactionType(selectedTransaction) ===
                          "withdrawal"
                        ? "bg-green-100 text-green-800"
                        : getTransactionType(selectedTransaction) ===
                          "subscription"
                        ? "bg-purple-100 text-purple-800"
                        : getTransactionType(selectedTransaction) ===
                          "promotion"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getTransactionType(selectedTransaction) === "booking"
                      ? "Thanh toán đặt chỗ"
                      : getTransactionType(selectedTransaction) === "withdrawal"
                      ? "Rút tiền"
                      : getTransactionType(selectedTransaction) ===
                        "subscription"
                      ? "Đăng ký dịch vụ"
                      : getTransactionType(selectedTransaction) === "promotion"
                      ? "Quảng cáo"
                      : "Khác"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 border-t pt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>

              {selectedTransaction.status === "completed" &&
                selectedTransaction.booking_id && (
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
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

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn hoàn tiền cho giao dịch này?
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">
                    {refundModal.transaction.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">
                    {refundModal.transaction.payer_name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-red-600">
                    {formatCurrency(refundModal.transaction.amount)}
                  </span>
                </div>
                {refundModal.transaction.booking_code && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking:</span>
                    <span className="font-medium">
                      {refundModal.transaction.booking_code}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Lý do hoàn tiền:
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Nhập lý do hoàn tiền..."
                />
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
                onClick={() => handleRefund(refundModal.transaction)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Xác nhận hoàn tiền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionManagement;
