// src/services/contentModerationService.ts - UPDATED FOR STRUCTURED NAVIGATION

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

  // ===== IMAGE METHODS (Keep existing approach) =====
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

  // ===== NEW: SPECIFIC IMAGE METHODS FOR INDIVIDUAL ITEMS =====
  async getImagesForPhotographer(photographerId: number): Promise<ImageItem[]> {
    try {
      console.log(`📸 Getting images for photographer ${photographerId}`);
      const response = await fetch(
        `${API_BASE}/Image/photographer/${photographerId}`,
        { headers: this.getHeaders() }
      );

      if (response.ok) {
        const images = await response.json();
        console.log(
          `✅ Found ${images.length} images for photographer ${photographerId}`
        );
        return Array.isArray(images) ? images : [];
      }
      return [];
    } catch (error) {
      console.error(
        `💥 Error getting images for photographer ${photographerId}:`,
        error
      );
      return [];
    }
  }

  async getImagesForLocation(locationId: number): Promise<ImageItem[]> {
    try {
      console.log(`🏢 Getting images for location ${locationId}`);
      const response = await fetch(`${API_BASE}/Image/location/${locationId}`, {
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const images = await response.json();
        console.log(
          `✅ Found ${images.length} images for location ${locationId}`
        );
        return Array.isArray(images) ? images : [];
      }
      return [];
    } catch (error) {
      console.error(
        `💥 Error getting images for location ${locationId}:`,
        error
      );
      return [];
    }
  }

  async getImagesForEvent(eventId: number): Promise<ImageItem[]> {
    try {
      console.log(`🎉 Getting images for event ${eventId}`);
      const response = await fetch(`${API_BASE}/Image/event/${eventId}`, {
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const images = await response.json();
        console.log(`✅ Found ${images.length} images for event ${eventId}`);
        return Array.isArray(images) ? images : [];
      }
      return [];
    } catch (error) {
      console.error(`💥 Error getting images for event ${eventId}:`, error);
      return [];
    }
  }

  // ===== ENHANCED PHOTOGRAPHER METHODS =====
  async getPhotographersForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 50 },
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

      console.log("📊 Raw photographer data sample:", photographers[0]);

      // Transform to our format using the actual API response structure
      const items: PhotographerModerationItem[] = photographers.map(
        (photographer: any) => ({
          id: photographer.photographerId || photographer.id,
          userId: photographer.userId,
          fullName: photographer.fullName || "Unknown",
          email: photographer.email || "",
          phoneNumber: photographer.phoneNumber,
          yearsExperience: photographer.yearsExperience || 0,
          equipment: photographer.equipment,
          portfolioImages: [], // Will be fetched separately when needed
          verificationStatus: photographer.verificationStatus || "pending",
          profileImage: photographer.profileImage,
          bio: photographer.bio,
          specialties: photographer.styles || [], // API provides styles array
          hourlyRate: photographer.hourlyRate,
          totalReviews: photographer.ratingCount || 0,
          averageRating: photographer.rating || 0,
          createdAt: photographer.createdAt || new Date().toISOString(),
          updatedAt: photographer.updatedAt || new Date().toISOString(),
        })
      );

      console.log("✅ Transformed photographers:", items.length);

      return {
        items,
        totalCount: items.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(items.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("💥 Error fetching photographers for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  // ===== ENHANCED VENUE METHODS =====
  async getVenuesForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 50 },
    filters: ModerationFilters = {}
  ): Promise<ModerationListResponse<VenueModerationItem>> {
    try {
      console.log("🏢 Fetching venues for moderation...");

      const response = await fetch(`${API_BASE}/Location/GetAllLocations`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Venues API failed: ${response.status}`);
      }

      const data = await response.json();
      const venues = Array.isArray(data) ? data : [];

      console.log("📊 Raw venue data sample:", venues[0]);

      // Transform to our format using the actual API response structure
      const items: VenueModerationItem[] = venues.map((venue: any) => ({
        id: venue.locationId || venue.id,
        ownerId: venue.locationOwnerId,
        ownerName:
          venue.locationOwner?.businessName ||
          venue.locationOwner?.user?.fullName ||
          "Unknown Owner",
        venueName: venue.name,
        address: venue.address,
        description: venue.description,
        hourlyRate: venue.hourlyRate,
        capacity: venue.capacity,
        amenities: venue.amenities
          ? venue.amenities.split(",").map((a: string) => a.trim())
          : [],
        images: [], // Will be fetched separately when needed
        isActive: venue.availabilityStatus === "Available",
        featuredStatus: venue.featuredStatus || false,
        verificationStatus: venue.verificationStatus || "pending",
        createdAt: venue.createdAt || new Date().toISOString(),
        updatedAt: venue.updatedAt || new Date().toISOString(),
      }));

      console.log("✅ Transformed venues:", items.length);

      return {
        items,
        totalCount: items.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(items.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("💥 Error fetching venues for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  // ===== ENHANCED EVENT METHODS =====
  async getEventsForModeration(
    pagination: PaginationParams = { page: 1, pageSize: 50 },
    filters: ModerationFilters = {}
  ): Promise<ModerationListResponse<EventModerationItem>> {
    try {
      console.log("🎉 Fetching events for moderation...");

      const response = await fetch(`${API_BASE}/LocationEvent`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Events API failed: ${response.status}`);
      }

      const data = await response.json();
      const events = Array.isArray(data) ? data : [];

      console.log("📊 Raw event data sample:", events[0]);

      // Transform to our format using the actual API response structure
      const items: EventModerationItem[] = events.map((event: any) => ({
        id: event.id,
        locationId: event.locationId,
        locationName:
          event.location?.name || event.locationName || "Unknown Location",
        eventName: event.name,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        discountedPrice: event.discountedPrice,
        originalPrice: event.originalPrice,
        maxPhotographers: event.maxPhotographers || 0,
        images: [], // Will be fetched separately when needed
        applicationsCount: event.applicationsCount || 0,
        bookingsCount: event.bookingsCount || 0,
        status: event.status || "active",
        createdAt: event.createdAt || new Date().toISOString(),
        updatedAt: event.updatedAt || new Date().toISOString(),
      }));

      console.log("✅ Transformed events:", items.length);

      return {
        items,
        totalCount: items.length,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(items.length / pagination.pageSize),
      };
    } catch (error) {
      console.error("💥 Error fetching events for moderation:", error);
      return {
        items: [],
        totalCount: 0,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: 0,
      };
    }
  }

  // ===== PRIVATE HELPER METHODS (Keep existing) =====
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
        const locationId = location.locationId || location.id;

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

  // ===== MODERATION ACTION METHODS =====
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
          body: JSON.stringify(status), // API expects just the status string
        }
      );

      if (response.ok) {
        return {
          success: true,
          message: `Photographer ${status} successfully`,
        };
      } else {
        const errorText = await response.text();
        console.error("❌ Verify photographer error:", errorText);
        return {
          success: false,
          message: `Failed to verify photographer: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("💥 Error verifying photographer:", error);
      return {
        success: false,
        message: "Failed to verify photographer",
      };
    }
  }

  // ===== REVIEW METHODS =====
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

  // ===== STATS METHODS =====
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
      const totalPending =
        photographers.items.filter((p) => p.verificationStatus === "pending")
          .length +
        venues.items.filter((v) => v.verificationStatus === "pending").length;

      const totalApproved =
        photographers.items.filter((p) => p.verificationStatus === "verified")
          .length +
        venues.items.filter((v) => v.verificationStatus === "verified").length;

      const totalRejected =
        photographers.items.filter((p) => p.verificationStatus === "rejected")
          .length +
        venues.items.filter((v) => v.verificationStatus === "rejected").length;

      return {
        totalPending,
        totalApproved,
        totalRejected,
        pendingPhotographers: photographers.totalCount || 0,
        pendingVenues: venues.totalCount || 0,
        pendingEvents: events.totalCount || 0,
        pendingReviews: reviews.totalCount || 0,
        flaggedImages: 3, // This would need a separate API endpoint
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

  // ===== UTILITY METHODS =====
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
