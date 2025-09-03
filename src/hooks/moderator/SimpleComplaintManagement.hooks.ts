// Updated SimpleComplaintManagement.hooks.ts with better debugging
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { complaintService } from "../../services/complaintService";
import {
  photoDeliveryService,
  PhotoDeliveryResponse,
} from "../../services/photoDeliveryService";
import {
  ComplaintResponse,
  ComplaintDetailResponse,
  ComplaintFilters,
  ResolveComplaintRequest,
  UpdateComplaintRequest,
} from "../../types/moderator/ComplaintManagement.types";

export const useSimpleComplaintManagement = () => {
  // Data states
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [complaintDetail, setComplaintDetail] =
    useState<ComplaintDetailResponse | null>(null);
  const [photoDelivery, setPhotoDelivery] =
    useState<PhotoDeliveryResponse | null>(null);
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
    photoDelivery: false,
  });

  // Modal states
  const [modals, setModals] = useState({
    detail: false,
    resolve: false,
  });

  // Fetch complaints list
  const fetchComplaints = async (params?: any) => {
    try {
      setLoading((prev) => ({ ...prev, list: true }));

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
      setLoading((prev) => ({ ...prev, list: false }));
    }
  };

  // Fetch photo delivery data with better debugging
  const fetchPhotoDelivery = async (bookingId: number) => {
    console.log("🔍 Fetching photo delivery for booking ID:", bookingId);

    try {
      setLoading((prev) => ({ ...prev, photoDelivery: true }));

      const response = await photoDeliveryService.getPhotoDeliveryByBooking(
        bookingId
      );

      console.log("📸 Photo delivery response:", response);

      if (response) {
        console.log("✅ Photo delivery found:", {
          id: response.photoDeliveryId,
          driveLink: response.driveLink,
          status: response.status,
          photoCount: response.photoCount,
        });
        setPhotoDelivery(response);
      } else {
        console.log("❌ No photo delivery found for booking:", bookingId);
        setPhotoDelivery(null);
      }
    } catch (error: any) {
      console.error("💥 Photo delivery fetch error:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        message: error?.response?.data?.message,
        url: error?.config?.url,
      });
      setPhotoDelivery(null);

      // Show error toast only for real errors (not 404)
      if (error?.response?.status !== 404) {
        toast.error("Failed to fetch photo delivery information");
      }
    } finally {
      setLoading((prev) => ({ ...prev, photoDelivery: false }));
    }
  };

  // Fetch complaint detail
  const fetchComplaintDetail = async (id: number) => {
    try {
      setLoading((prev) => ({ ...prev, detail: true }));

      console.log("🔍 Fetching complaint detail for ID:", id);
      const response = await complaintService.getComplaintDetail(id);

      console.log("📋 Complaint detail response:", response);
      setComplaintDetail(response);
      setSelectedComplaintId(id);

      // If complaint has booking, fetch photo delivery
      if (response.bookingId) {
        console.log(
          "📷 Complaint has booking ID:",
          response.bookingId,
          "- fetching photo delivery"
        );
        await fetchPhotoDelivery(response.bookingId);
      } else {
        console.log(
          "❌ No booking ID in complaint, skipping photo delivery fetch"
        );
        setPhotoDelivery(null);
      }
    } catch (error: any) {
      console.error("fetchComplaintDetail error:", error);
      toast.error(error?.message || "Failed to fetch complaint details");
    } finally {
      setLoading((prev) => ({ ...prev, detail: false }));
    }
  };

  // Resolve complaint
  const resolveComplaint = async (
    id: number,
    data: ResolveComplaintRequest
  ): Promise<boolean> => {
    try {
      setLoading((prev) => ({ ...prev, resolve: true }));
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
      setLoading((prev) => ({ ...prev, resolve: false }));
    }
  };

  // Update complaint status
  const updateComplaintStatus = async (
    id: number,
    status: string
  ): Promise<boolean> => {
    try {
      setLoading((prev) => ({ ...prev, update: true }));
      await complaintService.updateComplaintStatus(id, status);

      toast.success("Complaint status updated successfully");

      // Refresh complaints list
      await fetchComplaints();

      return true;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update complaint status"
      );
      console.error("Update complaint status error:", error);
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  // Set filters
  const setFilters = (newFilters: Partial<ComplaintFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Reset filters
  const resetFilters = () => {
    setFiltersState({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Modal handlers
  const setDetailModal = (open: boolean, complaintId?: number) => {
    setModals((prev) => ({ ...prev, detail: open }));
    if (open && complaintId) {
      console.log("🔄 Opening detail modal for complaint:", complaintId);
      fetchComplaintDetail(complaintId);
    } else if (!open) {
      console.log("❌ Closing detail modal, clearing data");
      setComplaintDetail(null);
      setPhotoDelivery(null);
      setSelectedComplaintId(null);
    }
  };

  const setResolveModal = (open: boolean, complaintId?: number) => {
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
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load types and statuses
        setLoading((prev) => ({ ...prev, types: true, statuses: true }));

        const [types, statuses] = await Promise.all([
          complaintService.getComplaintTypes(),
          complaintService.getComplaintStatuses(),
        ]);

        setComplaintTypes(types);
        setComplaintStatuses(statuses);

        // Load complaints
        await fetchComplaints();
      } catch (error) {
        console.error("Load initial data error:", error);
      } finally {
        setLoading((prev) => ({ ...prev, types: false, statuses: false }));
      }
    };

    loadInitialData();
  }, []); // Empty dependency - only run once

  return {
    // Data
    complaints,
    complaintDetail,
    photoDelivery,
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
