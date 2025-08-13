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
  | "EscrowHold"
  | "EscrowRelease"
  | "WalletTopUp"
  | "WalletTransfer"
  | "BookingPayment"
  | "Refund"
  | "Withdrawal"
  | "Commission"
  | "Purchase"; // Added new type from API response

export type TransactionStatus =
  | "Pending"
  | "Completed"
  | "Failed"
  | "Held"
  | "Released"
  | "Cancelled"
  | "Success"; // Added new status from API response

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
  completed: number;
  pending: number;
  held: number;
  failed: number;
  success: number; // Added for new status
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
