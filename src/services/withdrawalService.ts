// services/withdrawalService.ts
import { apiClient } from "./apiClient";
import {
  WithdrawalRequest,
  WithdrawalResponse,
  WithdrawalApiResponse,
  SingleWithdrawalApiResponse,
  ProcessWithdrawalRequest,
  WithdrawalLimits,
} from "../types/admin/Withdrawal.types";

class WithdrawalService {
  // Get all withdrawal requests
  async getAllWithdrawalRequests(
    page: number = 1,
    pageSize: number = 20,
    status?: string
  ): Promise<WithdrawalResponse> {
    try {
      let endpoint = `/api/WithdrawalRequest?page=${page}&pageSize=${pageSize}`;

      if (status && status !== "all") {
        endpoint += `&status=${status}`;
      }

      const response = await apiClient.get(endpoint);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch withdrawal requests"
        );
      }

      const apiResponse = response.data as WithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching withdrawal requests:", error);
      throw new Error("Failed to fetch withdrawal requests");
    }
  }

  // Get withdrawal request by ID
  async getWithdrawalRequestById(
    withdrawalId: number
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.get(
        `/api/WithdrawalRequest/${withdrawalId}`
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching withdrawal request:", error);
      throw error;
    }
  }

  // Get withdrawal request details
  async getWithdrawalRequestDetail(
    withdrawalId: number
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.get(
        `/api/WithdrawalRequest/${withdrawalId}/detail`
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch withdrawal request details"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching withdrawal request details:", error);
      throw error;
    }
  }

  // Get withdrawal requests by status
  async getWithdrawalRequestsByStatus(
    status: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<WithdrawalResponse> {
    try {
      const response = await apiClient.get(
        `/api/WithdrawalRequest/status/${status}?page=${page}&pageSize=${pageSize}`
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch withdrawal requests"
        );
      }

      const apiResponse = response.data as WithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching withdrawal requests by status:", error);
      throw error;
    }
  }

  // Process withdrawal request (approve/reject)
  async processWithdrawalRequest(
    withdrawalId: number,
    data: ProcessWithdrawalRequest
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.post(
        `/api/WithdrawalRequest/${withdrawalId}/process`,
        data
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to process withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error processing withdrawal request:", error);
      throw error;
    }
  }

  // Approve withdrawal request
  async approveWithdrawalRequest(
    withdrawalId: number
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.post(
        `/api/WithdrawalRequest/${withdrawalId}/approve`
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to approve withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error approving withdrawal request:", error);
      throw error;
    }
  }

  // Reject withdrawal request
  async rejectWithdrawalRequest(
    withdrawalId: number,
    rejectionReason: string
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.post(
        `/api/WithdrawalRequest/${withdrawalId}/reject`,
        { rejectionReason }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to reject withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error rejecting withdrawal request:", error);
      throw error;
    }
  }

  // Complete withdrawal request
  async completeWithdrawalRequest(
    withdrawalId: number,
    transactionReference?: string
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.post(
        `/api/WithdrawalRequest/${withdrawalId}/complete`,
        { transactionReference }
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to complete withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error completing withdrawal request:", error);
      throw error;
    }
  }

  // Get withdrawal limits
  async getWithdrawalLimits(): Promise<WithdrawalLimits> {
    try {
      const response = await apiClient.get("/api/WithdrawalRequest/limits");

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch withdrawal limits"
        );
      }

      // Handle both formats - direct data or wrapped in API response
      const data = response.data as any;

      if (data.error !== undefined && data.error !== 0) {
        throw new Error(data.message || "API returned error");
      }

      return data.data || data;
    } catch (error) {
      console.error("Error fetching withdrawal limits:", error);
      // Return default limits if API fails
      return {
        minAmount: 50000,
        maxAmount: 50000000,
        dailyLimit: 10000000,
        monthlyLimit: 100000000,
      };
    }
  }

  // Delete withdrawal request
  async deleteWithdrawalRequest(withdrawalId: number): Promise<boolean> {
    try {
      const response = await apiClient.delete(
        `/api/WithdrawalRequest/${withdrawalId}`
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to delete withdrawal request"
        );
      }

      return true;
    } catch (error) {
      console.error("Error deleting withdrawal request:", error);
      throw error;
    }
  }

  // Calculate withdrawal statistics
  async getWithdrawalStats(): Promise<any> {
    try {
      const response = await this.getAllWithdrawalRequests(1, 1000); // Get many requests for calculation
      const requests = response.withdrawalRequests;

      const pending = requests.filter((r) => r.requestStatus === "Pending");
      const approved = requests.filter((r) => r.requestStatus === "Approved");
      const rejected = requests.filter((r) => r.requestStatus === "Rejected");
      const completed = requests.filter((r) => r.requestStatus === "Completed");

      const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);

      const today = new Date().toDateString();
      const todayAmount = requests
        .filter((r) => new Date(r.requestedAt).toDateString() === today)
        .reduce((sum, r) => sum + r.amount, 0);

      return {
        total: response.totalCount,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        completed: completed.length,
        totalAmount,
        todayAmount,
      };
    } catch (error) {
      console.warn("Error calculating withdrawal stats:", error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        totalAmount: 0,
        todayAmount: 0,
      };
    }
  }
}

export const withdrawalService = new WithdrawalService();
