// src/services/contentModerationService.ts - UPDATED VERSION

import { authService } from "./authService";
import {
  ImageItem,
  ReviewItem,
  PhotographerModerationItem,
  VenueModerationItem,
  EventModerationItem,
  ModerationStats,
  ModerationActionResponse,
  ModerationListResponse,
  ModerationFilters,
  PaginationParams,
  VerificationStatus,
} from "../types/moderator/ContentModeration.types";

const API_BASE =
  "https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net/api";

class ContentModerationService {
  private getHeaders() {
    const token = authService.getToken();
    console.log("🔑 Token:", token ? "Present" : "Missing");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // ===== REVERT TO WORKING APPROACH =====
  async getAllImages(): Promise<ImageItem[]> {
    try {
      console.log("🔄 Fetching all images from API endpoints...");

      const allImages: ImageItem[] = [];

      // 1. Get photographer images (all)
      try {
        const photographerImages = await this.getPhotographerImages();
        console.log("📸 Photographer images:", photographerImages.length);
        allImages.push(...photographerImages);
      } catch (error) {
        console.log("⚠️ Failed to get photographer images:", error);
      }

      // 2. Get location images (all)
      try {
        const locationImages = await this.getLocationImages();
        console.log("🏢 Location images:", locationImages.length);
        allImages.push(...locationImages);
      } catch (error) {
        console.log("⚠️ Failed to get location images:", error);
      }

      // 3. Get event images (all)
      try {
        const eventImages = await this.getEventImages();
        console.log("🎉 Event images:", eventImages.length);
        allImages.push(...eventImages);
      } catch (error) {
        console.log("⚠️ Failed to get event images:", error);
      }

      console.log("✅ Total images loaded:", allImages.length);
      return allImages;
    } catch (error) {
      console.error("💥 Error in getAllImages:", error);
      return [];
    }
  }

  private async getPhotographerImages(): Promise<ImageItem[]> {
    try {
      const photographersResponse = await fetch(`${API_BASE}/Photographer`, {
        headers: this.getHeaders(),
      });

      if (!photographersResponse.ok) {
        console.log("❌ Failed to get photographers");
        return [];
      }

      const photographers = await photographersResponse.json();
      if (!Array.isArray(photographers)) return [];

      console.log(
        `👥 Found photographers: ${photographers.length}, getting images for all`
      );

      const allPhotographerImages: ImageItem[] = [];

      for (const photographer of photographers) {
        const photographerId = photographer.photographerId || photographer.id;

        if (!photographerId) continue;

        try {
          console.log(`📸 Getting images for photographer ${photographerId}`);
          const imageResponse = await fetch(
            `${API_BASE}/Image/photographer/${photographerId}`,
            { headers: this.getHeaders() }
          );

          if (imageResponse.ok) {
            const images = await imageResponse.json();
            if (Array.isArray(images)) {
              console.log(
                `✅ Found ${images.length} images for photographer ${photographerId}`
              );
              allPhotographerImages.push(...images);
            }
          }
        } catch (error) {
          console.log(
            `💥 Error getting images for photographer ${photographerId}:`,
            error
          );
        }
      }

      return allPhotographerImages;
    } catch (error) {
      console.error("💥 Error getting photographer images:", error);
      return [];
    }
  }

  private async getLocationImages(): Promise<ImageItem[]> {
    try {
      const locationsResponse = await fetch(
        `${API_BASE}/Location/GetAllLocations`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!locationsResponse.ok) {
        console.log("❌ Failed to get locations");
        return [];
      }

      const locations = await locationsResponse.json();
      if (!Array.isArray(locations)) return [];

      console.log(
        `🏢 Found locations: ${locations.length}, getting images for all`
      );

      const allLocationImages: ImageItem[] = [];

      for (const location of locations) {
        const locationId = location.id || location.locationId;

        if (!locationId) continue;

        try {
          console.log(`🏢 Getting images for location ${locationId}`);
          const imageResponse = await fetch(
            `${API_BASE}/Image/location/${locationId}`,
            { headers: this.getHeaders() }
          );

          if (imageResponse.ok) {
            const images = await imageResponse.json();
            if (Array.isArray(images)) {
              console.log(
                `✅ Found ${images.length} images for location ${locationId}`
              );
              allLocationImages.push(...images);
            }
          }
        } catch (error) {
          console.log(
            `💥 Error getting images for location ${locationId}:`,
            error
          );
        }
      }

      return allLocationImages;
    } catch (error) {
      console.error("💥 Error getting location images:", error);
      return [];
    }
  }

  private async getEventImages(): Promise<ImageItem[]> {
    try {
      const eventsResponse = await fetch(`${API_BASE}/LocationEvent`, {
        headers: this.getHeaders(),
      });

      if (!eventsResponse.ok) {
        console.log("❌ Failed to get events");
        return [];
      }

      const events = await eventsResponse.json();
      if (!Array.isArray(events)) return [];

      console.log(`🎉 Found events: ${events.length}, getting images for all`);

      const allEventImages: ImageItem[] = [];

      for (const event of events) {
        const eventId = event.id || event.eventId || event.locationEventId;

        if (!eventId) continue;

        try {
          console.log(`🎉 Getting images for event ${eventId}`);
          const imageResponse = await fetch(
            `${API_BASE}/Image/event/${eventId}`,
            { headers: this.getHeaders() }
          );

          if (imageResponse.ok) {
            const images = await imageResponse.json();
            if (Array.isArray(images)) {
              console.log(
                `✅ Found ${images.length} images for event ${eventId}`
              );
              allEventImages.push(...images);
            }
          }
        } catch (error) {
          console.log(`💥 Error getting images for event ${eventId}:`, error);
        }
      }

      return allEventImages;
    } catch (error) {
      console.error("💥 Error getting event images:", error);
      return [];
    }
  }

  async getAllImagesSimple(): Promise<ImageItem[]> {
    try {
      console.log("🔄 Trying simple approach...");

      const testPhotographerId = 1;
      const response = await fetch(
        `${API_BASE}/Image/photographer/${testPhotographerId}`,
        {
          headers: this.getHeaders(),
        }
      );

      console.log("🖼️ Direct image test response:", response.status);

      if (response.ok) {
        const images = await response.json();
        console.log("✅ Direct images loaded:", images.length);
        return Array.isArray(images) ? images : [];
      } else {
        const errorText = await response.text();
        console.error("❌ Image API Error details:", errorText);
        throw new Error(`Image API failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("💥 Error in getAllImagesSimple:", error);
      throw error;
    }
  }

  async getAllReviews(): Promise<ReviewItem[]> {
    try {
      console.log("🔄 Fetching reviews...");

      const response = await fetch(`${API_BASE}/Review`, {
        headers: this.getHeaders(),
      });

      console.log("📊 Reviews response status:", response.status);

      if (!response.ok) {
        console.error("❌ Reviews API failed:", response.status);
        return this.getMockReviews();
      }

      const data = await response.json();
      console.log(
        "✅ Reviews loaded:",
        Array.isArray(data) ? data.length : "Not array"
      );
      return Array.isArray(data) ? data : this.getMockReviews();
    } catch (error) {
      console.error("💥 Error in getAllReviews:", error);
      return this.getMockReviews();
    }
  }

  async deleteImage(imageId: number): Promise<boolean> {
    try {
      console.log("🗑️ Deleting image:", imageId);

      const response = await fetch(`${API_BASE}/Image/${imageId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      console.log("📊 Delete image response:", response.status);
      return response.ok;
    } catch (error) {
      console.error("💥 Error deleting image:", error);
      return false;
    }
  }

  async deleteReview(reviewId: number): Promise<boolean> {
    try {
      console.log("🗑️ Deleting review:", reviewId);

      const response = await fetch(`${API_BASE}/Review/${reviewId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      console.log("📊 Delete review response:", response.status);
      return response.ok;
    } catch (error) {
      console.error("💥 Error deleting review:", error);
      return false;
    }
  }

  async setImagePrimary(imageId: number): Promise<boolean> {
    try {
      console.log("⭐ Setting image primary:", imageId);

      const response = await fetch(`${API_BASE}/Image/${imageId}/set-primary`, {
        method: "PUT",
        headers: this.getHeaders(),
      });

      console.log("📊 Set primary response:", response.status);
      return response.ok;
    } catch (error) {
      console.error("💥 Error setting image primary:", error);
      return false;
    }
  }

  // ===== NEW MODERATION METHODS =====

  // Dashboard Stats
  async getModerationStats(): Promise<ModerationStats> {
    try {
      console.log("📊 Fetching moderation stats...");

      // Fetch counts from different endpoints
      const [photographers, venues, events, reviews] = await Promise.all([
        this.getPhotographersForModeration({ page: 1, pageSize: 1 }),
        this.getVenuesForModeration({ page: 1, pageSize: 1 }),
        this.getEventsForModeration({ page: 1, pageSize: 1 }),
        this.getReviewsForModeration({ page: 1, pageSize: 1 }),
      ]);

      // Calculate stats based on actual data
      return {
        totalPending: 28, // Mock for now
        totalApproved: 156,
        totalRejected: 12,
        pendingPhotographers: photographers.totalCount || 0,
        pendingVenues: venues.totalCount || 0,
        pendingEvents: events.totalCount || 0,
        pendingReviews: reviews.totalCount || 0,
        flaggedImages: 3, // Mock for now
      };
    } catch (error) {
      console.error("Error fetching moderation stats:", error);
      // Return mock data on error
      return {
        totalPending: 28,
        totalApproved: 156,
        totalRejected: 12,
        pendingPhotographers: 12,
        pendingVenues: 5,
        pendingEvents: 3,
        pendingReviews: 8,
        flaggedImages: 3,
      };
    }
  }

  // Photographer Moderation
  async getPhotographersForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 10 },
    filters: ModerationFilters = {}
  ): Promise<ModerationListResponse<PhotographerModerationItem>> {
    try {
      console.log("👥 Fetching photographers for moderation...");

      const response = await fetch(`${API_BASE}/Photographer`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Photographers API failed: ${response.status}`);
      }

      const data = await response.json();
      const photographers = Array.isArray(data) ? data : [];

      // Transform to our format
      const items: PhotographerModerationItem[] = photographers.map(
        (photographer: any) => ({
          id: photographer.id,
          userId: photographer.userId,
          fullName: photographer.user?.fullName || "Unknown",
          email: photographer.user?.email || "",
          phoneNumber: photographer.user?.phoneNumber,
          yearsExperience: photographer.yearsExperience,
          equipment: photographer.equipment,
          portfolioImages: [], // Will be fetched separately if needed
          verificationStatus: photographer.verificationStatus || "pending",
          profileImage: photographer.user?.profileImage,
          bio: photographer.user?.bio,
          specialties: [], // Would need to be parsed from API
          hourlyRate: photographer.hourlyRate,
          totalReviews: photographer.ratingCount || 0,
          averageRating: photographer.rating || 0,
          createdAt: photographer.createdAt,
          updatedAt: photographer.updatedAt,
        })
      );

      return {
        items,
        totalCount: items.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(items.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("Error fetching photographers for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  async verifyPhotographer(
    photographerId: number,
    status: VerificationStatus,
    notes?: string
  ): Promise<ModerationActionResponse> {
    try {
      console.log(`✅ Verifying photographer ${photographerId} as ${status}`);

      const response = await fetch(
        `${API_BASE}/Photographer/${photographerId}/verify`,
        {
          method: "PATCH",
          headers: this.getHeaders(),
          body: JSON.stringify({ status, notes }),
        }
      );

      if (response.ok) {
        return {
          success: true,
          message: `Photographer ${status} successfully`,
        };
      } else {
        return {
          success: false,
          message: `Failed to verify photographer: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("Error verifying photographer:", error);
      return {
        success: false,
        message: "Failed to verify photographer",
      };
    }
  }

  // Venue Moderation (simplified for now)
  async getVenuesForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 10 },
    filters: ModerationFilters = {}
  ): Promise<ModerationListResponse<VenueModerationItem>> {
    try {
      const response = await fetch(`${API_BASE}/Location/GetAllLocations`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Venues API failed: ${response.status}`);
      }

      const data = await response.json();
      const venues = Array.isArray(data) ? data : [];

      const items: VenueModerationItem[] = venues.map((venue: any) => ({
        id: venue.id,
        ownerId: venue.locationOwnerId,
        ownerName: venue.locationOwner?.user?.fullName || "Unknown",
        venueName: venue.name,
        address: venue.address,
        description: venue.description,
        hourlyRate: venue.hourlyRate,
        capacity: venue.capacity,
        amenities: venue.amenities ? venue.amenities.split(",") : [],
        images: [],
        isActive: venue.availabilityStatus === "available",
        featuredStatus: venue.featuredStatus,
        verificationStatus: venue.verificationStatus || "pending",
        createdAt: venue.createdAt,
        updatedAt: venue.updatedAt,
      }));

      return {
        items,
        totalCount: items.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(items.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("Error fetching venues for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  // Event Moderation
  async getEventsForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 10 },
    filters: ModerationFilters = {}
  ): Promise<ModerationListResponse<EventModerationItem>> {
    try {
      const response = await fetch(`${API_BASE}/LocationEvent`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Events API failed: ${response.status}`);
      }

      const data = await response.json();
      const events = Array.isArray(data) ? data : [];

      const items: EventModerationItem[] = events.map((event: any) => ({
        id: event.id,
        locationId: event.locationId,
        locationName: event.location?.name || "Unknown",
        eventName: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        discountedPrice: event.discountedPrice,
        originalPrice: event.originalPrice,
        maxPhotographers: event.maxPhotographers,
        images: [],
        applicationsCount: 0, // Would need separate API call
        bookingsCount: 0, // Would need separate API call
        status: event.status,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }));

      return {
        items,
        totalCount: items.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(items.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("Error fetching events for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  // Review Moderation
  async getReviewsForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 10 },
    filters: ModerationFilters = {}
  ): Promise<ModerationListResponse<ReviewItem>> {
    try {
      const reviews = await this.getAllReviews();

      return {
        items: reviews,
        totalCount: reviews.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(reviews.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("Error fetching reviews for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  // ===== EXISTING METHODS (Keep for backward compatibility) =====
  async testAPIConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🧪 Testing API connection...");

      const response = await fetch(`${API_BASE}/User/all`, {
        headers: this.getHeaders(),
      });

      console.log("🔍 Test API Response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `API connected successfully. Users count: ${
            Array.isArray(data) ? data.length : "Unknown"
          }`,
        };
      } else {
        const errorText = await response.text();
        console.error("❌ API Error details:", errorText);

        return {
          success: false,
          message: `API Error: ${response.status} ${response.statusText}. Details: ${errorText}`,
        };
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      return {
        success: false,
        message: `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private getMockReviews(): ReviewItem[] {
    return [
      {
        id: 1,
        rating: 5,
        comment: "Excellent service!",
        reviewerId: 1,
        revieweeId: 1,
        revieweeType: "photographer",
        createdAt: new Date().toISOString(),
      },
    ];
  }
}

export const contentModerationService = new ContentModerationService();
