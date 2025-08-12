// src/types/moderator/ContentModeration.types.ts - UPDATED VERSION

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

export interface ReviewItem {
  id: number;
  rating: number;
  comment: string;
  reviewerId: number;
  revieweeId: number;
  revieweeType: string;
  createdAt: string;
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

// Update ContentType to include all moderation areas
export type ContentType =
  | "images"
  | "reviews"
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

// ===== NEW PHOTOGRAPHER MODERATION =====
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

// ===== NEW VENUE MODERATION =====
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

// ===== NEW EVENT MODERATION =====
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

// ===== MODERATION STATS =====
export interface ModerationStats {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  pendingPhotographers: number;
  pendingVenues: number;
  pendingEvents: number;
  pendingReviews: number;
  flaggedImages: number;
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

// ===== FILTERS & PAGINATION =====
export interface ModerationFilters {
  status?: ModerationStatus[];
  contentType?: ContentType[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
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
