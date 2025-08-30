// pages/admin/TransactionManagement.tsx - PART 1: Imports & Setup
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
  Check,
  X,
  AlertCircle,
  Wallet,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTransactionManagement } from "../../hooks/admin/Transaction.hooks";
import { useWithdrawalManagement } from "../../hooks/admin/Withdrawal.hooks";
import { Transaction } from "../../types/admin/Transaction.types";
import { WithdrawalRequest } from "../../types/admin/Withdrawal.types";
import { renderRejectionReasonField } from "../../utils/withdrawalUtils";

type TabType = "transactions" | "withdrawals";

const TransactionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("transactions");

  // Transaction management
  const {
    transactions,
    stats: transactionStats,
    loading: transactionLoading,
    filters: transactionFilters,
    totalCount: transactionTotalCount,
    totalPages: transactionTotalPages,
    currentPage: transactionCurrentPage,
    updateFilters: updateTransactionFilters,
    processRefund,
    getTransactionById,
    loadTransactions,
    handlePageChange: handleTransactionPageChange,
  } = useTransactionManagement();

  // Withdrawal management
  const {
    withdrawalRequests,
    stats: withdrawalStats,
    loading: withdrawalLoading,
    filters: withdrawalFilters,
    totalCount: withdrawalTotalCount,
    totalPages: withdrawalTotalPages,
    currentPage: withdrawalCurrentPage,
    updateFilters: updateWithdrawalFilters,
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
    completeWithdrawalRequest,
    getWithdrawalRequestById,
    loadWithdrawalRequests,
    handlePageChange: handleWithdrawalPageChange,
  } = useWithdrawalManagement();

  // Modal states
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalRequest | null>(null);
  const [showWithdrawalDetailModal, setShowWithdrawalDetailModal] =
    useState(false);

  const [refundModal, setRefundModal] = useState<{
    show: boolean;
    transaction: Transaction | null;
  }>({
    show: false,
    transaction: null,
  });

  const [withdrawalActionModal, setWithdrawalActionModal] = useState<{
    show: boolean;
    withdrawal: WithdrawalRequest | null;
    action: "approve" | "reject" | "complete" | null;
  }>({
    show: false,
    withdrawal: null,
    action: null,
  });

  const [rejectionReason, setRejectionReason] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [billImageLink, setBillImageLink] = useState("");
  // PART 2: Helper Functions

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
      Purchase: "Mua hàng",
      PhotographerFee: "Phí nhiếp ảnh gia",
      VenueFee: "Phí địa điểm",
      PlatformFee: "Phí nền tảng",
      Refund: "Hoàn tiền",
      Deposit: "Nạp ví",
      Withdrawal: "Rút tiền",
      EscrowHold: "Ký quỹ",
      EscrowRelease: "Giải phóng ký quỹ",
      EscrowRefund: "Hoàn tiền ký quỹ",
    };
    return typeMap[type] || type;
  };

  // Get status badge for transactions
  const getTransactionStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      Pending: { color: "bg-yellow-100 text-yellow-800", text: "Đang xử lý" },
      Success: { color: "bg-green-100 text-green-800", text: "Thành công" },
      Failed: { color: "bg-red-100 text-red-800", text: "Thất bại" },
      Held: { color: "bg-blue-100 text-blue-800", text: "Đang giữ" },
      Released: { color: "bg-green-100 text-green-800", text: "Đã giải phóng" },
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

  // Get status badge for withdrawals
  const getWithdrawalStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { color: string; text: string; icon?: any }
    > = {
      Pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "Chờ xử lý",
        icon: Clock,
      },
      Approved: {
        color: "bg-blue-100 text-blue-800",
        text: "Đã phê duyệt",
        icon: CheckCircle,
      },
      Rejected: { color: "bg-red-100 text-red-800", text: "Từ chối", icon: X },
      Completed: {
        color: "bg-green-100 text-green-800",
        text: "Hoàn thành",
        icon: Check,
      },
      Processing: {
        color: "bg-purple-100 text-purple-800",
        text: "Đang xử lý",
        icon: RefreshCw,
      },
    };

    const config = statusConfig[status] || statusConfig["Pending"];
    const IconComponent = config.icon;

    return (
      <span
        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color} items-center gap-1`}
      >
        {IconComponent && <IconComponent className="w-3 h-3" />}
        {config.text}
      </span>
    );
  };

  // Handle transaction refund
  const handleRefund = async (transaction: Transaction) => {
    const success = await processRefund(
      transaction.transactionId,
      "Admin initiated refund"
    );
    if (success) {
      setRefundModal({ show: false, transaction: null });
    }
  };

  // Handle view transaction details
  const handleViewTransactionDetails = async (transaction: Transaction) => {
    const fullTransaction = await getTransactionById(transaction.transactionId);
    if (fullTransaction) {
      setSelectedTransaction(fullTransaction);
      setShowDetailModal(true);
    }
  };

  // Handle view withdrawal details
  const handleViewWithdrawalDetails = async (withdrawal: WithdrawalRequest) => {
    const fullWithdrawal = await getWithdrawalRequestById(withdrawal.id);
    if (fullWithdrawal) {
      setSelectedWithdrawal(fullWithdrawal);
      setShowWithdrawalDetailModal(true);
    }
  };

  // Handle withdrawal actions
  const handleWithdrawalAction = async () => {
    if (!withdrawalActionModal.withdrawal || !withdrawalActionModal.action)
      return;

    const { withdrawal, action } = withdrawalActionModal;
    let success = false;

    switch (action) {
      case "approve":
        if (!billImageLink.trim()) {
          toast.error("Vui lòng nhập link hình ảnh hóa đơn");
          return;
        }
        success = await approveWithdrawalRequest(withdrawal.id, billImageLink);
        break;
      case "reject":
        if (!rejectionReason.trim()) {
          toast.error("Vui lòng nhập lý do từ chối");
          return;
        }
        success = await rejectWithdrawalRequest(withdrawal.id, rejectionReason);
        break;
      case "complete":
        success = await completeWithdrawalRequest(withdrawal.id);
        break;
    }

    if (success) {
      setWithdrawalActionModal({ show: false, withdrawal: null, action: null });
      setRejectionReason("");
      setTransactionReference("");
    }
  };
  // PART 3: Pagination Components

  // Pagination component for transactions
  const TransactionPagination = () => {
    if (transactionTotalPages <= 1) return null;

    const startPage = Math.max(1, transactionCurrentPage - 2);
    const endPage = Math.min(transactionTotalPages, transactionCurrentPage + 2);
    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
        <div className="text-sm text-gray-500">
          Hiển thị{" "}
          {Math.min(
            (transactionCurrentPage - 1) * transactionFilters.pageSize + 1,
            transactionTotalCount
          )}{" "}
          đến{" "}
          {Math.min(
            transactionCurrentPage * transactionFilters.pageSize,
            transactionTotalCount
          )}{" "}
          trong tổng số {transactionTotalCount} giao dịch
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              handleTransactionPageChange(transactionCurrentPage - 1)
            }
            disabled={transactionCurrentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handleTransactionPageChange(page)}
              className={`px-3 py-1 text-sm rounded-md ${
                page === transactionCurrentPage
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              handleTransactionPageChange(transactionCurrentPage + 1)
            }
            disabled={transactionCurrentPage === transactionTotalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Pagination component for withdrawals
  const WithdrawalPagination = () => {
    if (withdrawalTotalPages <= 1) return null;

    const startPage = Math.max(1, withdrawalCurrentPage - 2);
    const endPage = Math.min(withdrawalTotalPages, withdrawalCurrentPage + 2);
    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
        <div className="text-sm text-gray-500">
          Hiển thị{" "}
          {Math.min(
            (withdrawalCurrentPage - 1) * withdrawalFilters.pageSize + 1,
            withdrawalTotalCount
          )}{" "}
          đến{" "}
          {Math.min(
            withdrawalCurrentPage * withdrawalFilters.pageSize,
            withdrawalTotalCount
          )}{" "}
          trong tổng số {withdrawalTotalCount} yêu cầu
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() =>
              handleWithdrawalPageChange(withdrawalCurrentPage - 1)
            }
            disabled={withdrawalCurrentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handleWithdrawalPageChange(page)}
              className={`px-3 py-1 text-sm rounded-md ${
                page === withdrawalCurrentPage
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              handleWithdrawalPageChange(withdrawalCurrentPage + 1)
            }
            disabled={withdrawalCurrentPage === withdrawalTotalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (
    (activeTab === "transactions" && transactionLoading) ||
    (activeTab === "withdrawals" && withdrawalLoading)
  ) {
    return (
      <div className="h-40 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  // PART 4: Main Render (Header + Tabs + Statistics)

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý giao dịch & rút tiền</h1>
          <p className="text-gray-600">
            Theo dõi và quản lý tất cả giao dịch tài chính và yêu cầu rút tiền
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
          <button
            onClick={() => {
              if (activeTab === "transactions") {
                loadTransactions(transactionCurrentPage);
              } else {
                loadWithdrawalRequests(withdrawalCurrentPage);
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Đồng bộ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Giao dịch ({transactionStats.total})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("withdrawals")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "withdrawals"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                Yêu cầu rút tiền ({withdrawalStats.total})
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Transaction Statistics */}
      {activeTab === "transactions" && (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Tổng giao dịch
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {transactionStats.total}
                  </p>
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
                    {transactionStats.success}
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
                    {transactionStats.pending}
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
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Đang giữ
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {transactionStats.held}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Thất bại
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {transactionStats.failed}
                  </p>
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
                    {formatCurrency(transactionStats.totalRevenue)}
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
                    {formatCurrency(transactionStats.todayRevenue)}
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
                    {formatCurrency(transactionStats.totalRefunded)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        </>
      )}
      {/* Withdrawal Statistics */}
      {activeTab === "withdrawals" && (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Tổng yêu cầu
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {withdrawalStats.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tất cả</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Chờ xử lý
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {withdrawalStats.pending}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Cần phê duyệt</p>
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
                    Đã phê duyệt
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {withdrawalStats.approved}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Chờ chuyển tiền</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
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
                    {withdrawalStats.completed}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Đã chuyển tiền</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Từ chối
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {withdrawalStats.rejected}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Không hợp lệ</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Amount Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Tổng số tiền rút
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(withdrawalStats.totalAmount)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Số tiền rút hôm nay
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(withdrawalStats.todayAmount)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filters for Transactions */}
      {activeTab === "transactions" && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm mã GD, khách hàng..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                value={transactionFilters.searchTerm}
                onChange={(e) =>
                  updateTransactionFilters({ searchTerm: e.target.value })
                }
              />
            </div>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={transactionFilters.status}
              onChange={(e) =>
                updateTransactionFilters({ status: e.target.value as any })
              }
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Success">Thành công</option>
              <option value="Pending">Đang xử lý</option>
              <option value="Failed">Thất bại</option>
              <option value="Held">Đang giữ</option>
              <option value="Released">Đã giải phóng</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={transactionFilters.type}
              onChange={(e) =>
                updateTransactionFilters({ type: e.target.value as any })
              }
            >
              <option value="all">Tất cả loại</option>
              <option value="Purchase">Mua hàng</option>
              <option value="PhotographerFee">Phí nhiếp ảnh gia</option>
              <option value="VenueFee">Phí địa điểm</option>
              <option value="PlatformFee">Phí nền tảng</option>
              <option value="EscrowHold">Ký quỹ</option>
              <option value="Deposit">Nạp ví</option>
              <option value="Refund">Hoàn tiền</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={transactionFilters.dateRange}
              onChange={(e) =>
                updateTransactionFilters({ dateRange: e.target.value as any })
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
      )}

      {/* Filters for Withdrawals */}
      {activeTab === "withdrawals" && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, STK..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                value={withdrawalFilters.searchTerm}
                onChange={(e) =>
                  updateWithdrawalFilters({ searchTerm: e.target.value })
                }
              />
            </div>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={withdrawalFilters.status}
              onChange={(e) =>
                updateWithdrawalFilters({ status: e.target.value as any })
              }
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Approved">Đã phê duyệt</option>
              <option value="Rejected">Từ chối</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Processing">Đang xử lý</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={withdrawalFilters.dateRange}
              onChange={(e) =>
                updateWithdrawalFilters({ dateRange: e.target.value as any })
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
              {withdrawalRequests.length} kết quả
            </div>
          </div>
        </div>
      )}
      {/* Transactions Table */}
      {activeTab === "transactions" && (
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
                <tr
                  key={transaction.transactionId}
                  className="hover:bg-gray-50"
                >
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
                    {getTransactionStatusBadge(transaction.status)}
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
                      onClick={() => handleViewTransactionDetails(transaction)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {transaction.status === "Success" &&
                      (transaction.type === "Purchase" ||
                        transaction.type === "PhotographerFee") && (
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
                {transactionFilters.searchTerm ||
                transactionFilters.status !== "all" ||
                transactionFilters.type !== "all"
                  ? "Thử thay đổi bộ lọc để xem kết quả khác"
                  : "Chưa có giao dịch nào được thực hiện"}
              </p>
            </div>
          )}

          <TransactionPagination />
        </div>
      )}
      {/* Withdrawals Table */}
      {activeTab === "withdrawals" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngân hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày yêu cầu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawalRequests.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      #{withdrawal.id.toString().padStart(4, "0")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {withdrawal.userName}
                      </div>
                      <div className="text-gray-500">
                        {withdrawal.userEmail}
                      </div>
                      <div className="text-xs text-blue-600">
                        Ví: {formatCurrency(withdrawal.walletBalance)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-lg text-gray-900">
                      {formatCurrency(withdrawal.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {withdrawal.bankName}
                      </div>
                      <div className="text-gray-500">
                        {withdrawal.bankAccountNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {withdrawal.bankAccountName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getWithdrawalStatusBadge(withdrawal.requestStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {new Date(withdrawal.requestedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(withdrawal.requestedAt).toLocaleTimeString(
                        "vi-VN"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewWithdrawalDetails(withdrawal)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {withdrawal.requestStatus === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              setWithdrawalActionModal({
                                show: true,
                                withdrawal,
                                action: "approve",
                              })
                            }
                            className="text-green-600 hover:text-green-900"
                            title="Phê duyệt"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setWithdrawalActionModal({
                                show: true,
                                withdrawal,
                                action: "reject",
                              })
                            }
                            className="text-red-600 hover:text-red-900"
                            title="Từ chối"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {withdrawal.requestStatus === "Approved" && (
                        <button
                          onClick={() =>
                            setWithdrawalActionModal({
                              show: true,
                              withdrawal,
                              action: "complete",
                            })
                          }
                          className="text-purple-600 hover:text-purple-900"
                          title="Hoàn thành"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {withdrawalRequests.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có yêu cầu rút tiền nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {withdrawalFilters.searchTerm ||
                withdrawalFilters.status !== "all"
                  ? "Thử thay đổi bộ lọc để xem kết quả khác"
                  : "Chưa có yêu cầu rút tiền nào"}
              </p>
            </div>
          )}

          <WithdrawalPagination />
        </div>
      )}
      {/* Transaction Detail Modal */}
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
                      {getTransactionStatusBadge(selectedTransaction.status)}
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
              {selectedTransaction.status === "Success" &&
                (selectedTransaction.type === "Purchase" ||
                  selectedTransaction.type === "PhotographerFee") && (
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
      {/* Withdrawal Detail Modal */}
      {showWithdrawalDetailModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold">
                Chi tiết yêu cầu rút tiền #{selectedWithdrawal.id}
              </h3>
              <button
                onClick={() => setShowWithdrawalDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Thông tin yêu cầu
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium">
                        #{selectedWithdrawal.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-bold text-lg text-red-600">
                        {formatCurrency(selectedWithdrawal.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      {getWithdrawalStatusBadge(
                        selectedWithdrawal.requestStatus
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Yêu cầu lúc:</span>
                      <span className="text-sm">
                        {formatDateTime(selectedWithdrawal.requestedAt)}
                      </span>
                    </div>
                    {selectedWithdrawal.processedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Xử lý lúc:</span>
                        <span className="text-sm">
                          {formatDateTime(selectedWithdrawal.processedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    Thông tin người dùng
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tên:</span>
                      <span className="font-medium">
                        {selectedWithdrawal.userName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {selectedWithdrawal.userEmail}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số dư ví:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedWithdrawal.walletBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-gray-700">
                  Thông tin ngân hàng
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Ngân hàng:</span>
                      <div className="font-medium">
                        {selectedWithdrawal.bankName}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Số tài khoản:
                      </span>
                      <div className="font-medium">
                        {selectedWithdrawal.bankAccountNumber}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Tên tài khoản:
                      </span>
                      <div className="font-medium">
                        {selectedWithdrawal.bankAccountName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {renderRejectionReasonField(selectedWithdrawal)}
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowWithdrawalDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>

              {selectedWithdrawal.requestStatus === "Pending" && (
                <>
                  <button
                    onClick={() => {
                      setShowWithdrawalDetailModal(false);
                      setWithdrawalActionModal({
                        show: true,
                        withdrawal: selectedWithdrawal,
                        action: "approve",
                      });
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Phê duyệt
                  </button>
                  <button
                    onClick={() => {
                      setShowWithdrawalDetailModal(false);
                      setWithdrawalActionModal({
                        show: true,
                        withdrawal: selectedWithdrawal,
                        action: "reject",
                      });
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Từ chối
                  </button>
                </>
              )}

              {selectedWithdrawal.requestStatus === "Approved" && (
                <button
                  onClick={() => {
                    setShowWithdrawalDetailModal(false);
                    setWithdrawalActionModal({
                      show: true,
                      withdrawal: selectedWithdrawal,
                      action: "complete",
                    });
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                >
                  Hoàn thành
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Action Modal */}
      {withdrawalActionModal.show &&
        withdrawalActionModal.withdrawal &&
        withdrawalActionModal.action && (
          <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-bold">
                  {withdrawalActionModal.action === "approve" &&
                    "Phê duyệt yêu cầu"}
                  {withdrawalActionModal.action === "reject" &&
                    "Từ chối yêu cầu"}
                  {withdrawalActionModal.action === "complete" &&
                    "Hoàn thành rút tiền"}
                </h3>
                <button
                  onClick={() => {
                    setWithdrawalActionModal({
                      show: false,
                      withdrawal: null,
                      action: null,
                    });
                    setRejectionReason("");
                    setBillImageLink(""); // Clear bill image link
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">
                      #{withdrawalActionModal.withdrawal.id}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Người dùng:</span>
                    <span className="font-medium">
                      {withdrawalActionModal.withdrawal.userName}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(withdrawalActionModal.withdrawal.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">
                      {withdrawalActionModal.withdrawal.bankName} -{" "}
                      {withdrawalActionModal.withdrawal.bankAccountNumber}
                    </span>
                  </div>
                </div>

                {/* NEW: Bill Image Link field for approval */}
                {withdrawalActionModal.action === "approve" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link hình ảnh hóa đơn{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={billImageLink}
                      onChange={(e) => setBillImageLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/images/bill-proof.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nhập link hình ảnh chứng từ chuyển tiền làm bằng chứng phê
                      duyệt
                    </p>
                  </div>
                )}

                {withdrawalActionModal.action === "reject" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lý do từ chối <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Nhập lý do từ chối yêu cầu rút tiền..."
                    />
                  </div>
                )}

                {/* REMOVED: Transaction reference field for complete action (no longer needed according to new API) */}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setWithdrawalActionModal({
                        show: false,
                        withdrawal: null,
                        action: null,
                      });
                      setRejectionReason("");
                      setBillImageLink(""); // Clear bill image link
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleWithdrawalAction}
                    className={`px-4 py-2 text-white rounded-md ${
                      withdrawalActionModal.action === "approve"
                        ? "bg-green-500 hover:bg-green-600"
                        : withdrawalActionModal.action === "reject"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-purple-500 hover:bg-purple-600"
                    }`}
                  >
                    {withdrawalActionModal.action === "approve" && "Phê duyệt"}
                    {withdrawalActionModal.action === "reject" && "Từ chối"}
                    {withdrawalActionModal.action === "complete" &&
                      "Hoàn thành"}
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
