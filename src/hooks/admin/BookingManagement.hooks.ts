// src/hooks/admin/BookingManagement.hooks.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { bookingService } from "../../services/bookingService";
import {
  BookingData,
  BookingStats,
  BookingFilter,
  BookingStatus,
  SortField,
  SortOrder,
} from "../../types/admin/BookingManagement.types";

// Main hook for booking management
export const useBookingManagement = () => {
  const [bookingList, setBookingList] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);

  // Load all bookings
  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const bookings = await bookingService.getAllBookings();
      setBookingList(bookings);
      toast.success(`Loaded ${bookings.length} bookings successfully!`);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
      setBookingList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get booking details
  const getBookingDetails = async (
    bookingId: number
  ): Promise<BookingData | null> => {
    try {
      return await bookingService.getBookingById(bookingId);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      return null;
    }
  };

  // Update booking status
  const updateBookingStatus = async (
    bookingId: number,
    status: BookingStatus
  ): Promise<boolean> => {
    try {
      let success = false;

      switch (status) {
        case "Confirmed":
          success = await bookingService.confirmBooking(bookingId);
          break;
        case "Cancelled":
          success = await bookingService.cancelBooking(bookingId);
          break;
        case "Completed":
          success = await bookingService.completeBooking(bookingId);
          break;
        default:
          success = await bookingService.updateBooking(bookingId, { status });
      }

      if (success) {
        // Update local state
        setBookingList((prev) =>
          prev.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating booking status:", error);
      return false;
    }
  };

  // Bulk actions for selected bookings
  const bulkUpdateStatus = async (status: BookingStatus): Promise<boolean> => {
    if (selectedBookings.length === 0) {
      toast.error("Please select bookings first");
      return false;
    }

    try {
      const promises = selectedBookings.map((bookingId) =>
        updateBookingStatus(bookingId, status)
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(`${successCount} bookings updated successfully`);
        setSelectedBookings([]);
        return true;
      } else {
        toast.error("Failed to update bookings");
        return false;
      }
    } catch (error) {
      console.error("Error bulk updating bookings:", error);
      toast.error("Failed to update bookings");
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return {
    // Data
    bookingList,
    loading,
    selectedBookings,

    // Actions
    loadBookings,
    getBookingDetails,
    updateBookingStatus,
    bulkUpdateStatus,
    setSelectedBookings,
    setBookingList,
  };
};

// Hook for filters and sorting
export const useBookingFilters = (bookingList: BookingData[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get customer name safely
  const getCustomerName = (booking: BookingData): string => {
    return booking.customer?.fullName || "Unknown Customer";
  };

  // Get photographer name safely
  const getPhotographerName = (booking: BookingData): string => {
    return booking.photographer?.fullName || "Unknown Photographer";
  };

  // Get location name safely
  const getLocationName = (booking: BookingData): string => {
    return booking.location?.name || "External Location";
  };

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookingList.filter((booking) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const customerName = getCustomerName(booking).toLowerCase();
        const photographerName = getPhotographerName(booking).toLowerCase();
        const locationName = getLocationName(booking).toLowerCase();

        if (
          !customerName.includes(search) &&
          !photographerName.includes(search) &&
          !locationName.includes(search) &&
          !booking.bookingCode?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const bookingDate = new Date(booking.createdAt);
        const today = new Date();

        switch (dateFilter) {
          case "today":
            if (bookingDate.toDateString() !== today.toDateString())
              return false;
            break;
          case "this_week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (bookingDate < weekAgo) return false;
            break;
          case "this_month":
            if (
              bookingDate.getMonth() !== today.getMonth() ||
              bookingDate.getFullYear() !== today.getFullYear()
            )
              return false;
            break;
        }
      }

      return true;
    });

    // Sort bookings
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.startDatetime).getTime();
          bValue = new Date(b.startDatetime).getTime();
          break;
        case "customer":
          aValue = a.userName?.toLowerCase() || "";
          bValue = b.userName?.toLowerCase() || "";
          break;
        case "photographer":
          aValue = a.photographerName?.toLowerCase() || "";
          bValue = b.photographerName?.toLowerCase() || "";
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "amount":
          aValue = a.totalPrice || 0;
          bValue = b.totalPrice || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookingList, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  return {
    // Filters
    searchTerm,
    statusFilter,
    dateFilter,
    sortBy,
    sortOrder,

    // Setters
    setSearchTerm,
    setStatusFilter,
    setDateFilter,

    // Results
    filteredAndSortedBookings,

    // Helpers
    getCustomerName,
    getPhotographerName,
    getLocationName,
    handleSort,
    clearFilters,
  };
};

// Hook for booking statistics
export const useBookingStats = (bookingList: BookingData[]) => {
  const stats = useMemo(() => {
    return bookingService.calculateStats(bookingList);
  }, [bookingList]);

  return { stats };
};

// Hook for booking actions
export const useBookingActions = (
  loadBookings: () => Promise<void>,
  updateBookingStatus: (
    bookingId: number,
    status: BookingStatus
  ) => Promise<boolean>
) => {
  const [actionLoading, setActionLoading] = useState(false);

  const handleConfirmBooking = useCallback(
    async (bookingId: number) => {
      setActionLoading(true);
      try {
        const success = await updateBookingStatus(bookingId, "Confirmed");
        if (success) {
          toast.success("Booking confirmed successfully");
        } else {
          toast.error("Failed to confirm booking");
        }
        return success;
      } finally {
        setActionLoading(false);
      }
    },
    [updateBookingStatus]
  );

  const handleCancelBooking = useCallback(
    async (bookingId: number) => {
      setActionLoading(true);
      try {
        const success = await updateBookingStatus(bookingId, "Cancelled");
        if (success) {
          toast.success("Booking cancelled successfully");
        } else {
          toast.error("Failed to cancel booking");
        }
        return success;
      } finally {
        setActionLoading(false);
      }
    },
    [updateBookingStatus]
  );

  const handleCompleteBooking = useCallback(
    async (bookingId: number) => {
      setActionLoading(true);
      try {
        const success = await updateBookingStatus(bookingId, "Completed");
        if (success) {
          toast.success("Booking completed successfully");
        } else {
          toast.error("Failed to complete booking");
        }
        return success;
      } finally {
        setActionLoading(false);
      }
    },
    [updateBookingStatus]
  );

  return {
    actionLoading,
    handleConfirmBooking,
    handleCancelBooking,
    handleCompleteBooking,
  };
};
