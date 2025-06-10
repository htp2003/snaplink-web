// mocks/dashboard.ts - Enhanced version
export interface DashboardStats {
  totalUsers: number;
  totalPhotographers: number;
  totalVenues: number;
  totalBookings: number;
  pendingApprovals: number;
  recentReports: number;
  monthlyRevenue: number;
  activeUsers: number;
}

export interface ChartData {
  name: string;
  value: number;
  users?: number;
  bookings?: number;
  revenue?: number;
}

export interface Activity {
  id: string;
  type: 'user_register' | 'content_upload' | 'booking_created' | 'report_created';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
}

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1250,
  totalPhotographers: 285,
  totalVenues: 150,
  totalBookings: 430,
  pendingApprovals: 15,
  recentReports: 8,
  monthlyRevenue: 45600000,
  activeUsers: 1180
};

export const mockBookingsByMonth: ChartData[] = [
  { name: 'T1', value: 80, bookings: 80 },
  { name: 'T2', value: 95, bookings: 95 },
  { name: 'T3', value: 100, bookings: 100 },
  { name: 'T4', value: 110, bookings: 110 },
  { name: 'T5', value: 115, bookings: 115 },
  { name: 'T6', value: 130, bookings: 130 },
  { name: 'T7', value: 140, bookings: 140 },
];

export const mockUserGrowth: ChartData[] = [
  { name: 'T1', value: 120, users: 120 },
  { name: 'T2', value: 150, users: 150 },
  { name: 'T3', value: 180, users: 180 },
  { name: 'T4', value: 210, users: 210 },
  { name: 'T5', value: 250, users: 250 },
  { name: 'T6', value: 300, users: 300 },
  { name: 'T7', value: 350, users: 350 },
];

export const mockRevenueByMonth: ChartData[] = [
  { name: 'T1', value: 25000000, revenue: 25000000 },
  { name: 'T2', value: 28000000, revenue: 28000000 },
  { name: 'T3', value: 32000000, revenue: 32000000 },
  { name: 'T4', value: 30000000, revenue: 30000000 },
  { name: 'T5', value: 35000000, revenue: 35000000 },
  { name: 'T6', value: 38000000, revenue: 38000000 },
  { name: 'T7', value: 42000000, revenue: 42000000 },
];

export const mockRecentActivities: Activity[] = [
  {
    id: '1',
    type: 'user_register',
    title: 'Người dùng mới đăng ký',
    description: 'Nguyễn Văn A đã tạo tài khoản nhiếp ảnh gia',
    user: 'Nguyễn Văn A',
    timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: '2',
    type: 'content_upload',
    title: 'Nội dung mới cần duyệt',
    description: 'Trần Thị B đã upload portfolio ảnh cưới',
    user: 'Trần Thị B',
    timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  {
    id: '3',
    type: 'booking_created',
    title: 'Booking mới được tạo',
    description: 'Lê Văn C đã đặt chụp ảnh tại Studio ABC',
    user: 'Lê Văn C',
    timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: '4',
    type: 'report_created',
    title: 'Báo cáo vi phạm mới',
    description: 'Báo cáo về nội dung không phù hợp từ nhiếp ảnh gia X',
    user: 'Phạm Thị D',
    timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  },
  {
    id: '5',
    type: 'user_register',
    title: 'Chủ địa điểm mới',
    description: 'Hoàng Văn E đã đăng ký làm chủ venue',
    user: 'Hoàng Văn E',
    timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: '6',
    type: 'content_upload',
    title: 'Ảnh venue mới',
    description: 'Cafe Sáng đã thêm 8 ảnh mới cho địa điểm',
    user: 'Cafe Sáng',
    timestamp: new Date(Date.now() - 90 * 60 * 1000) // 1.5 hours ago
  }
];

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};