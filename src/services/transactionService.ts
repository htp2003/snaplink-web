// services/transactionService.ts
import { apiClient } from "./apiClient";
import {
  Transaction,
  TransactionHistoryParams,
  TransactionHistoryResponse,
  MonthlyIncomeResponse,
  TransactionApiResponse,
  SimpleTransactionApiResponse,
  SingleTransactionApiResponse,
  TransactionStats,
  getCashFlowDirection,
} from "../types/admin/Transaction.types";

class TransactionService {
  // Get all transactions - sử dụng API mới
  async getAllTransactions(
    page: number = 1,
    pageSize: number = 20,
    year?: number,
    month?: number
  ): Promise<TransactionHistoryResponse> {
    try {
      let endpoint = `/api/Transaction?page=${page}&pageSize=${pageSize}`;

      if (year) endpoint += `&year=${year}`;
      if (month) endpoint += `&month=${month}`;

      const response = await apiClient.get(endpoint);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch transactions");
      }

      // Response.data chứa { error: 0, message: "...", data: { transactions: [...] } }
      const apiResponse = response.data as TransactionApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      const transactions = apiResponse.data.transactions || [];

      return {
        transactions,
        totalCount: transactions.length,
        totalPages: Math.ceil(transactions.length / pageSize),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Failed to fetch transactions");
    }
  }

  // Get single transaction by ID
  async getTransactionById(transactionId: number): Promise<Transaction> {
    try {
      const response = await apiClient.get(`/api/Transaction/${transactionId}`);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch transaction");
      }

      const apiResponse = response.data as SingleTransactionApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  }

  // Get transaction history for user
  async getUserTransactionHistory(
    params: TransactionHistoryParams
  ): Promise<TransactionHistoryResponse> {
    const { userId, page = 1, pageSize = 10, year, month } = params;

    try {
      let endpoint = `/api/Transaction/history/user/${userId}?page=${page}&pageSize=${pageSize}`;

      if (year) endpoint += `&year=${year}`;
      if (month) endpoint += `&month=${month}`;

      const response = await apiClient.get(endpoint);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch user transactions"
        );
      }

      // Handle cả trường hợp API trả về format mới hoặc cũ
      let transactions: Transaction[] = [];

      if ((response.data as any)?.error !== undefined) {
        // Format mới: { error: 0, message: "...", data: { transactions: [...] } }
        const apiResponse = response.data as SimpleTransactionApiResponse;
        if (apiResponse.error !== 0) {
          throw new Error(apiResponse.message || "API returned error");
        }
        transactions = apiResponse.data?.transactions || [];
      } else {
        // Format cũ: trực tiếp array hoặc { transactions: [...] }
        const data = response.data as
          | Transaction[]
          | { transactions: Transaction[] };
        transactions = Array.isArray(data) ? data : data.transactions || [];
      }

