// hooks/admin/useDashboard.ts - FIXED VERSION

import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../../services/dashboardService";
import {
  DashboardData,
  DashboardFilters,
  UseDashboardReturn,
  TimeRange,
  TIME_RANGES,
} from "../../types/admin/Dashboard.types";

export const useDashboard = (
  initialTimeRange: TimeRange["key"] = "30d"
): UseDashboardReturn => {
  // State management
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: initialTimeRange,
    userRole: "all",
    bookingStatus: "all",
    transactionType: "all",
  });

  // Fetch dashboard data with better error handling
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📊 Fetching dashboard data for: ${filters.timeRange}`);

      const dashboardData = await dashboardService.getDashboardData(
        filters.timeRange
      );

      console.log("✅ Dashboard data loaded:", dashboardData);
      setData(dashboardData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("❌ Dashboard data fetch error:", err);
      setError(errorMessage);

      // Set fallback data structure to prevent UI crashes
      setData({
        overview: {
          totalUsers: 0,
          totalPhotographers: 0,
          totalVenueOwners: 0,
          totalModerators: 0,
          totalBookings: 0,
          totalRevenue: 0,
          totalLocations: 0,
          totalReviews: 0,
          pendingWithdrawals: 0,
          pendingVerifications: 0,
        },
        charts: {
          revenueChart: [],
          userGrowthChart: [],
          bookingChart: [],
          topPhotographers: [],
          topLocations: [],
          paymentMethodsDistribution: [],
        },
        activities: {
          recentBookings: [],
          recentUsers: [],
          recentTransactions: [],
          recentReviews: [],
        },
        quickActions: {
          pendingWithdrawals: [],
          pendingVerifications: [],
          reportedContent: [],
        },
      });
    } finally {
      setLoading(false);
    }
  }, [filters.timeRange]); // Only depend on timeRange since other filters aren't used yet

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    console.log("🔧 Updating dashboard filters:", newFilters);
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Refetch data (useful for manual refresh)
  const refetch = useCallback(async () => {
    console.log("🔄 Manual dashboard refresh");
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Initial data fetch when component mounts or time range changes
  useEffect(() => {
    console.log(
      "🚀 Dashboard hook initializing with timeRange:",
      filters.timeRange
    );
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Optional: Auto-refresh every 10 minutes (disabled by default to avoid rate limiting)
  useEffect(() => {
    const shouldAutoRefresh = false; // Set to true if you want auto-refresh

    if (!shouldAutoRefresh) return;

    const intervalId = setInterval(() => {
      if (!loading) {
        // Only auto-refresh when not already loading
        console.log("⏰ Auto-refreshing dashboard data...");
        fetchDashboardData();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      console.log("🧹 Cleaning up dashboard auto-refresh");
      clearInterval(intervalId);
    };
  }, [fetchDashboardData, loading]);

  return {
    data,
    loading,
    error,
    refetch,
    filters,
    setFilters: updateFilters,
  };
};

// Specialized hooks for individual dashboard sections
export const useDashboardOverview = (timeRange: TimeRange["key"] = "30d") => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`📈 Fetching overview for: ${timeRange}`);

        const data = await dashboardService.getOverviewStats(timeRange);
        console.log("✅ Overview data loaded:", data);
        setOverview(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch overview";
        console.error("❌ Overview fetch error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [timeRange]);

  return { overview, loading, error };
};

export const useDashboardCharts = (timeRange: TimeRange["key"] = "30d") => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`📊 Fetching charts for: ${timeRange}`);

        const data = await dashboardService.getChartsData(timeRange);
        console.log("✅ Charts data loaded:", data);
        setCharts(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch charts";
        console.error("❌ Charts fetch error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, [timeRange]);

  return { charts, loading, error };
};

export const useDashboardActivities = (timeRange: TimeRange["key"] = "30d") => {
  const [activities, setActivities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`🕒 Fetching activities for: ${timeRange}`);

        const data = await dashboardService.getRecentActivities(timeRange);
        console.log("✅ Activities data loaded:", data);
        setActivities(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch activities";
        console.error("❌ Activities fetch error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [timeRange]);

  return { activities, loading, error };
};

// Hook for time range management
export const useTimeRange = (initialRange: TimeRange["key"] = "30d") => {
  const [currentTimeRange, setCurrentTimeRange] =
    useState<TimeRange["key"]>(initialRange);

  const getCurrentTimeRangeInfo = useCallback((): TimeRange => {
    return (
      TIME_RANGES.find((range) => range.key === currentTimeRange) ||
      TIME_RANGES[1]
    );
  }, [currentTimeRange]);

  const setTimeRange = useCallback(
    (range: TimeRange["key"]) => {
      console.log(`📅 Time range changed: ${currentTimeRange} → ${range}`);
      setCurrentTimeRange(range);
    },
    [currentTimeRange]
  );

  const getDateRange = useCallback(() => {
    const currentRange = getCurrentTimeRangeInfo();
    const endDate = new Date();

    if (currentRange.days === null) {
      return { startDate: null, endDate: null }; // All time
    }

    const startDate = new Date(
      endDate.getTime() - currentRange.days * 24 * 60 * 60 * 1000
    );

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }, [getCurrentTimeRangeInfo]);

  return {
    currentTimeRange,
    setTimeRange,
    getCurrentTimeRangeInfo,
    getDateRange,
    availableRanges: TIME_RANGES,
  };
};

// Utility hook for dashboard stats formatting
export const useDashboardFormatters = () => {
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: amount >= 1000000 ? "compact" : "standard",
    }).format(amount);
  }, []);

  const formatNumber = useCallback((num: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      notation: num >= 1000 ? "compact" : "standard",
    }).format(num);
  }, []);

  const formatPercentage = useCallback(
    (value: number, total: number): string => {
      if (total === 0) return "0%";
      const percentage = (value / total) * 100;
      return `${percentage.toFixed(1)}%`;
    },
    []
  );

  const formatDate = useCallback((dateString: string): string => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  }, []);

  const formatRelativeTime = useCallback(
    (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return "Vừa xong";
      if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
      if (diffInHours < 24) return `${diffInHours} giờ trước`;
      if (diffInDays < 7) return `${diffInDays} ngày trước`;

      return formatDate(dateString);
    },
    [formatDate]
  );

  return {
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatDate,
    formatRelativeTime,
  };
};

// Performance monitoring hook
export const useDashboardPerformance = () => {
  const [loadTimes, setLoadTimes] = useState<Record<string, number>>({});

  const measureLoadTime = useCallback((key: string, startTime: number) => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    setLoadTimes((prev) => ({
      ...prev,
      [key]: loadTime,
    }));

    console.log(`⏱️ ${key} loaded in ${loadTime.toFixed(2)}ms`);
  }, []);

  const startMeasurement = useCallback(
    (key: string) => {
      const startTime = performance.now();
      return () => measureLoadTime(key, startTime);
    },
    [measureLoadTime]
  );

  return {
    loadTimes,
    startMeasurement,
  };
};
