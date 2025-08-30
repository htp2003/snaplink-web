// hooks/admin/Withdrawal.hooks.ts
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { withdrawalService } from "../../services/withdrawalService";
import {
  WithdrawalRequest,
  WithdrawalFilters,
  WithdrawalStats,
  SimpleWithdrawal,
  UpdateWithdrawalStatusRequest,
} from "../../types/admin/Withdrawal.types";

export const useWithdrawalManagement = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<
    WithdrawalRequest[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WithdrawalFilters>({
    searchTerm: "",
    status: "all",
    dateRange: "all",
    page: 1,
    pageSize: 20,
  });

  // Convert WithdrawalRequest to SimpleWithdrawal for UI display
  const convertToSimpleWithdrawal = (
    request: WithdrawalRequest
  ): SimpleWithdrawal => {
    return {
      id: request.id,
      userName: request.userName,
      userEmail: request.userEmail,
      amount: request.amount,
      bankInfo: `${request.bankName} - ${request.bankAccountNumber}`,
      status: request.requestStatus,
      requestedAt: request.requestedAt,
      walletBalance: request.walletBalance,
    };
  };

  // Load withdrawal requests
  const loadWithdrawalRequests = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await withdrawalService.getAllWithdrawalRequests(
        page,
        filters.pageSize,
        filters.status !== "all" ? filters.status : undefined
      );

      setWithdrawalRequests(response.withdrawalRequests);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
    } catch (err) {
      setError("Failed to load withdrawal requests");
      console.error("Error loading withdrawal requests:", err);
      toast.error("Không thể tải danh sách yêu cầu rút tiền");
    } finally {
      setLoading(false);
    }
  };

  // Filter withdrawal requests based on current filters
  const filteredWithdrawalRequests = useMemo(() => {
    return withdrawalRequests.filter((request) => {
      // Search filter
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        request.id.toString().includes(searchTerm) ||
        request.userName.toLowerCase().includes(searchTerm) ||
        request.userEmail.toLowerCase().includes(searchTerm) ||
        request.bankAccountNumber.includes(searchTerm) ||
        request.bankAccountName.toLowerCase().includes(searchTerm) ||
        request.bankName.toLowerCase().includes(searchTerm);

      // Status filter
      const matchesStatus =
        filters.status === "all" || request.requestStatus === filters.status;

      // Date filter
      let matchesDate = true;
      if (filters.dateRange !== "all") {
        const requestDate = new Date(request.requestedAt);
        const now = new Date();

        switch (filters.dateRange) {
          case "today":
            matchesDate = requestDate.toDateString() === now.toDateString();
            break;
          case "yesterday":
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            matchesDate =
              requestDate.toDateString() === yesterday.toDateString();
            break;
          case "this_week":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            matchesDate = requestDate >= weekStart;
            break;
          case "this_month":
            matchesDate =
              requestDate.getMonth() === now.getMonth() &&
              requestDate.getFullYear() === now.getFullYear();
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [withdrawalRequests, filters]);

  // Calculate statistics
  const stats: WithdrawalStats = useMemo(() => {
    const pending = withdrawalRequests.filter(
      (r) => r.requestStatus === "Pending"
    );
    const approved = withdrawalRequests.filter(
      (r) => r.requestStatus === "Approved"
    );
    const rejected = withdrawalRequests.filter(
      (r) => r.requestStatus === "Rejected"
    );
    const completed = withdrawalRequests.filter(
      (r) => r.requestStatus === "Completed"
    );

    const totalAmount = withdrawalRequests.reduce(
      (sum, r) => sum + r.amount,
      0
    );

    const today = new Date().toDateString();
    const todayAmount = withdrawalRequests
      .filter((r) => new Date(r.requestedAt).toDateString() === today)
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      total: totalCount,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      completed: completed.length,
      totalAmount,
      todayAmount,
    };
  }, [withdrawalRequests, totalCount]);

  // Get withdrawal request by ID
  const getWithdrawalRequestById = async (
    id: number
  ): Promise<WithdrawalRequest | null> => {
    try {
      const request = await withdrawalService.getWithdrawalRequestById(id);
      return request;
    } catch (error) {
      console.error("Error fetching withdrawal request:", error);
      toast.error("Không thể tải chi tiết yêu cầu rút tiền");
      return null;
    }
  };

  // Update withdrawal status - NEW unified method
  const updateWithdrawalStatus = async (
    withdrawalId: number,
    status: "approved" | "rejected" | "completed",
    message?: string
  ): Promise<boolean> => {
    try {
      const statusData: UpdateWithdrawalStatusRequest = { status };

      // Add message if provided and required
      if (message) {
        statusData.message = message;
      }

      const updatedRequest = await withdrawalService.updateWithdrawalStatus(
        withdrawalId,
        statusData
      );

      // Update local state
      setWithdrawalRequests((prev) =>
        prev.map((r) =>
          r.id === withdrawalId
            ? {
                ...updatedRequest,
                processedAt: new Date().toISOString(),
              }
            : r
        )
      );

      // Show success message
      const statusMessages = {
        approved: "Đã phê duyệt yêu cầu rút tiền!",
        rejected: "Đã từ chối yêu cầu rút tiền!",
        completed: "Đã hoàn thành yêu cầu rút tiền!",
      };

      toast.success(statusMessages[status]);
      return true;
    } catch (error) {
      console.error("Error updating withdrawal status:", error);

      const errorMessages = {
        approved: "Có lỗi xảy ra khi phê duyệt",
        rejected: "Có lỗi xảy ra khi từ chối",
        completed: "Có lỗi xảy ra khi hoàn thành",
      };

      toast.error(errorMessages[status]);
      return false;
    }
  };

  // Approve withdrawal request - requires bill image link
  const approveWithdrawalRequest = async (
    withdrawalId: number,
    billImageLink: string
  ): Promise<boolean> => {
    if (!billImageLink.trim()) {
      toast.error("Vui lòng cung cấp link hình ảnh hóa đơn");
      return false;
    }

    return updateWithdrawalStatus(withdrawalId, "approved", billImageLink);
  };

  // Reject withdrawal request - requires rejection reason
  const rejectWithdrawalRequest = async (
    withdrawalId: number,
    reason: string
  ): Promise<boolean> => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return false;
    }

    return updateWithdrawalStatus(withdrawalId, "rejected", reason);
  };

  // Complete withdrawal request
  const completeWithdrawalRequest = async (
    withdrawalId: number
  ): Promise<boolean> => {
    return updateWithdrawalStatus(withdrawalId, "completed");
  };

  // LEGACY: Process withdrawal request (deprecated but kept for backward compatibility)
  const processWithdrawalRequest = async (
    withdrawalId: number,
    data: any
  ): Promise<boolean> => {
    console.warn(
      "processWithdrawalRequest is deprecated. Use specific approve/reject/complete methods instead."
    );

    try {
      // Convert legacy data format to new API
      if (data.status === "Approved") {
        return approveWithdrawalRequest(
          withdrawalId,
          data.billImageLink || data.rejectionReason || ""
        );
      } else if (data.status === "Rejected") {
        return rejectWithdrawalRequest(
          withdrawalId,
          data.rejectionReason || "No reason provided"
        );
      } else if (data.status === "Completed") {
        return completeWithdrawalRequest(withdrawalId);
      }

      return false;
    } catch (error) {
      console.error("Error processing withdrawal request:", error);
      toast.error("Có lỗi xảy ra khi xử lý");
      return false;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<WithdrawalFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      dateRange: "all",
      page: 1,
      pageSize: 20,
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadWithdrawalRequests(page);
  };

  // Load data on mount and when filters change
  useEffect(() => {
    loadWithdrawalRequests(filters.page);
  }, [filters.page, filters.status]);

  // Load initial data
  useEffect(() => {
    loadWithdrawalRequests();
  }, []);

  return {
    // Data
    withdrawalRequests: filteredWithdrawalRequests,
    allWithdrawalRequests: withdrawalRequests,
    stats,
    loading,
    error,
    filters,
    totalCount,
    totalPages,
    currentPage,

    // Computed
    simpleWithdrawals: filteredWithdrawalRequests.map(
      convertToSimpleWithdrawal
    ),

    // Actions
    loadWithdrawalRequests,
    getWithdrawalRequestById,

    // New unified status update method
    updateWithdrawalStatus,

    // Specific methods (wrappers for updateWithdrawalStatus)
    approveWithdrawalRequest,
    rejectWithdrawalRequest,
    completeWithdrawalRequest,

    // Legacy method (deprecated)
    processWithdrawalRequest,

    // Filters and navigation
    updateFilters,
    clearFilters,
    handlePageChange,
  };
};