      return {
        transactions,
        totalCount: transactions.length,
        totalPages: Math.ceil(transactions.length / pageSize),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching user transaction history:", error);
      throw error;
    }
  }

  // Get transaction history for photographer
  async getPhotographerTransactionHistory(
    params: TransactionHistoryParams
  ): Promise<TransactionHistoryResponse> {
    const {
      userId: photographerId,
      page = 1,
      pageSize = 10,
      year,
      month,
    } = params;

    try {
      let endpoint = `/api/Transaction/history/photographer/${photographerId}?page=${page}&pageSize=${pageSize}`;

      if (year) endpoint += `&year=${year}`;
      if (month) endpoint += `&month=${month}`;

      const response = await apiClient.get(endpoint);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch photographer transactions"
        );
      }

      let transactions: Transaction[] = [];

      if ((response.data as any)?.error !== undefined) {
        const apiResponse = response.data as SimpleTransactionApiResponse;
        if (apiResponse.error !== 0) {
          throw new Error(apiResponse.message || "API returned error");
        }
        transactions = apiResponse.data?.transactions || [];
      } else {
        const data = response.data as
          | Transaction[]
          | { transactions: Transaction[] };
        transactions = Array.isArray(data) ? data : data.transactions || [];
      }

      return {
        transactions,
        totalCount: transactions.length,
        totalPages: Math.ceil(transactions.length / pageSize),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error fetching photographer transaction history:", error);
      throw error;
    }
  }

  // Get transaction history for location owner
  async getLocationOwnerTransactionHistory(
    params: TransactionHistoryParams
  ): Promise<TransactionHistoryResponse> {
    const {
      userId: locationOwnerId,
      page = 1,
      pageSize = 10,
      year,
      month,
    } = params;

    try {
      let endpoint = `/api/Transaction/history/location-owner/${locationOwnerId}?page=${page}&pageSize=${pageSize}`;

      if (year) endpoint += `&year=${year}`;
      if (month) endpoint += `&month=${month}`;

      const response = await apiClient.get(endpoint);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch location owner transactions"
        );
      }

      let transactions: Transaction[] = [];

      if ((response.data as any)?.error !== undefined) {
        const apiResponse = response.data as SimpleTransactionApiResponse;
        if (apiResponse.error !== 0) {
          throw new Error(apiResponse.message || "API returned error");
        }
        transactions = apiResponse.data?.transactions || [];
      } else {
        const data = response.data as
          | Transaction[]
          | { transactions: Transaction[] };
        transactions = Array.isArray(data) ? data : data.transactions || [];
      }

      return {
        transactions,
        totalCount: transactions.length,
        totalPages: Math.ceil(transactions.length / pageSize),
        currentPage: page,
      };
    } catch (error) {
      console.error(
        "Error fetching location owner transaction history:",
        error
      );
      throw error;
    }
  }

  // Get monthly income
  async getMonthlyIncome(
    userId: number,
    year?: number,
    month?: number
  ): Promise<MonthlyIncomeResponse> {
    try {
      let endpoint = `/api/Transaction/monthly-income/${userId}`;

      const params = new URLSearchParams();
      if (year) params.append("year", year.toString());
      if (month) params.append("month", month.toString());

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      const response = await apiClient.get(endpoint);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch monthly income");
      }

      const apiResponse = response.data as
        | { error?: number; message?: string; data?: MonthlyIncomeResponse }
        | MonthlyIncomeResponse;

      if (
        "error" in apiResponse &&
        apiResponse.error !== undefined &&
        apiResponse.error !== 0
      ) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return "data" in apiResponse && apiResponse.data
        ? apiResponse.data
        : (apiResponse as MonthlyIncomeResponse);
    } catch (error) {
      console.error("Error fetching monthly income:", error);
      throw error;
    }
  }

  // Calculate transaction statistics với CASH FLOW METRICS
  async getTransactionStats(): Promise<TransactionStats> {
    try {
      const response = await this.getAllTransactions(1, 1000); // Get nhiều transactions để tính toán
      const transactions = response.transactions;

      // Basic status counts
      const completed = transactions.filter(
        (t) => t.status === "Completed" || t.status === "Success"
      );
      const pending = transactions.filter((t) => t.status === "Pending");
      const held = transactions.filter((t) => t.status === "Held");
      const failed = transactions.filter((t) => t.status === "Failed");
      const success = transactions.filter((t) => t.status === "Success");

      // Legacy revenue calculations
      const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
      const totalRefunded = transactions
        .filter((t) => t.type === "Refund")
        .reduce((sum, t) => sum + t.amount, 0);

      const today = new Date().toDateString();
      const todayRevenue = completed
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

      // Only count successful/completed transactions for cash flow
      const successfulTransactions = transactions.filter(
        (t) => t.status === "Success" || t.status === "Completed"
      );

      const totalCashIn = successfulTransactions
        .filter((t) => cashInTypes.includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const totalCashOut = successfulTransactions
        .filter((t) => cashOutTypes.includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const netCashFlow = totalCashIn - totalCashOut;

      // Today's cash flow
      const todaySuccessfulTransactions = successfulTransactions.filter(
        (t) => new Date(t.createdAt).toDateString() === today
      );

      const todayCashIn = todaySuccessfulTransactions
        .filter((t) => cashInTypes.includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const todayCashOut = todaySuccessfulTransactions
        .filter((t) => cashOutTypes.includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const todayNetCashFlow = todayCashIn - todayCashOut;

      return {
        total: response.totalCount,
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
    } catch (error) {
      console.warn("Error calculating transaction stats:", error);
      return {
        total: 0,
        completed: 0,
        success: 0,
        pending: 0,
        held: 0,
        failed: 0,
        totalRevenue: 0,
        totalRefunded: 0,
        todayRevenue: 0,
        // Default cash flow values
        totalCashIn: 0,
        totalCashOut: 0,
        netCashFlow: 0,
        todayCashIn: 0,
        todayCashOut: 0,
        todayNetCashFlow: 0,
      };
    }
  }

  // Process refund
  async processRefund(
    transactionId: number,
    reason?: string
  ): Promise<Transaction> {
    try {
      const response = await apiClient.post(
        `/api/Transaction/${transactionId}/refund`,
        { reason }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to process refund");
      }

      const apiResponse = response.data as
        | SingleTransactionApiResponse
        | Transaction;

      if (
        "error" in apiResponse &&
        apiResponse.error !== undefined &&
        apiResponse.error !== 0
      ) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return "data" in apiResponse && apiResponse.data
        ? apiResponse.data
        : (apiResponse as Transaction);
    } catch (error) {
      console.error("Error processing refund:", error);
      throw error;
    }
  }

  // Cancel transaction
  async cancelTransaction(
    transactionId: number,
    reason?: string
  ): Promise<Transaction> {
    try {
      const response = await apiClient.post(
        `/api/Transaction/${transactionId}/cancel`,
        { reason }
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to cancel transaction");
      }

      const apiResponse = response.data as
        | SingleTransactionApiResponse
        | Transaction;

      if (
        "error" in apiResponse &&
        apiResponse.error !== undefined &&
        apiResponse.error !== 0
      ) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return "data" in apiResponse && apiResponse.data
        ? apiResponse.data
        : (apiResponse as Transaction);
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      throw error;
    }
  }

  // NEW: Get cash flow summary for specific date range
  async getCashFlowSummary(
    startDate?: string,
    endDate?: string
  ): Promise<{
    cashIn: number;
    cashOut: number;
    netFlow: number;
    breakdownIn: Record<string, number>;
    breakdownOut: Record<string, number>;
  }> {
    try {
      const response = await this.getAllTransactions(1, 1000);
      let transactions = response.transactions;

      // Filter by date range if provided
      if (startDate || endDate) {
        transactions = transactions.filter((t) => {
          const transactionDate = new Date(t.createdAt);
          const start = startDate ? new Date(startDate) : new Date(0);
          const end = endDate ? new Date(endDate) : new Date();

          return transactionDate >= start && transactionDate <= end;
        });
      }

      // Only count successful transactions
      const successfulTransactions = transactions.filter(
        (t) => t.status === "Success" || t.status === "Completed"
      );

      const cashInTypes = ["Purchase", "Deposit", "PlatformFee"];
      const cashOutTypes = [
        "PhotographerFee",
        "VenueFee",
        "Refund",
        "Withdrawal",
        "EscrowRefund",
      ];

      // Calculate totals
      const cashIn = successfulTransactions
        .filter((t) => cashInTypes.includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const cashOut = successfulTransactions
        .filter((t) => cashOutTypes.includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate breakdown by type
      const breakdownIn: Record<string, number> = {};
      const breakdownOut: Record<string, number> = {};

      cashInTypes.forEach((type) => {
        breakdownIn[type] = successfulTransactions
          .filter((t) => t.type === type)
          .reduce((sum, t) => sum + t.amount, 0);
      });

      cashOutTypes.forEach((type) => {
        breakdownOut[type] = successfulTransactions
          .filter((t) => t.type === type)
          .reduce((sum, t) => sum + t.amount, 0);
      });

      return {
        cashIn,
        cashOut,
        netFlow: cashIn - cashOut,
        breakdownIn,
        breakdownOut,
      };
    } catch (error) {
      console.error("Error getting cash flow summary:", error);
      return {
        cashIn: 0,
        cashOut: 0,
        netFlow: 0,
        breakdownIn: {},
        breakdownOut: {},
      };
    }
  }

  // NEW: Get cash flow by transaction type
  async getCashFlowByType(): Promise<{
    inFlow: Record<string, { amount: number; count: number }>;
    outFlow: Record<string, { amount: number; count: number }>;
  }> {
    try {
      const response = await this.getAllTransactions(1, 1000);
      const successfulTransactions = response.transactions.filter(
        (t) => t.status === "Success" || t.status === "Completed"
      );

      const inFlow: Record<string, { amount: number; count: number }> = {};
      const outFlow: Record<string, { amount: number; count: number }> = {};

      successfulTransactions.forEach((transaction) => {
        const direction = getCashFlowDirection(transaction.type);
        const type = transaction.type;

        if (direction === "in") {
          if (!inFlow[type]) {
            inFlow[type] = { amount: 0, count: 0 };
          }
          inFlow[type].amount += transaction.amount;
          inFlow[type].count += 1;
        } else if (direction === "out") {
          if (!outFlow[type]) {
            outFlow[type] = { amount: 0, count: 0 };
          }
          outFlow[type].amount += transaction.amount;
          outFlow[type].count += 1;
        }
      });

      return { inFlow, outFlow };
    } catch (error) {
      console.error("Error getting cash flow by type:", error);
      return { inFlow: {}, outFlow: {} };
    }
  }
}

export const transactionService = new TransactionService();
