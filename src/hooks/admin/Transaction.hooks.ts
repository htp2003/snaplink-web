// hooks/admin/Transaction.hooks.ts
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { transactionService } from "../../services/transactionService";
import {
  Transaction,
  TransactionFilters,
  TransactionStats,
  SimpleTransaction,
  getCashFlowDirection,
  formatCashFlowAmount,
} from "../../types/admin/Transaction.types";

export const useTransactionManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TransactionFilters>({
    searchTerm: "",
    status: "all",
    type: "all",
    dateRange: "all",
    page: 1,
    pageSize: 20,
  });

  // Convert Transaction to SimpleTransaction for UI display WITH CASH FLOW
  const convertToSimpleTransaction = (
    transaction: Transaction
  ): SimpleTransaction => {
    const direction = getCashFlowDirection(transaction.type);
    const displayAmount = formatCashFlowAmount(transaction.amount, direction);

    return {
      id: transaction.transactionId,
      customerName: transaction.fromUserName || "System",
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      date: transaction.createdAt,
      relatedTo: transaction.note || `${transaction.type} transaction`,
      // NEW: Cash flow properties
      direction,
      displayAmount,
    };
  };

  // Load transactions using the new API
  const loadTransactions = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await transactionService.getAllTransactions(
        page,
        filters.pageSize
      );

      setTransactions(response.transactions);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Error loading transactions:", err);
      toast.error("Không thể tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        transaction.transactionId.toString().includes(searchTerm) ||
        (transaction.fromUserName &&
          transaction.fromUserName.toLowerCase().includes(searchTerm)) ||
        (transaction.note &&
          transaction.note.toLowerCase().includes(searchTerm));

      // Status filter
      const matchesStatus =
        filters.status === "all" || transaction.status === filters.status;

      // Type filter
      const matchesType =
        filters.type === "all" || transaction.type === filters.type;

      // Date filter
      let matchesDate = true;
      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.createdAt);
        const now = new Date();

        switch (filters.dateRange) {
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

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [transactions, filters]);

  // Calculate statistics with CASH FLOW METRICS
  const stats: TransactionStats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === "Completed");
    const success = transactions.filter((t) => t.status === "Success");
    const pending = transactions.filter((t) => t.status === "Pending");
    const held = transactions.filter((t) => t.status === "Held");
    const failed = transactions.filter((t) => t.status === "Failed");

    // Combine completed and success for calculations
    const completedTransactions = [...completed, ...success];

    // OLD: Legacy revenue calculation
    const totalRevenue = completedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalRefunded = transactions
      .filter((t) => t.type === "Refund")
      .reduce((sum, t) => sum + t.amount, 0);

    const today = new Date().toDateString();
    const todayRevenue = completedTransactions
      .filter((t) => new Date(t.createdAt).toDateString() === today)
      .reduce((sum, t) => sum + t.amount, 0);

    // NEW: Cash flow calculations
    const cashInTypes = ["Purchase", "Deposit", "PlatformFee"];
    const cashOutTypes = [
      "PhotographerFee",
      "VenueFee",
      "Refund",
      "Withdrawal",
      "EscrowRefund",
    ];

    const totalCashIn = completedTransactions
      .filter((t) => cashInTypes.includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCashOut = completedTransactions
      .filter((t) => cashOutTypes.includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashFlow = totalCashIn - totalCashOut;

    // Today's cash flow
    const todayCompletedTransactions = completedTransactions.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );

    const todayCashIn = todayCompletedTransactions
      .filter((t) => cashInTypes.includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const todayCashOut = todayCompletedTransactions
      .filter((t) => cashOutTypes.includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    const todayNetCashFlow = todayCashIn - todayCashOut;

    return {
      total: totalCount,
      completed: completed.length,
      success: success.length,
      pending: pending.length,
      held: held.length,
      failed: failed.length,
      totalRevenue,
      totalRefunded,
      todayRevenue,
      // NEW: Cash flow metrics
      totalCashIn,
      totalCashOut,
      netCashFlow,
      todayCashIn,
      todayCashOut,
      todayNetCashFlow,
    };
  }, [transactions, totalCount]);

  // Get transaction by ID
  const getTransactionById = async (
    id: number
  ): Promise<Transaction | null> => {
    try {
      const transaction = await transactionService.getTransactionById(id);
      return transaction;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      toast.error("Không thể tải chi tiết giao dịch");
      return null;
    }
  };

  // Process refund
  const processRefund = async (
    transactionId: number,
    reason?: string
  ): Promise<boolean> => {
    try {
      await transactionService.processRefund(transactionId, reason);

      // Update local state
      setTransactions((prev) =>
        prev.map((t) =>
          t.transactionId === transactionId
            ? {
                ...t,
                status: "Cancelled",
                note: `${t.note} - Refunded: ${reason}`,
              }
            : t
        )
      );

      toast.success("Hoàn tiền thành công!");
      return true;
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Có lỗi xảy ra khi hoàn tiền");
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<TransactionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      type: "all",
      dateRange: "all",
      page: 1,
      pageSize: 20,
    });
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const newStats = await transactionService.getTransactionStats();
      return newStats;
    } catch (error) {
      console.error("Error loading transaction stats:", error);
      return stats; // Return calculated stats as fallback
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadTransactions(page);
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadTransactions(filters.page);
  }, [filters.page]);

  // Load initial data
  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    // Data
    transactions: filteredTransactions,
    allTransactions: transactions,
    stats,
    loading,
    error,
    filters,
    totalCount,
    totalPages,
    currentPage,

    // Computed
    simpleTransactions: filteredTransactions.map(convertToSimpleTransaction),

    // Actions
    loadTransactions,
    loadStats,
    getTransactionById,
    processRefund,
    updateFilters,
    clearFilters,
    handlePageChange,
  };
};
