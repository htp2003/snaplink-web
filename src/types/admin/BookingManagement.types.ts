// src/types/admin/BookingManagement.types.ts

export interface BookingData {
  id: number;
  bookingCode?: string;
  userId: number;
  photographerId: number;
  locationId?: number;
  startDatetime: string;
  endDatetime: string;
  durationHours?: number;
  photographerFee?: number;
  venueFee?: number;
  totalAmount?: number;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "refunded";
  specialRequests?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  confirmedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Populated data từ User service
  customer?: {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  photographer?: {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    hourlyRate?: number;
  };
  location?: {
    id: number;
    name: string;
    address: string;
    hourlyRate?: number;
  };
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  inProgress: number;
  refunded: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageBookingValue: number;
}

export interface BookingFilter {
  status?: string;
  startDate?: string;
  endDate?: string;
  photographerId?: number;
  userId?: number;
  locationId?: number;
  searchTerm?: string;
}

export interface UpdateBookingRequest {
  startDatetime?: string;
  endDatetime?: string;
  specialRequests?: string;
  status?: string;
}

export type BookingStatus = BookingData["status"];
export type SortField =
  | "date"
  | "customer"
  | "photographer"
  | "status"
  | "amount";
export type SortOrder = "asc" | "desc";
