export interface DashboardStats {
  totalUsers: number;
  totalPhotographers: number;
  totalVenues: number;
  totalBookings: number;
  pendingApprovals: number;
  recentReports: number;
  bookingsByMonth?: Array<{ name: string; value: number }>;
}

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1250,
  totalPhotographers: 285,
  totalVenues: 150,
  totalBookings: 430,
  pendingApprovals: 15,
  recentReports: 8,
  bookingsByMonth: [
    { name: 'T1', value: 80 },
    { name: 'T2', value: 95 },
    { name: 'T3', value: 100 },
    { name: 'T4', value: 110 },
    { name: 'T5', value: 115 },
    { name: 'T6', value: 130 },
    { name: 'T7', value: 140 },
  ],
};