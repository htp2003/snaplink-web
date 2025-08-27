// types/admin/Dashboard.types.ts

// Time Range Options
export interface TimeRange {
  key: "7d" | "30d" | "6m" | "1y" | "all";
  label: string;
  days: number | null; // null for 'all'
}

// Overview Statistics
export interface DashboardOverviewStats {
  totalUsers: number;
  totalPhotographers: number;
  totalVenueOwners: number;
  totalModerators: number;
  totalBookings: number;
  totalRevenue: number;
  totalLocations: number;
  totalReviews: number;
  pendingWithdrawals: number;
  pendingVerifications: number;
}

// Chart Data Points
export interface ChartDataPoint {
  date: string; // YYYY-MM-DD format
  value: number;
}

export interface RevenueDataPoint extends ChartDataPoint {
  revenue: number;
  transactions: number;
}

export interface UserGrowthDataPoint extends ChartDataPoint {
  totalUsers: number;
  newUsers: number;
}

export interface BookingDataPoint extends ChartDataPoint {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

// Charts Data
export interface DashboardChartsData {
  revenueChart: RevenueDataPoint[];
  userGrowthChart: UserGrowthDataPoint[];
  bookingChart: BookingDataPoint[];
  topPhotographers: TopPhotographerData[];
  topLocations: TopLocationData[];
  paymentMethodsDistribution: PaymentMethodData[];
}

// Top Performers
export interface TopPhotographerData {
  id: number;
  name: string;
  avatar?: string;
  totalBookings: number;
  averageRating: number;
  totalEarnings: number;
}

export interface TopLocationData {
  id: number;
  name: string;
  image?: string;
  totalBookings: number;
  averageRating: number;
  totalRevenue: number;
}

export interface PaymentMethodData {
  method: string;
  count: number;
  percentage: number;
  totalAmount: number;
}

// Recent Activities
export interface RecentActivity {
  id: number;
  type: "booking" | "user" | "transaction" | "review" | "withdrawal";
  timestamp: string;
  description: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
  amount?: number;
  status?: string;
}

export interface DashboardRecentActivities {
  recentBookings: RecentBookingActivity[];
  recentUsers: RecentUserActivity[];
  recentTransactions: RecentTransactionActivity[];
  recentReviews: RecentReviewActivity[];
}

export interface RecentBookingActivity {
  id: number;
  bookingCode: string;
  customerName: string;
  photographerName: string;
  locationName?: string;
  startTime: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface RecentUserActivity {
  id: number;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface RecentTransactionActivity {
  id: number;
  type: string;
  amount: number;
  description: string;
  status: string;
  userName: string;
  createdAt: string;
}

export interface RecentReviewActivity {
  id: number;
  rating: number;
  comment: string;
  reviewerName: string;
  targetName: string;
  targetType: "photographer" | "location";
  createdAt: string;
}

// Quick Actions Data
export interface DashboardQuickActions {
  pendingWithdrawals: PendingWithdrawalData[];
  pendingVerifications: PendingVerificationData[];
  reportedContent: ReportedContentData[];
}

export interface PendingWithdrawalData {
  id: number;
  userName: string;
  amount: number;
  bankInfo: string;
  requestedAt: string;
  status: string;
}

export interface PendingVerificationData {
  id: number;
  userName: string;
  type: "photographer" | "venue_owner";
  submittedAt: string;
  documentsCount: number;
}

export interface ReportedContentData {
  id: number;
  contentType: string;
  reporterName: string;
  targetName: string;
  reason: string;
  reportedAt: string;
  status: string;
}

// Combined Dashboard Data
export interface DashboardData {
  overview: DashboardOverviewStats;
  charts: DashboardChartsData;
  activities: DashboardRecentActivities;
  quickActions: DashboardQuickActions;
}

// API Response Types
export interface DashboardApiResponse {
  success: boolean;
  message?: string;
  data: DashboardData;
}

// Dashboard Filter Options
export interface DashboardFilters {
  timeRange: TimeRange["key"];
  userRole?: "all" | "user" | "photographer" | "venue_owner";
  bookingStatus?: "all" | "pending" | "confirmed" | "completed" | "cancelled";
  transactionType?: "all" | "booking" | "withdrawal" | "subscription";
}

// Hook Return Types
export interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filters: DashboardFilters;
  setFilters: (filters: Partial<DashboardFilters>) => void;
}

// Constants
export const TIME_RANGES: TimeRange[] = [
  { key: "7d", label: "7 ngày qua", days: 7 },
  { key: "30d", label: "30 ngày qua", days: 30 },
  { key: "6m", label: "6 tháng qua", days: 180 },
  { key: "1y", label: "1 năm qua", days: 365 },
  { key: "all", label: "Tất cả", days: null },
];

export const CHART_COLORS = {
  primary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#6366F1",
  secondary: "#6B7280",
};
