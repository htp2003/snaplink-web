// Enums
export enum ComplaintStatus {
  UNDER_REVIEW = "Under Review",
  RESOLVED = "Resolved",
  REJECTED = "Rejected",
}

// Base interfaces from API
export interface ComplaintResponse {
  complaintId: number;
  reporterId: number;
  reporterName?: string;
  reporterEmail?: string;
  reportedUserId: number;
  reportedUserName?: string;
  reportedUserEmail?: string;
  bookingId?: number;
  complaintType?: string;
  description?: string;
  status?: string;
  assignedModeratorId?: number;
  assignedModeratorName?: string;
  resolutionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplaintListResponse {
  complaints: ComplaintResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserInfoDto {
  userId: number;
  fullName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  status?: string;
}

export interface ModeratorInfoDto {
  moderatorId: number;
  fullName?: string;
  email?: string;
}

export interface ComplaintDetailResponse {
  complaintId: number;
  reporterId: number;
  reportedUserId: number;
  bookingId?: number;
  complaintType?: string;
  description?: string;
  status?: string;
  assignedModeratorId?: number;
  resolutionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  reporterInfo?: UserInfoDto;
  reportedUserInfo?: UserInfoDto;
  moderatorInfo?: ModeratorInfoDto;
}

// Request interfaces
export interface CreateComplaintRequest {
  reportedUserId: number;
  bookingId?: number;
  complaintType: string;
  description: string;
}

export interface UpdateComplaintRequest {
  complaintType?: string;
  description?: string;
  status?: string;
  assignedModeratorId?: number;
  resolutionNotes?: string;
}

export interface ResolveComplaintRequest {
  status: string;
  resolutionNotes: string;
}

export interface AssignModeratorRequest {
  moderatorId: number;
}

// UI specific interfaces
export interface ComplaintFilters {
  status?: string;
  complaintType?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// Hook return types
export interface UseComplaintManagementReturn {
  // Data
  complaints: ComplaintResponse[];
  complaintDetail: ComplaintDetailResponse | null;
  complaintTypes: string[];
  complaintStatuses: string[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };

  // Loading states
  loading: {
    list: boolean;
    detail: boolean;
    resolve: boolean;
    update: boolean;
    types: boolean;
    statuses: boolean;
  };

  // Filters
  filters: ComplaintFilters;

  // Actions
  fetchComplaints: (
    params?: PaginationParams & ComplaintFilters
  ) => Promise<void>;
  fetchComplaintDetail: (id: number) => Promise<void>;
  resolveComplaint: (
    id: number,
    data: ResolveComplaintRequest
  ) => Promise<boolean>;
  updateComplaint: (
    id: number,
    data: UpdateComplaintRequest
  ) => Promise<boolean>;
  updateComplaintStatus: (id: number, status: string) => Promise<boolean>;
  setFilters: (filters: Partial<ComplaintFilters>) => void;
  resetFilters: () => void;

  // Modal states
  modals: {
    detail: boolean;
    resolve: boolean;
  };

  setDetailModal: (open: boolean, complaintId?: number) => void;
  setResolveModal: (open: boolean, complaintId?: number) => void;

  // Selected complaint
  selectedComplaintId: number | null;
}

// Table column types
export interface ComplaintTableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number;
  sortable?: boolean;
  render?: (
    value: any,
    record: ComplaintResponse,
    index: number
  ) => React.ReactNode;
}

// Status badge colors
export const STATUS_COLORS = {
  [ComplaintStatus.UNDER_REVIEW]: "bg-yellow-100 text-yellow-800",
  [ComplaintStatus.RESOLVED]: "bg-green-100 text-green-800",
  [ComplaintStatus.REJECTED]: "bg-red-100 text-red-800",
} as const;
