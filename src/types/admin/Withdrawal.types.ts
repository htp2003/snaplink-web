// types/admin/Withdrawal.types.ts

export interface WithdrawalRequest {
  id: number;
  walletId: number;
  amount: number;
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  requestStatus: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string | null;
  processedByModeratorId?: number | null;
  rejectionReason?: string | null;
  userId: number;
  userName: string;
  userEmail: string;
  walletBalance: number;
  // New field for bill image link
  billImageLink?: string | null;
}

export type WithdrawalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed"
  | "Processing";

export interface WithdrawalFilters {
  searchTerm: string;
  status: WithdrawalStatus | "all";
  dateRange: "all" | "today" | "yesterday" | "this_week" | "this_month";
  page: number;
  pageSize: number;
}

export interface WithdrawalStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  totalAmount: number;
  todayAmount: number;
}

export interface WithdrawalResponse {
  withdrawalRequests: WithdrawalRequest[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface WithdrawalApiResponse {
  error: number;
  message: string;
  data: WithdrawalResponse;
}

export interface SingleWithdrawalApiResponse {
  error: number;
  message: string;
  data: WithdrawalRequest;
}

// New types for v12 API
export interface UpdateWithdrawalStatusRequest {
  status: "approved" | "rejected" | "completed";
  message?: string; // Required for approved/rejected, optional for completed
}

export interface CreateWithdrawalRequest {
  amount: number;
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
}

export interface UpdateWithdrawalRequest {
  amount?: number;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankName?: string;
}

// Legacy type - kept for backward compatibility but deprecated
export interface ProcessWithdrawalRequest {
  status: WithdrawalStatus;
  rejectionReason?: string;
}

// For UI display
export interface SimpleWithdrawal {
  id: number;
  userName: string;
  userEmail: string;
  amount: number;
  bankInfo: string;
  status: WithdrawalStatus;
  requestedAt: string;
  walletBalance: number;
}
