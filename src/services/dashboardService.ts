// services/dashboardService.ts - FIXED TO USE EXISTING SERVICES

import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "../config/api";
import { bookingService } from "./bookingService";
import { transactionService } from "./transactionService";
import { withdrawalService } from "./withdrawalService";
import { userService } from "./userService";
import {
  DashboardData,
  DashboardOverviewStats,
  DashboardChartsData,
  DashboardRecentActivities,
  DashboardQuickActions,
  TimeRange,
  RevenueDataPoint,
  UserGrowthDataPoint,
  BookingDataPoint,
  TopPhotographerData,
  TopLocationData,
  PaymentMethodData,
  RecentBookingActivity,
  RecentUserActivity,
  RecentTransactionActivity,
  RecentReviewActivity,
  PendingWithdrawalData,
  PendingVerificationData,
} from "../types/admin/Dashboard.types";

class DashboardService {
  // ========== MAIN DASHBOARD DATA ==========
  async getDashboardData(timeRange: TimeRange["key"]): Promise<DashboardData> {
    try {
      console.log(`Fetching dashboard data for: ${timeRange}`);

      const [overview, charts, activities, quickActions] = await Promise.all([
        this.getOverviewStats(timeRange).catch((err) => {
          console.warn("Overview stats failed:", err);
          return this.getEmptyOverviewStats();
        }),
        this.getChartsData(timeRange).catch((err) => {
          console.warn("Charts data failed:", err);
          return this.getEmptyChartsData();
        }),
        this.getRecentActivities(timeRange).catch((err) => {
          console.warn("Recent activities failed:", err);
          return this.getEmptyActivities();
        }),
        this.getQuickActions().catch((err) => {
          console.warn("Quick actions failed:", err);
          return this.getEmptyQuickActions();
        }),
      ]);

      console.log("Dashboard data loaded successfully");

      return {
        overview,
        charts,
        activities,
        quickActions,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Failed to fetch dashboard data");
    }
  }

  // ========== OVERVIEW STATISTICS - USING EXISTING SERVICES ==========
  async getOverviewStats(
    timeRange: TimeRange["key"]
  ): Promise<DashboardOverviewStats> {
    try {
      console.log("Loading overview stats using existing services...");

      // Use existing services and direct API calls for accurate counts
      const [
        allBookings,
        transactionStats,
        withdrawalStats,
        allUsersResponse,
        photographersCount,
        locationsCount,
        locationOwnersCount,
      ] = await Promise.allSettled([
        bookingService.getAllBookings(),
        transactionService.getTransactionStats(),
        withdrawalService.getWithdrawalStats(),
        userService.getAllUsers(),
        this.getPhotographersCount(),
        this.getLocationsCount(),
        this.getLocationOwnersCount(),
      ]);

      // Extract data safely
      const bookings =
        allBookings.status === "fulfilled" ? allBookings.value : [];
      const transStats =
        transactionStats.status === "fulfilled"
          ? transactionStats.value
          : {
              totalRevenue: 0,
              total: 0,
              pending: 0,
              success: 0,
              failed: 0,
            };
      const withStats =
        withdrawalStats.status === "fulfilled"
          ? withdrawalStats.value
          : {
              pending: 0,
              total: 0,
              totalAmount: 0,
            };
      const usersResponse =
        allUsersResponse.status === "fulfilled" &&
        allUsersResponse.value.success
          ? allUsersResponse.value.data
          : [];

      // Get actual counts from API responses
      const photographersTotal =
        photographersCount.status === "fulfilled"
          ? photographersCount.value
          : 0;
      const locationsTotal =
        locationsCount.status === "fulfilled" ? locationsCount.value : 0;
      const venueOwnersTotal =
        locationOwnersCount.status === "fulfilled"
          ? locationOwnersCount.value
          : 0;

      console.log("Data loaded:", {
        bookings: bookings.length,
        transactions: transStats.total,
        withdrawals: withStats.total,
        users: usersResponse.length,
        photographers: photographersTotal,
        locations: locationsTotal,
        venueOwners: venueOwnersTotal,
      });

      // Filter bookings by time range
      const filteredBookings = this.filterBookingsByTimeRange(
        bookings,
        timeRange
      );

      // Get user role counts (for moderators only, since we have direct counts for others)
      const usersByRole = this.getUserRoleCounts(usersResponse);

      // Get pending verifications
      const pendingVerifications = await this.getPendingVerifications();

      return {
        totalUsers: usersResponse.length,
        totalPhotographers: photographersTotal, // Direct from API
        totalVenueOwners: venueOwnersTotal, // Direct from API
        totalModerators: usersByRole.moderators,
        totalBookings: filteredBookings.length,
        totalRevenue: transStats.totalRevenue,
        totalLocations: locationsTotal, // Direct from API
        totalReviews: await this.getTotalReviews(),
        pendingWithdrawals: withStats.pending,
        pendingVerifications,
      };
    } catch (error) {
      console.error("Error fetching overview stats:", error);
      return this.getEmptyOverviewStats();
    }
  }

  // ========== CHARTS DATA ==========
  async getChartsData(
    timeRange: TimeRange["key"]
  ): Promise<DashboardChartsData> {
    try {
      console.log("Loading charts data...");

      const [
        revenueChart,
        userGrowthChart,
        bookingChart,
        topPhotographers,
        topLocations,
        paymentMethods,
      ] = await Promise.allSettled([
        this.getRevenueChartData(timeRange),
        this.getUserGrowthChartData(timeRange),
        this.getBookingChartData(timeRange),
        this.getTopPhotographers(),
        this.getTopLocations(),
        this.getPaymentMethodsDistribution(timeRange),
      ]);

      return {
        revenueChart: this.extractSettledResult(revenueChart) || [],
        userGrowthChart: this.extractSettledResult(userGrowthChart) || [],
        bookingChart: this.extractSettledResult(bookingChart) || [],
        topPhotographers: this.extractSettledResult(topPhotographers) || [],
        topLocations: this.extractSettledResult(topLocations) || [],
        paymentMethodsDistribution:
          this.extractSettledResult(paymentMethods) || [],
      };
    } catch (error) {
      console.error("Error fetching charts data:", error);
      return this.getEmptyChartsData();
    }
  }

  // ========== RECENT ACTIVITIES ==========
  async getRecentActivities(
    timeRange: TimeRange["key"]
  ): Promise<DashboardRecentActivities> {
    try {
      console.log("Loading recent activities...");

      const [bookings, transactionHistory, usersResponse] =
        await Promise.allSettled([
          bookingService.getAllBookings(),
          transactionService.getAllTransactions(1, 20),
          userService.getAllUsers(),
        ]);

      const allBookings = bookings.status === "fulfilled" ? bookings.value : [];
      const transactions =
        transactionHistory.status === "fulfilled"
          ? transactionHistory.value.transactions
          : [];
      const users =
        usersResponse.status === "fulfilled" && usersResponse.value.success
          ? usersResponse.value.data
          : [];

      // Get recent items
      const recentBookings = allBookings
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

      const recentUsers = users
        .sort(
          (a: any, b: any) =>
            new Date(b.createAt || b.createdAt).getTime() -
            new Date(a.createAt || a.createdAt).getTime()
        )
        .slice(0, 10);

      const recentTransactions = transactions
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

      return {
        recentBookings: this.transformRecentBookings(recentBookings),
        recentUsers: this.transformRecentUsers(recentUsers),
        recentTransactions:
          this.transformRecentTransactions(recentTransactions),
        recentReviews: [], // Add later if needed
      };
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return this.getEmptyActivities();
    }
  }

  // ========== QUICK ACTIONS ==========
  async getQuickActions(): Promise<DashboardQuickActions> {
    try {
      console.log("Loading quick actions...");

      const [withdrawals, verifications] = await Promise.allSettled([
        this.getPendingWithdrawals(),
        this.getPendingVerificationRequests(),
      ]);

      return {
        pendingWithdrawals: this.extractSettledResult(withdrawals) || [],
        pendingVerifications: this.extractSettledResult(verifications) || [],
        reportedContent: [], // Add later if needed
      };
    } catch (error) {
      console.error("Error fetching quick actions:", error);
      return this.getEmptyQuickActions();
    }
  }

  // ========== NEW METHODS TO GET ACTUAL COUNTS ==========

  private async getPhotographersCount(): Promise<number> {
    try {
      console.log("Fetching photographers count...");
      const response = await apiClient.get(API_ENDPOINTS.PHOTOGRAPHERS_ALL);

      if (response.success && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} photographers`);
        return response.data.length;
      }

      // Handle case where data is wrapped
      if (
        response.success &&
        response.data &&
        typeof response.data === "object"
      ) {
        if (response.data.error === 0 && Array.isArray(response.data.data)) {
          console.log(
            `Found ${response.data.data.length} photographers (wrapped)`
          );
          return response.data.data.length;
        }
      }

      console.warn("Photographers response format unexpected:", response);
      return 0;
    } catch (error) {
      console.error("Failed to fetch photographers count:", error);
      return 0;
    }
  }

  private async getLocationOwnersCount(): Promise<number> {
    try {
      console.log("Fetching location owners count...");
      const response = await apiClient.get(API_ENDPOINTS.LOCATION_OWNERS_ALL);

      if (response.success && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} location owners`);
        return response.data.length;
      }

      // Handle case where data is wrapped
      if (
        response.success &&
        response.data &&
        typeof response.data === "object"
      ) {
        if (response.data.error === 0 && Array.isArray(response.data.data)) {
          console.log(
            `Found ${response.data.data.length} location owners (wrapped)`
          );
          return response.data.data.length;
        }
      }

      console.warn("Location owners response format unexpected:", response);
      return 0;
    } catch (error) {
      console.error("Failed to fetch location owners count:", error);
      return 0;
    }
  }

  private async getLocationsCount(): Promise<number> {
    try {
      console.log("Fetching locations count...");
      const response = await apiClient.get(API_ENDPOINTS.LOCATIONS_ALL);

      if (response.success && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} locations`);
        return response.data.length;
      }

      // Handle case where data is wrapped
      if (
        response.success &&
        response.data &&
        typeof response.data === "object"
      ) {
        if (response.data.error === 0 && Array.isArray(response.data.data)) {
          console.log(`Found ${response.data.data.length} locations (wrapped)`);
          return response.data.data.length;
        }
      }

      console.warn("Locations response format unexpected:", response);
      return 0;
    } catch (error) {
      console.error("Failed to fetch locations count:", error);
      return 0;
    }
  }

  private getUserRoleCounts(users: any[]): {
    photographers: number;
    venueOwners: number;
    moderators: number;
  } {
    let moderators = 0;

    users.forEach((user) => {
      // Only count moderators from user data, others come from direct API calls
      if (
        user.moderators?.length > 0 ||
        user.userRoles?.some((role: any) =>
          role.role?.name?.toLowerCase().includes("moderator")
        )
      ) {
        moderators++;
      }
    });

    return {
      photographers: 0, // Will be overridden by direct API call
      venueOwners: 0, // Will be overridden by direct API call
      moderators,
    };
  }

  // ========== HELPER METHODS ==========

  private filterBookingsByTimeRange(
    bookings: any[],
    timeRange: TimeRange["key"]
  ) {
    if (timeRange === "all" || !bookings || !Array.isArray(bookings))
      return bookings || [];

    const now = new Date();
    const days = this.getTimeRangeDays(timeRange);
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= cutoffDate;
    });
  }

  private async getTotalReviews(): Promise<number> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS_ALL);
      if (response.success && Array.isArray(response.data)) {
        return response.data.length;
      }
      return 0;
    } catch (error) {
      console.warn("Failed to get total reviews:", error);
      return 0;
    }
  }

  private async getPendingVerifications(): Promise<number> {
    try {
      const response = await apiClient.get("/api/Photographer");
      if (response.success && Array.isArray(response.data)) {
        const pendingPhotographers = response.data.filter(
          (p: any) => p.verificationStatus === "pending"
        );
        return pendingPhotographers.length;
      }
      return 0;
    } catch (error) {
      console.warn("Error fetching pending verifications:", error);
      return 0;
    }
  }

  // Chart data methods using services
  private async getRevenueChartData(
    timeRange: TimeRange["key"]
  ): Promise<RevenueDataPoint[]> {
    try {
      const transactionHistory = await transactionService.getAllTransactions(
        1,
        1000
      );
      const transactions = transactionHistory.transactions;

      const filteredTransactions = this.filterTransactionsByTimeRange(
        transactions,
        timeRange
      );
      const groupedData = this.groupTransactionsByDate(filteredTransactions);

      return Object.entries(groupedData).map(([date, data]: [string, any]) => ({
        date,
        value: data.revenue,
        revenue: data.revenue,
        transactions: data.count,
      }));
    } catch (error) {
      console.warn("Error fetching revenue chart data:", error);
      return [];
    }
  }

  private async getUserGrowthChartData(
    timeRange: TimeRange["key"]
  ): Promise<UserGrowthDataPoint[]> {
    try {
      const usersResponse = await userService.getAllUsers();
      if (!usersResponse.success) return [];

      const users = usersResponse.data;
      const filteredUsers = this.filterUsersByTimeRange(users, timeRange);
      const groupedData = this.groupUsersByDate(filteredUsers);

      return Object.entries(groupedData).map(
        ([date, count]: [string, any]) => ({
          date,
          value: count,
          totalUsers: count,
          newUsers: count,
        })
      );
    } catch (error) {
      console.warn("Error fetching user growth chart data:", error);
      return [];
    }
  }

  private async getBookingChartData(
    timeRange: TimeRange["key"]
  ): Promise<BookingDataPoint[]> {
    try {
      const bookings = await bookingService.getAllBookings();
      const filteredBookings = this.filterBookingsByTimeRange(
        bookings,
        timeRange
      );
      const groupedData = this.groupBookingsByDate(filteredBookings);

      return Object.entries(groupedData).map(([date, data]: [string, any]) => ({
        date,
        value: data.total,
        totalBookings: data.total,
        completedBookings: data.completed,
        cancelledBookings: data.cancelled,
      }));
    } catch (error) {
      console.warn("Error fetching booking chart data:", error);
      return [];
    }
  }

  // Transform methods
  private transformRecentBookings(bookings: any[]): RecentBookingActivity[] {
    return bookings.map((booking) => ({
      id: booking.bookingId,
      bookingCode: `BK${booking.bookingId}`,
      customerName: booking.userName || "Unknown",
      photographerName: booking.photographerName || "Unknown",
      locationName: booking.locationName || "External Location",
      startTime: booking.startDatetime,
      totalAmount: booking.totalPrice || 0,
      status: booking.status,
      createdAt: booking.createdAt,
    }));
  }

  private transformRecentUsers(users: any[]): RecentUserActivity[] {
    return users.map((user) => ({
      id: user.userId,
      fullName: user.fullName || "Unknown",
      email: user.email || "",
      role: this.getUserPrimaryRole(user),
      avatar: user.profileImage,
      isVerified: user.emailVerified || false,
      createdAt: user.createAt || user.createdAt,
    }));
  }

  private transformRecentTransactions(
    transactions: any[]
  ): RecentTransactionActivity[] {
    return transactions.map((transaction) => ({
      id: transaction.transactionId,
      type: transaction.type || "payment",
      amount: transaction.amount || 0,
      description: transaction.note || transaction.type || "",
      status: transaction.status || "completed",
      userName: transaction.fromUserName || "Unknown",
      createdAt: transaction.createdAt,
    }));
  }

  private async getPendingWithdrawals(): Promise<PendingWithdrawalData[]> {
    try {
      const pendingWithdrawals =
        await withdrawalService.getWithdrawalRequestsByStatus("Pending", 1, 10);

      return pendingWithdrawals.withdrawalRequests.map((w: any) => ({
        id: w.id,
        userName: w.userName || "Unknown",
        amount: w.amount || 0,
        bankInfo: `${w.bankName || "Unknown"} - ${
          w.bankAccountNumber || "****"
        }`,
        requestedAt: w.requestedAt,
        status: w.requestStatus,
      }));
    } catch (error) {
      console.warn("Error fetching pending withdrawals:", error);
      return [];
    }
  }

  private async getPendingVerificationRequests(): Promise<
    PendingVerificationData[]
  > {
    try {
      const response = await apiClient.get("/api/Photographer");
      if (!response.success) return [];

      const pendingPhotographers = response.data
        .filter((p: any) => p.verificationStatus === "pending")
        .slice(0, 5);

      return pendingPhotographers.map((p: any) => ({
        id: p.photographerId || p.id,
        userName: p.user?.fullName || "Unknown",
        type: "photographer" as const,
        submittedAt: p.createdAt || new Date().toISOString(),
        documentsCount: 1,
      }));
    } catch (error) {
      console.warn("Error fetching pending verification requests:", error);
      return [];
    }
  }

  // Utility methods
  private getTimeRangeDays(timeRange: TimeRange["key"]): number {
    const timeRangeMap: Record<TimeRange["key"], number> = {
      "7d": 7,
      "30d": 30,
      "6m": 180,
      "1y": 365,
      all: 0,
    };
    return timeRangeMap[timeRange] || 30;
  }

  private filterTransactionsByTimeRange(
    transactions: any[],
    timeRange: TimeRange["key"]
  ) {
    if (timeRange === "all") return transactions;

    const now = new Date();
    const days = this.getTimeRangeDays(timeRange);
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate >= cutoffDate;
    });
  }

  private filterUsersByTimeRange(users: any[], timeRange: TimeRange["key"]) {
    if (timeRange === "all") return users;

    const now = new Date();
    const days = this.getTimeRangeDays(timeRange);
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return users.filter((user) => {
      const userDate = new Date(user.createAt || user.createdAt);
      return userDate >= cutoffDate;
    });
  }

  private groupTransactionsByDate(transactions: any[]) {
    return transactions.reduce((acc: any, transaction: any) => {
      const date = new Date(transaction.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { revenue: 0, count: 0 };
      }
      if (transaction.status === "Success" && transaction.type === "Purchase") {
        acc[date].revenue += transaction.amount || 0;
      }
      acc[date].count += 1;
      return acc;
    }, {});
  }

  private groupUsersByDate(users: any[]) {
    return users.reduce((acc: any, user: any) => {
      const date = new Date(user.createAt || user.createdAt)
        .toISOString()
        .split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }

  private groupBookingsByDate(bookings: any[]) {
    return bookings.reduce((acc: any, booking: any) => {
      const date = new Date(booking.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { total: 0, completed: 0, cancelled: 0 };
      }
      acc[date].total += 1;
      if (booking.status === "Completed") acc[date].completed += 1;
      if (booking.status === "Cancelled") acc[date].cancelled += 1;
      return acc;
    }, {});
  }

  private getUserPrimaryRole(user: any): string {
    if (user.administrators?.length) return "Admin";
    if (user.moderators?.length) return "Moderator";
    if (user.photographers?.length) return "Photographer";
    if (user.locationOwners?.length) return "Venue Owner";
    return "User";
  }

  private async getTopPhotographers(): Promise<TopPhotographerData[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PHOTOGRAPHERS_ALL);

      let photographers: any[] = [];

      if (response.success && Array.isArray(response.data)) {
        photographers = response.data;
      } else if (
        response.success &&
        response.data?.error === 0 &&
        Array.isArray(response.data.data)
      ) {
        photographers = response.data.data;
      }

      return photographers
        .filter((p) => p.rating || p.averageRating) // Only those with ratings
        .sort(
          (a: any, b: any) =>
            (b.averageRating || b.rating || 0) -
            (a.averageRating || a.rating || 0)
        )
        .slice(0, 5)
        .map((p: any) => ({
          id: p.photographerId || p.id,
          name: p.user?.fullName || p.fullName || "Unknown Photographer",
          avatar: p.user?.profileImage || p.profileImage,
          totalBookings: p.totalSessions || 0,
          averageRating: p.averageRating || p.rating || 0,
          totalEarnings: p.totalEarnings || 0,
        }));
    } catch (error) {
      console.warn("Error fetching top photographers:", error);
      return [];
    }
  }

  private async getTopLocations(): Promise<TopLocationData[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.LOCATIONS_ALL);

      let locations: any[] = [];

      if (response.success && Array.isArray(response.data)) {
        locations = response.data;
      } else if (
        response.success &&
        response.data?.error === 0 &&
        Array.isArray(response.data.data)
      ) {
        locations = response.data.data;
      }

      return locations
        .filter((l) => l.totalBookings || l.averageRating) // Only those with activity
        .sort(
          (a: any, b: any) => (b.totalBookings || 0) - (a.totalBookings || 0)
        )
        .slice(0, 5)
        .map((l: any) => ({
          id: l.locationId || l.id,
          name: l.name || "Unknown Location",
          image: l.primaryImage || l.imageUrl,
          totalBookings: l.totalBookings || 0,
          averageRating: l.averageRating || 0,
          totalRevenue: l.totalRevenue || 0,
        }));
    } catch (error) {
      console.warn("Error fetching top locations:", error);
      return [];
    }
  }

  private async getPaymentMethodsDistribution(
    timeRange: TimeRange["key"]
  ): Promise<PaymentMethodData[]> {
    try {
      const transactionHistory = await transactionService.getAllTransactions(
        1,
        1000
      );
      const transactions = transactionHistory.transactions;
      const filteredTransactions = this.filterTransactionsByTimeRange(
        transactions,
        timeRange
      );

      const methodCounts = filteredTransactions.reduce(
        (acc: any, transaction: any) => {
          const method = transaction.paymentMethod || "unknown";
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        },
        {}
      );

      const total = filteredTransactions.length;

      return Object.entries(methodCounts).map(
        ([method, count]: [string, any]) => ({
          method,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
          totalAmount: filteredTransactions
            .filter((t: any) => t.paymentMethod === method)
            .reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
        })
      );
    } catch (error) {
      console.warn("Error fetching payment methods distribution:", error);
      return [];
    }
  }

  private extractSettledResult(result: PromiseSettledResult<any>): any {
    return result.status === "fulfilled" ? result.value : null;
  }

  // Empty state methods
  private getEmptyOverviewStats(): DashboardOverviewStats {
    return {
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
    };
  }

  private getEmptyChartsData(): DashboardChartsData {
    return {
      revenueChart: [],
      userGrowthChart: [],
      bookingChart: [],
      topPhotographers: [],
      topLocations: [],
      paymentMethodsDistribution: [],
    };
  }

  private getEmptyActivities(): DashboardRecentActivities {
    return {
      recentBookings: [],
      recentUsers: [],
      recentTransactions: [],
      recentReviews: [],
    };
  }

  private getEmptyQuickActions(): DashboardQuickActions {
    return {
      pendingWithdrawals: [],
      pendingVerifications: [],
      reportedContent: [],
    };
  }

  // Debug method to test photographer and venue fetching
  async debugPhotographersAndVenues(): Promise<void> {
    console.log("Debug: Fetching photographers and venue data...");

    try {
      // Test photographers API
      console.log("Testing photographers API...");
      const photographersResponse = await apiClient.get(
        API_ENDPOINTS.PHOTOGRAPHERS_ALL
      );
      console.log("Photographers response:", photographersResponse);

      // Test location owners API
      console.log("Testing location owners API...");
      const locationOwnersResponse = await apiClient.get(
        API_ENDPOINTS.LOCATION_OWNERS_ALL
      );
      console.log("Location owners response:", locationOwnersResponse);

      // Test locations API
      console.log("Testing locations API...");
      const locationsResponse = await apiClient.get(
        API_ENDPOINTS.LOCATIONS_ALL
      );
      console.log("Locations response:", locationsResponse);

      // Test counts
      const photographersCount = await this.getPhotographersCount();
      const locationOwnersCount = await this.getLocationOwnersCount();
      const locationsCount = await this.getLocationsCount();

      console.log("Final counts:", {
        photographers: photographersCount,
        locationOwners: locationOwnersCount,
        locations: locationsCount,
      });
    } catch (error) {
      console.error("Debug failed:", error);
    }
  }
}

export const dashboardService = new DashboardService();
