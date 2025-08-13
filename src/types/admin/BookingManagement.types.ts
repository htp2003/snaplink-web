// src/types/admin/BookingManagement.types.ts

export interface BookingData {
  // API fields - exact match
  bookingId: number;
  userId: number;
  userName: string;
  userEmail: string;
  photographerId: number;
  photographerName: string;
  photographerEmail: string;
  locationId?: number;
  locationName?: string;
  locationAddress?: string;
  startDatetime: string;
  endDatetime: string;
  status:
    | "Pending"
    | "Confirmed"
    | "InProgress"
    | "Completed"
    | "Cancelled"
    | "Refunded";
  specialRequests?: string;
  totalPrice?: number;
  createdAt: string;
  updatedAt: string;
  hasPayment: boolean;
  paymentStatus: string;
  paymentAmount?: number;
  escrowBalance?: number;
  hasEscrowFunds: boolean;
  durationHours?: number;
  pricePerHour?: number;

  // Computed fields for compatibility
  id?: number; // Will map to bookingId
  totalAmount?: number; // Will map to totalPrice

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

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "Refunded";
export type SortField =
  | "date"
  | "customer"
  | "photographer"
  | "status"
  | "amount";
export type SortOrder = "asc" | "desc";
