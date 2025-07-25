// Dữ liệu người dùng giả lập
export const users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'user', status: 'active' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', role: 'photographer', status: 'active' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', role: 'venue_owner', status: 'active' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', role: 'user', status: 'inactive' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', role: 'photographer', status: 'pending' },
];

// Dữ liệu nội dung cần kiểm duyệt
export const contents = [
  {
    id: 1,
    type: 'photographer_profile',
    user: { name: 'Trần Thị B', email: 'tranthib@gmail.com' },
    title: 'Cập nhật hồ sơ nhiếp ảnh gia',
    description: 'Chuyên chụp ảnh cưới, ảnh sự kiện và ảnh thể thao',
    createdAt: '2025-05-15T10:30:00',
    status: 'pending'
  },
  {
    id: 2,
    type: 'venue_photos',
    user: { name: 'Lê Văn C', email: 'levanc@gmail.com' },
    title: 'Thêm ảnh cho địa điểm',
    description: 'Thêm 5 ảnh mới cho quán cafe',
    createdAt: '2025-05-14T14:20:00',
    status: 'pending'
  },
  {
    id: 3,
    type: 'photographer_portfolio',
    user: { name: 'Hoàng Văn E', email: 'hoangvane@gmail.com' },
    title: 'Thêm ảnh vào bộ sưu tập',
    description: 'Bộ ảnh nghệ thuật đường phố',
    createdAt: '2025-05-13T09:15:00',
    status: 'approved'
  },
];

// Dữ liệu thống kê
export const statistics = {
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

export const bookings = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    photographerName: 'Trần Thị B',
    venueName: 'Studio Ánh Sáng',
    date: '2025-05-25',
    time: '09:30',
    status: 'pending'
  },
  {
    id: 2,
    customerName: 'Lê Văn C',
    photographerName: 'Hoàng Văn E',
    venueName: 'Quán Cafe Sân Vườn',
    date: '2025-05-26',
    time: '14:00',
    status: 'confirmed'
  },
];

// Dữ liệu giao dịch
export const transactions = [
  {
    id: 1,
    relatedTo: 'Đặt chỗ #1',
    amount: 1500000,
    customerName: 'Nguyễn Văn A',
    type: 'payment',
    status: 'completed',
    date: '2025-05-10'
  },
  {
    id: 2,
    relatedTo: 'Đặt chỗ #2',
    amount: 1200000,
    customerName: 'Lê Văn C',
    type: 'payment',
    status: 'completed',
    date: '2025-05-12'
  }
];

export const authUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@snaplink.com',
    password: 'password',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Moderator',
    email: 'moderator@snaplink.com',
    password: 'password',
    role: 'moderator'
  }
];

// Dữ liệu thống kê cho Admin
export const adminStatistics = {
  totalUsers: 1250,
  totalPhotographers: 285,
  totalVenues: 150,
  totalBookings: 430,
  totalIncome: 35000000,
  revenueByMonth: [
    { month: 'T1', value: 25000000 },
    { month: 'T2', value: 28000000 },
    { month: 'T3', value: 32000000 },
    { month: 'T4', value: 30000000 },
    { month: 'T5', value: 35000000 },
    { month: 'T6', value: 38000000 },
    { month: 'T7', value: 42000000 }
  ],
  userGrowth: [
    { month: 'T1', value: 120 },
    { month: 'T2', value: 150 },
    { month: 'T3', value: 180 },
    { month: 'T4', value: 210 },
    { month: 'T5', value: 250 },
    { month: 'T6', value: 300 },
    { month: 'T7', value: 350 }
  ]
};

// Các thông số cấu hình hệ thống
export const systemSettings = {
  commissionRate: 10, // %
  photographerCommissionRate: 75, // %
  venueCommissionRate: 15, // %
  platformCommissionRate: 10, // %
  minWithdrawalAmount: 500000, // VND
  maxFileSize: 5, // MB
  maxImagesPerPortfolio: 20,
  maxImagesPerLocation: 15,
};