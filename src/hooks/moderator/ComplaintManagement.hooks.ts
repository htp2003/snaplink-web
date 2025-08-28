import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { complaintService } from "../../services/complaintService";
import {
  ComplaintResponse,
  ComplaintDetailResponse,
  ComplaintFilters,
  PaginationParams,
  ResolveComplaintRequest,
  UpdateComplaintRequest,
  UseComplaintManagementReturn,
} from "../../types/moderator/ComplaintManagement.types";

export const useComplaintManagement = (): UseComplaintManagementReturn => {
  // Data states
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [complaintDetail, setComplaintDetail] =
    useState<ComplaintDetailResponse | null>(null);
  const [complaintTypes, setComplaintTypes] = useState<string[]>([]);
  const [complaintStatuses, setComplaintStatuses] = useState<string[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(
    null
  );

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter state
  const [filters, setFiltersState] = useState<ComplaintFilters>({});

  // Loading states
  const [loading, setLoading] = useState({
    list: false,
    detail: false,
    resolve: false,
    update: false,
    types: false,
    statuses: false,
  });

  // Modal states
  const [modals, setModals] = useState({
    detail: false,
    resolve: false,
  });

  // Set loading for specific operation
  const setLoadingState = useCallback(
    (key: keyof typeof loading, value: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Fetch complaints list
  const fetchComplaints = useCallback(
    async (params?: PaginationParams & ComplaintFilters) => {
      try {
        setLoadingState("list", true);

        const requestParams = {
          page: params?.page || pagination.current,
          pageSize: params?.pageSize || pagination.pageSize,
          ...filters,
          ...params,
        };

        const response = await complaintService.getComplaints(requestParams);

        setComplaints(response.complaints || []);
        setPagination({
          current: response.page,
          pageSize: response.pageSize,
          total: response.totalCount,
          totalPages: response.totalPages,
        });
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch complaints"
        );
        console.error("Fetch complaints error:", error);
      } finally {
        setLoadingState("list", false);
      }
    },
    []
  ); // Remove all dependencies to avoid infinite loop

  // Fetch complaint detail
  const fetchComplaintDetail = useCallback(
    async (id: number) => {
      try {
        setLoadingState("detail", true);
        const response = await complaintService.getComplaintDetail(id);
        setComplaintDetail(response);
        setSelectedComplaintId(id);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to fetch complaint details"
        );
        console.error("Fetch complaint detail error:", error);
      } finally {
        setLoadingState("detail", false);
      }
    },
    [setLoadingState]
  );

  // Resolve complaint
  const resolveComplaint = useCallback(
    async (id: number, data: ResolveComplaintRequest): Promise<boolean> => {
      try {
        setLoadingState("resolve", true);
        await complaintService.resolveComplaint(id, data);

        toast.success("Complaint resolved successfully");

        // Refresh complaints list
        await fetchComplaints();

        // Update detail if currently viewing this complaint
        if (selectedComplaintId === id) {
          await fetchComplaintDetail(id);
        }

        return true;
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to resolve complaint"
        );
        console.error("Resolve complaint error:", error);
        return false;
      } finally {
        setLoadingState("resolve", false);
      }
    },
    [
      fetchComplaints,
      fetchComplaintDetail,
      selectedComplaintId,
      setLoadingState,
    ]
  );

  // Update complaint
  const updateComplaint = useCallback(
    async (id: number, data: UpdateComplaintRequest): Promise<boolean> => {
      try {
        setLoadingState("update", true);
        await complaintService.updateComplaint(id, data);

        toast.success("Complaint updated successfully");

        // Refresh complaints list
        await fetchComplaints();

        // Update detail if currently viewing this complaint
        if (selectedComplaintId === id) {
          await fetchComplaintDetail(id);
        }

        return true;
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to update complaint"
        );
        console.error("Update complaint error:", error);
        return false;
      } finally {
        setLoadingState("update", false);
      }
    },
    [
      fetchComplaints,
      fetchComplaintDetail,
      selectedComplaintId,
      setLoadingState,
    ]
  );

  // Update complaint status
  const updateComplaintStatus = useCallback(
    async (id: number, status: string): Promise<boolean> => {
      try {
        setLoadingState("update", true);
        await complaintService.updateComplaintStatus(id, status);

        toast.success("Complaint status updated successfully");

        // Refresh complaints list
        await fetchComplaints();

        // Update detail if currently viewing this complaint
        if (selectedComplaintId === id) {
          await fetchComplaintDetail(id);
        }

        return true;
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to update complaint status"
        );
        console.error("Update complaint status error:", error);
        return false;
      } finally {
        setLoadingState("update", false);
      }
    },
    [
      fetchComplaints,
      fetchComplaintDetail,
      selectedComplaintId,
      setLoadingState,
    ]
  );

  // Set filters
  const setFilters = useCallback((newFilters: Partial<ComplaintFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    // Reset to first page when filtering
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  // Modal handlers
  const setDetailModal = useCallback(
    (open: boolean, complaintId?: number) => {
      setModals((prev) => ({ ...prev, detail: open }));
      if (open && complaintId) {
        fetchComplaintDetail(complaintId);
      } else if (!open) {
        setComplaintDetail(null);
        setSelectedComplaintId(null);
      }
    },
    [fetchComplaintDetail]
  );

  const setResolveModal = useCallback(
    (open: boolean, complaintId?: number) => {
      setModals((prev) => ({ ...prev, resolve: open }));
      if (open && complaintId) {
        setSelectedComplaintId(complaintId);
        // Fetch detail if not already loaded
        if (!complaintDetail || complaintDetail.complaintId !== complaintId) {
          fetchComplaintDetail(complaintId);
        }
      } else if (!open) {
        setSelectedComplaintId(null);
      }
    },
    [complaintDetail, fetchComplaintDetail]
  );

  // Fetch complaint types
  const fetchComplaintTypes = useCallback(async () => {
    try {
      setLoadingState("types", true);
      const types = await complaintService.getComplaintTypes();
      setComplaintTypes(types);
    } catch (error: any) {
      console.error("Fetch complaint types error:", error);
    } finally {
      setLoadingState("types", false);
    }
  }, [setLoadingState]);

  // Fetch complaint statuses
  const fetchComplaintStatuses = useCallback(async () => {
    try {
      setLoadingState("statuses", true);
      const statuses = await complaintService.getComplaintStatuses();
      setComplaintStatuses(statuses);
    } catch (error: any) {
      console.error("Fetch complaint statuses error:", error);
    } finally {
      setLoadingState("statuses", false);
    }
  }, [setLoadingState]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      // Load types and statuses first
      await Promise.all([fetchComplaintTypes(), fetchComplaintStatuses()]);

      // Then load complaints
      fetchComplaints();
    };

    loadInitialData();
  }, []); // Empty dependency array - only run once

  // Refetch when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchComplaints();
    }
  }, [filters]);

  return {
    // Data
    complaints,
    complaintDetail,
    complaintTypes,
    complaintStatuses,
    pagination,

    // Loading states
    loading,

    // Filters
    filters,

    // Actions
    fetchComplaints,
    fetchComplaintDetail,
    resolveComplaint,
    updateComplaint,
    updateComplaintStatus,
    setFilters,
    resetFilters,

    // Modal states
    modals,
    setDetailModal,
    setResolveModal,

    // Selected complaint
    selectedComplaintId,
  };
};
