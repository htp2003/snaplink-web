// services/withdrawalService.ts
import { apiClient } from "./apiClient";
import {
  WithdrawalRequest,
  WithdrawalResponse,
  WithdrawalApiResponse,
  SingleWithdrawalApiResponse,
  UpdateWithdrawalStatusRequest,
  CreateWithdrawalRequest,
  UpdateWithdrawalRequest,
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

  // Get user's withdrawal requests (new endpoint)
  async getUserWithdrawalRequests(
    page: number = 1,
    pageSize: number = 20
  ): Promise<WithdrawalResponse> {
    try {
      const response = await apiClient.get(
        `/api/WithdrawalRequest/user?page=${page}&pageSize=${pageSize}`
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch user withdrawal requests"
        );
      }

      const apiResponse = response.data as WithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error fetching user withdrawal requests:", error);
      throw error;
    }
  }

  // Create withdrawal request
  async createWithdrawalRequest(
    data: CreateWithdrawalRequest
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.post(`/api/WithdrawalRequest`, data);

      if (!response.success) {
        throw new Error(
          response.message || "Failed to create withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error creating withdrawal request:", error);
      throw error;
    }
  }

  // Update withdrawal request (new endpoint)
  async updateWithdrawalRequest(
    withdrawalId: number,
    data: UpdateWithdrawalRequest
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.put(
        `/api/WithdrawalRequest/${withdrawalId}`,
        data
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update withdrawal request"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error updating withdrawal request:", error);
      throw error;
    }
  }

  // NEW: Update withdrawal status (replaces approve/reject/complete)
  async updateWithdrawalStatus(
    withdrawalId: number,
    data: UpdateWithdrawalStatusRequest
  ): Promise<WithdrawalRequest> {
    try {
      const response = await apiClient.put(
        `/api/WithdrawalRequest/${withdrawalId}/status`,
        data
      );

      if (!response.success) {
        throw new Error(
          response.message || "Failed to update withdrawal status"
        );
      }

      const apiResponse = response.data as SingleWithdrawalApiResponse;

      if (apiResponse.error !== 0) {
        throw new Error(apiResponse.message || "API returned error");
      }

      return apiResponse.data;
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
      throw error;
    }
  }

  // Approve withdrawal request (wrapper for new API)
  async approveWithdrawalRequest(
    withdrawalId: number,
    billImageLink: string
  ): Promise<WithdrawalRequest> {
    return this.updateWithdrawalStatus(withdrawalId, {
      status: "approved",
      message: billImageLink,
    });
  }

  // Reject withdrawal request (wrapper for new API)
  async rejectWithdrawalRequest(
    withdrawalId: number,
    rejectionReason: string
  ): Promise<WithdrawalRequest> {
    return this.updateWithdrawalStatus(withdrawalId, {
      status: "rejected",
      message: rejectionReason,
    });
  }

  // Complete withdrawal request (wrapper for new API)
  async completeWithdrawalRequest(
    withdrawalId: number
  ): Promise<WithdrawalRequest> {
    return this.updateWithdrawalStatus(withdrawalId, {
      status: "completed",
    });
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

  // LEGACY: Process withdrawal request (deprecated but kept for compatibility)
  async processWithdrawalRequest(
    withdrawalId: number,
    data: any
  ): Promise<WithdrawalRequest> {
    console.warn(
      "processWithdrawalRequest is deprecated. Use updateWithdrawalStatus instead."
    );

    // Convert legacy format to new format
    if (data.status === "Approved") {
      return this.updateWithdrawalStatus(withdrawalId, {
        status: "approved",
        message: data.billImageLink || data.rejectionReason || "",
      });
    } else if (data.status === "Rejected") {
      return this.updateWithdrawalStatus(withdrawalId, {
        status: "rejected",
        message: data.rejectionReason || "",
      });
    } else if (data.status === "Completed") {
      return this.updateWithdrawalStatus(withdrawalId, {
        status: "completed",
      });
    }

    throw new Error("Invalid status for processing withdrawal");
  }
}

export const withdrawalService = new WithdrawalService();
