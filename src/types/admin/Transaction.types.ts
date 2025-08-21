// types/admin/Transaction.types.ts

export interface Transaction {
  transactionId: number;
  referencePaymentId?: number | null;
  fromUserId?: number | null;
  fromUserName?: string | null;
  toUserId?: number | null;
  toUserName?: string | null;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
}

export type TransactionType =
  | "Purchase" // Giao dịch chính: Người dùng thanh toán cho đơn hàng
  | "PhotographerFee" // Phí phân bổ cho thợ chụp hình
  | "VenueFee" // Phí phân bổ cho nơi cho thuê địa điểm
  | "PlatformFee" // Phí phân bổ cho nền tảng
  | "Refund" // Hoàn tiền
  | "Deposit" // Nạp tiền vào ví
  | "Withdrawal" // Rút tiền từ ví
  | "EscrowHold" // Tiền được giữ trong escrow
  | "EscrowRelease" // Tiền được giải phóng từ escrow
  | "EscrowRefund"; // Hoàn tiền từ escrow

export type TransactionStatus =
  | "Pending" // Đang xử lý
  | "Success" // Thành công
  | "Failed" // Thất bại
  | "Held" // Tiền đang được giữ trong escrow
  | "Released"; // Tiền đã được giải phóng từ escrow

export interface TransactionFilters {
  searchTerm: string;
  status: TransactionStatus | "all";
  type: TransactionType | "all";
  dateRange: "all" | "today" | "yesterday" | "this_week" | "this_month";
  page: number;
  pageSize: number;
}

export interface TransactionStats {
  total: number;
  completed: number; // Deprecated - kept for backward compatibility
  pending: number;
  held: number;
  failed: number;
  success: number; // New primary success status
  totalRevenue: number;
  totalRefunded: number;
  todayRevenue: number;
}

export interface TransactionHistoryParams {
  userId: number;
  page?: number;
  pageSize?: number;
  year?: number;
  month?: number;
}

export interface TransactionHistoryResponse {
  transactions: Transaction[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface TransactionApiResponse {
  error: number;
  message: string;
  data: {
    transactions: Transaction[];
    totalCount?: number;
    totalPages?: number;
    currentPage?: number;
  };
}

export interface SimpleTransactionApiResponse {
  error: number;
  message: string;
  data: {
    transactions: Transaction[];
  };
}

export interface SingleTransactionApiResponse {
  error: number;
  message: string;
  data: Transaction;
}

export interface MonthlyIncomeResponse {
  userId: number;
  year: number;
  month: number;
  totalIncome: number;
  transactionCount: number;
}

// Simple transaction for display in UI
export interface SimpleTransaction {
  id: number;
  customerName: string;
  amount: number;
  type: string;
  status: TransactionStatus;
  date: string;
  relatedTo: string;
}

// Helper type mappings for UI display
export const TransactionTypeDisplayMap: Record<TransactionType, string> = {
  Purchase: "Mua hàng",
  PhotographerFee: "Phí nhiếp ảnh gia",
  VenueFee: "Phí địa điểm",
  PlatformFee: "Phí nền tảng",
  Refund: "Hoàn tiền",
  Deposit: "Nạp ví",
  Withdrawal: "Rút tiền",
  EscrowHold: "Ký quỹ",
  EscrowRelease: "Giải phóng ký quỹ",
  EscrowRefund: "Hoàn tiền ký quỹ",
};

export const TransactionStatusDisplayMap: Record<TransactionStatus, string> = {
  Pending: "Đang xử lý",
  Success: "Thành công",
  Failed: "Thất bại",
  Held: "Đang giữ",
  Released: "Đã giải phóng",
};

// Status colors for UI
export const TransactionStatusColorMap: Record<TransactionStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Success: "bg-green-100 text-green-800",
  Failed: "bg-red-100 text-red-800",
  Held: "bg-blue-100 text-blue-800",
  Released: "bg-green-100 text-green-800",
};

// Transaction types that can be refunded
export const RefundableTransactionTypes: TransactionType[] = [
  "Purchase",
  "PhotographerFee",
  "VenueFee",
];

// Transaction statuses that allow refund
export const RefundableTransactionStatuses: TransactionStatus[] = [
  "Success",
  "Released",
];
