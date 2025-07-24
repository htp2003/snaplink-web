export interface ImageItem {
  id: number;
  url: string;
  photographerId?: number;
  locationId?: number;
  photographerEventId?: number;
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

export type ContentType = "images" | "reviews";
export type ContentStatus = "all" | "flagged" | "recent";
