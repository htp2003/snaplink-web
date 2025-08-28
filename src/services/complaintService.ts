import { apiClient } from "./apiClient";
import {
  ComplaintListResponse,
  ComplaintResponse,
  ComplaintDetailResponse,
  CreateComplaintRequest,
  UpdateComplaintRequest,
  ResolveComplaintRequest,
  PaginationParams,
  ComplaintFilters,
} from "../types/moderator/ComplaintManagement.types";

class ComplaintService {
  private baseUrl = "/api/Complaint";

  // Helper method to handle API response
  private handleApiResponse<T>(response: any): T {
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "API request failed");
    }
  }

  // Get list of complaints with pagination and filters
  async getComplaints(
    params: PaginationParams & ComplaintFilters = { page: 1, pageSize: 10 }
  ) {
    const {
      page,
      pageSize,
      status,
      complaintType,
      dateFrom,
      dateTo,
      search,
      ...otherFilters
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    if (status) queryParams.append("status", status);
    if (complaintType) queryParams.append("complaintType", complaintType);
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);
    if (search) queryParams.append("search", search);

    const response = await apiClient.get<ComplaintListResponse>(
      `${this.baseUrl}?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }

  // Get basic complaint info
  async getComplaintById(id: number) {
    const response = await apiClient.get<ComplaintResponse>(
      `${this.baseUrl}/${id}`
    );
    return this.handleApiResponse<ComplaintResponse>(response);
  }

  // Get detailed complaint info with user data
  async getComplaintDetail(id: number) {
    const response = await apiClient.get<ComplaintDetailResponse>(
      `${this.baseUrl}/${id}/detail`
    );
    return this.handleApiResponse<ComplaintDetailResponse>(response);
  }

  // Create new complaint (typically not used by moderator)
  async createComplaint(data: CreateComplaintRequest) {
    const response = await apiClient.post<ComplaintResponse>(
      this.baseUrl,
      data
    );
    return this.handleApiResponse<ComplaintResponse>(response);
  }

  // Update complaint details
  async updateComplaint(id: number, data: UpdateComplaintRequest) {
    const response = await apiClient.put<ComplaintResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
    return this.handleApiResponse<ComplaintResponse>(response);
  }

  // Resolve complaint với auto-assign moderator
  async resolveComplaint(
    id: number,
    data: ResolveComplaintRequest & { moderatorId?: number }
  ) {
    try {
      console.log("Starting resolve process for complaint:", id);

      // Nếu có moderatorId, assign moderator trước
      if (data.moderatorId) {
        console.log("Assigning moderator:", data.moderatorId);

        try {
          await this.assignModerator(id, data.moderatorId);
          console.log("Moderator assigned successfully");
        } catch (assignError) {
          console.warn(
            "Failed to assign moderator, continuing with resolve:",
            assignError
          );
          // Không throw error, có thể moderator đã được assign rồi
        }
      }

      // Sau đó resolve complaint
      const resolveData = {
        status: data.status,
        resolutionNotes: data.resolutionNotes,
      };

      console.log("Resolving complaint with data:", resolveData);

      const response = await apiClient.post<ComplaintResponse>(
        `${this.baseUrl}/${id}/resolve`,
        resolveData
      );

      console.log("Resolve response:", response);
      return this.handleApiResponse<ComplaintResponse>(response);
    } catch (error: any) {
      console.error("Resolve complaint error:", error);
      throw error;
    }
  }

  // Assign moderator method - back to moderatorId
  async assignModerator(id: number, moderatorId: number) {
    const response = await apiClient.post<ComplaintResponse>(
      `${this.baseUrl}/${id}/assign-moderator`,
      { moderatorId } // Back to moderatorId
    );
    return this.handleApiResponse<ComplaintResponse>(response);
  }

  // Update complaint status only
  async updateComplaintStatus(id: number, status: string) {
    const response = await apiClient.patch(
      `${this.baseUrl}/${id}/status`,
      status
    );
    return this.handleApiResponse(response);
  }

  // Delete complaint (admin only)
  async deleteComplaint(id: number) {
    const response = await apiClient.delete(`${this.baseUrl}/${id}`);
    return this.handleApiResponse(response);
  }

  // Get complaints by moderator (for assigned complaints)
  async getComplaintsByModerator(
    moderatorId: number,
    params: PaginationParams = { page: 1, pageSize: 10 }
  ) {
    const { page, pageSize } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    const response = await apiClient.get<ComplaintListResponse>(
      `${this.baseUrl}/by-moderator/${moderatorId}?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }

  // Get complaints by status
  async getComplaintsByStatus(
    status: string,
    params: PaginationParams = { page: 1, pageSize: 10 }
  ) {
    const { page, pageSize } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    const response = await apiClient.get<ComplaintListResponse>(
      `${this.baseUrl}/by-status/${status}?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }

  // Get complaints by reporter
  async getComplaintsByReporter(
    reporterId: number,
    params: PaginationParams = { page: 1, pageSize: 10 }
  ) {
    const { page, pageSize } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    const response = await apiClient.get<ComplaintListResponse>(
      `${this.baseUrl}/by-reporter/${reporterId}?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }

  // Get complaints by reported user
  async getComplaintsByReportedUser(
    reportedUserId: number,
    params: PaginationParams = { page: 1, pageSize: 10 }
  ) {
    const { page, pageSize } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    const response = await apiClient.get<ComplaintListResponse>(
      `${
        this.baseUrl
      }/by-reported-user/${reportedUserId}?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }

  // Get available complaint types
  async getComplaintTypes() {
    const response = await apiClient.get<string[]>(`${this.baseUrl}/types`);
    return this.handleApiResponse<string[]>(response);
  }

  // Get available complaint statuses
  async getComplaintStatuses() {
    const response = await apiClient.get<string[]>(`${this.baseUrl}/statuses`);
    return this.handleApiResponse<string[]>(response);
  }

  // Get user's own reports
  async getMyReports(params: PaginationParams = { page: 1, pageSize: 10 }) {
    const { page, pageSize } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    const response = await apiClient.get<ComplaintListResponse>(
      `${this.baseUrl}/my-reports?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }

  // Get complaints against current user
  async getComplaintsAgainstMe(
    params: PaginationParams = { page: 1, pageSize: 10 }
  ) {
    const { page, pageSize } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());

    const response = await apiClient.get<ComplaintListResponse>(
      `${this.baseUrl}/against-me?${queryParams.toString()}`
    );
    return this.handleApiResponse<ComplaintListResponse>(response);
  }
}

export const complaintService = new ComplaintService();
