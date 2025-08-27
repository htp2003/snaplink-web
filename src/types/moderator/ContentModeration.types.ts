// src/types/moderator/ContentModeration.types.ts - UPDATED WITH RATING MANAGEMENT

// ===== KEEP EXISTING TYPES (for backward compatibility) =====
export interface ImageItem {
  id: number;
  url: string;
  photographerId?: number;
  locationId?: number;
  eventId?: number; // Changed from photographerEventId
  isPrimary: boolean;
  caption?: string;
  createdAt: string;
}

// ===== NEW RATING TYPES (Replace ReviewItem) =====
export interface BookingInfo {
  id: number;
  bookingCode: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: BookingStatus;
  totalAmount: number;
  customer: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
  photographer: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
  venue?: {
    id: number;
    name: string;
    address: string;
  };
}

export interface RatingItem {
  id: number;
  bookingId: number;
  reviewerUserId: number;
  photographerId?: number;
  locationId?: number;
  score: number; // 1-5 rating
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  // Enhanced with booking info for moderation
  booking?: BookingInfo;
  reviewer?: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
  photographer?: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
  location?: {
    id: number;
    name: string;
    address: string;
  };
}

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

// ===== ADD NEW COMPREHENSIVE TYPES =====
export enum ModerationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged",
  UNDER_REVIEW = "under_review",
}

export enum VerificationStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
}

// Update ContentType to include ratings instead of reviews
export type ContentType =
  | "images"
  | "ratings" // Changed from "reviews"
  | "photographers"
  | "venues"
  | "events";

export type ContentStatus =
  | "all"
  | "flagged"
  | "recent"
  | "pending"
  | "approved"
  | "rejected";

// ===== PHOTOGRAPHER MODERATION =====
export interface PhotographerModerationItem {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  yearsExperience?: number;
  equipment?: string;
  portfolioImages: ImageItem[];
  verificationStatus: VerificationStatus;
  profileImage?: string;
  bio?: string;
  specialties?: string[];
  hourlyRate?: number;
  totalReviews: number;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

// ===== VENUE MODERATION =====
export interface VenueModerationItem {
  id: number;
  ownerId: number;
  ownerName: string;
  venueName: string;
  address: string;
  description?: string;
  hourlyRate?: number;
  capacity?: number;
  amenities?: string[];
  images: ImageItem[];
  isActive: boolean;
  featuredStatus: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

// ===== EVENT MODERATION =====
export interface EventModerationItem {
  id: number;
  locationId: number;
  locationName: string;
  eventName: string;
  description?: string;
  startDate: string;
  endDate: string;
  discountedPrice?: number;
  originalPrice?: number;
  maxPhotographers: number;
  images: ImageItem[];
  applicationsCount: number;
  bookingsCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ===== MODERATION STATS (Updated) =====
export interface ModerationStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  pendingPhotographers: number;
  pendingVenues: number;
  pendingEvents: number;
  pendingRatings: number; // Changed from pendingReviews
  flaggedImages: number;
  totalRatings: number; // New stat
}

// ===== API RESPONSE TYPES =====
export interface ModerationActionResponse {
  success: boolean;
  message: string;
  updatedItem?: any;
}

export interface ModerationListResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== RATING DTOs (Based on API) =====
export interface CreateRatingDto {
  bookingId: number;
  reviewerUserId: number;
  photographerId?: number;
  locationId?: number;
  score: number; // 1-5
  comment?: string;
}

export interface UpdateRatingDto {
  score?: number;
  comment?: string;
}

// ===== FILTERS & PAGINATION =====
export interface ModerationFilters {
  status?: ModerationStatus[];
  contentType?: ContentType[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  ratingScore?: number[]; // New filter for rating scores
  bookingStatus?: BookingStatus[]; // New filter for booking status
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ===== COMPONENT PROPS =====
export interface ModerationCardProps {
  item: any; // Will be more specific based on content type
  onApprove: (id: number, notes?: string) => void;
  onReject: (id: number, reason: string) => void;
  onViewDetails: (id: number) => void;
  loading?: boolean;
}

export interface ModerationTabProps {
  activeFilters: ModerationFilters;
  onFiltersChange: (filters: ModerationFilters) => void;
  refreshTrigger?: number;
}
