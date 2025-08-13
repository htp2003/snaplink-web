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

  // Calculate transaction statistics
  async getTransactionStats() {
    try {
      const response = await this.getAllTransactions(1, 1000); // Get nhiều transactions để tính toán
      const transactions = response.transactions;

      const completed = transactions.filter(
        (t) => t.status === "Completed" || t.status === "Success"
      );
      const pending = transactions.filter((t) => t.status === "Pending");
      const held = transactions.filter((t) => t.status === "Held");
      const failed = transactions.filter((t) => t.status === "Failed");

      const totalRevenue = completed.reduce((sum, t) => sum + t.amount, 0);
      const totalRefunded = transactions
        .filter((t) => t.type === "Refund")
        .reduce((sum, t) => sum + t.amount, 0);

      const today = new Date().toDateString();
      const todayRevenue = completed
        .filter((t) => new Date(t.createdAt).toDateString() === today)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        total: response.totalCount,
        completed: completed.length,
        success: transactions.filter((t) => t.status === "Success").length,
        pending: pending.length,
        held: held.length,
        failed: failed.length,
        totalRevenue,
        totalRefunded,
        todayRevenue,
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
}

export const transactionService = new TransactionService();
