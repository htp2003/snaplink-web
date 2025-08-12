// src/hooks/moderator/ContentModeration.hooks.ts - UPDATED VERSION

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { contentModerationService } from "../../services/contentModerationService";
import {
  ImageItem,
  ReviewItem,
  ContentType,
  PhotographerModerationItem,
  VenueModerationItem,
  EventModerationItem,
  ModerationStats,
  ModerationFilters,
  PaginationParams,
  VerificationStatus,
} from "../../types/moderator/ContentModeration.types";

// ===== MAIN CONTENT MODERATION HOOK (Updated to include new features) =====
export const useContentModeration = () => {
  // Existing state
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeTab, setActiveTab] = useState<ContentType>("images");
  const [apiStatus, setApiStatus] = useState<string>("");

  // New state for enhanced moderation
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [photographers, setPhotographers] = useState<
    PhotographerModerationItem[]
  >([]);
  const [venues, setVenues] = useState<VenueModerationItem[]>([]);
  const [events, setEvents] = useState<EventModerationItem[]>([]);

  // Test API connection (keep existing)
  const testAPI = async () => {
    console.log("🧪 Testing API connection...");
    const result = await contentModerationService.testAPIConnection();
    setApiStatus(result.message);

    if (result.success) {
      toast.success("API connected successfully");
    } else {
      toast.error(`API Error: ${result.message}`);
      console.error("🚨 API Connection failed:", result.message);
    }

    return result.success;
  };

  // Load stats for dashboard
  const loadStats = async () => {
    try {
      console.log("📊 Loading moderation stats...");
      const statsData = await contentModerationService.getModerationStats();
      setStats(statsData);
    } catch (error) {
      console.error("💥 Error loading stats:", error);
      toast.error("Failed to load statistics");
    }
  };

  // Existing image loading (keep for backward compatibility)
  const loadImages = async () => {
    try {
      setLoading(true);

      // Test API first
      const apiWorking = await testAPI();
      if (!apiWorking) {
        console.log("⚠️ API not working, skipping image load");
        setImages([]);
        return;
      }

      const allImages = await contentModerationService.getAllImages();
      console.log("📸 Loaded images:", allImages.length);
      setImages(allImages);
    } catch (error) {
      console.error("💥 Error loading images:", error);
      toast.error(
        `Failed to load images: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Existing review loading (keep for backward compatibility)
  const loadReviews = async () => {
    try {
      setLoading(true);

      const allReviews = await contentModerationService.getAllReviews();
      console.log("💬 Loaded reviews:", allReviews.length);
      setReviews(allReviews);
    } catch (error) {
      console.error("💥 Error loading reviews:", error);
      toast.error(
        `Failed to load reviews: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load photographers for moderation
  const loadPhotographers = async () => {
    try {
      setLoading(true);
      console.log("👥 Loading photographers for moderation...");

      const response =
        await contentModerationService.getPhotographersForModeration();
      setPhotographers(response.items);
      console.log("✅ Photographers loaded:", response.items.length);
    } catch (error) {
      console.error("💥 Error loading photographers:", error);
      toast.error("Failed to load photographers");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load venues for moderation
  const loadVenues = async () => {
    try {
      setLoading(true);
      console.log("🏢 Loading venues for moderation...");

      const response = await contentModerationService.getVenuesForModeration();
      setVenues(response.items);
      console.log("✅ Venues loaded:", response.items.length);
    } catch (error) {
      console.error("💥 Error loading venues:", error);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load events for moderation
  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log("🎉 Loading events for moderation...");

      const response = await contentModerationService.getEventsForModeration();
      setEvents(response.items);
      console.log("✅ Events loaded:", response.items.length);
    } catch (error) {
      console.error("💥 Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // Existing delete methods (keep for backward compatibility)
  const deleteImage = async (imageId: number) => {
    try {
      const success = await contentModerationService.deleteImage(imageId);
      if (success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
        return true;
      }
      toast.error("Failed to delete image");
      return false;
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
      return false;
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const success = await contentModerationService.deleteReview(reviewId);
      if (success) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        toast.success("Review deleted successfully");
        return true;
      }
      toast.error("Failed to delete review");
      return false;
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    }
  };

  const setImagePrimary = async (imageId: number) => {
    try {
      const success = await contentModerationService.setImagePrimary(imageId);
      if (success) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, isPrimary: true }
              : { ...img, isPrimary: false }
          )
        );
        toast.success("Image set as primary");
        return true;
      }
      toast.error("Failed to set image as primary");
      return false;
    } catch (error) {
      console.error("Error setting image primary:", error);
      toast.error("Failed to set image as primary");
      return false;
    }
  };

  // NEW: Verify photographer
  const verifyPhotographer = async (
    photographerId: number,
    status: VerificationStatus,
    notes?: string
  ) => {
    try {
      console.log(`✅ Verifying photographer ${photographerId} as ${status}`);
      const response = await contentModerationService.verifyPhotographer(
        photographerId,
        status,
        notes
      );

      if (response.success) {
        toast.success(response.message);
        // Update photographer in list
        setPhotographers((prev) =>
          prev.map((p) =>
            p.id === photographerId ? { ...p, verificationStatus: status } : p
          )
        );
        // Refresh stats
        loadStats();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      console.error("Error verifying photographer:", error);
      toast.error("Failed to verify photographer");
      return false;
    }
  };

  // Load data based on active tab
  useEffect(() => {
    console.log(`🔄 Loading data for tab: ${activeTab}`);

    switch (activeTab) {
      case "images":
        loadImages();
        break;
      case "reviews":
        loadReviews();
        break;
      case "photographers":
        loadPhotographers();
        break;
      case "venues":
        loadVenues();
        break;
      case "events":
        loadEvents();
        break;
      default:
        loadImages();
    }
  }, [activeTab]);

  // Load stats on component mount
  useEffect(() => {
    loadStats();
  }, []);

  // Universal refresh function
  const refreshData = useCallback(() => {
    console.log(`🔄 Refreshing data for tab: ${activeTab}`);

    switch (activeTab) {
      case "images":
        return loadImages();
      case "reviews":
        return loadReviews();
      case "photographers":
        return loadPhotographers();
      case "venues":
        return loadVenues();
      case "events":
        return loadEvents();
      default:
        return loadImages();
    }
  }, [activeTab]);

  return {
    // Existing state (backward compatibility)
    loading,
    images,
    reviews,
    activeTab,
    apiStatus,
    setActiveTab,
    deleteImage,
    deleteReview,
    setImagePrimary,
    testAPI,
    refreshData,

    // New state and methods
    stats,
    photographers,
    venues,
    events,
    verifyPhotographer,
    loadStats,
    loadPhotographers,
    loadVenues,
    loadEvents,

    // Utility
    refresh: refreshData,
  };
};

// ===== SPECIALIZED HOOKS FOR SPECIFIC MODERATION AREAS =====

// Photographer-specific hook
export const usePhotographerModeration = () => {
  const [photographers, setPhotographers] = useState<
    PhotographerModerationItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadPhotographers = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        await contentModerationService.getPhotographersForModeration();
      setPhotographers(response.items);
    } catch (error) {
      console.error("Error loading photographers:", error);
      toast.error("Failed to load photographers");
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyPhotographer = useCallback(
    async (
      photographerId: number,
      status: VerificationStatus,
      notes?: string
    ) => {
      try {
        setActionLoading(photographerId);
        const response = await contentModerationService.verifyPhotographer(
          photographerId,
          status,
          notes
        );

        if (response.success) {
          toast.success(response.message);
          setPhotographers((prev) =>
            prev.map((p) =>
              p.id === photographerId ? { ...p, verificationStatus: status } : p
            )
          );
          return true;
        } else {
          toast.error(response.message);
          return false;
        }
      } catch (error) {
        console.error("Error verifying photographer:", error);
        toast.error("Failed to verify photographer");
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    []
  );

  useEffect(() => {
    loadPhotographers();
  }, [loadPhotographers]);

  return {
    photographers,
    loading,
    actionLoading,
    verifyPhotographer,
    refresh: loadPhotographers,
  };
};

// Image-specific hook (enhanced version of existing functionality)
export const useImageModeration = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      const allImages = await contentModerationService.getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageId: number) => {
    try {
      setActionLoading(imageId);
      const success = await contentModerationService.deleteImage(imageId);

      if (success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
        return true;
      } else {
        toast.error("Failed to delete image");
        return false;
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const setImagePrimary = useCallback(async (imageId: number) => {
    try {
      setActionLoading(imageId);
      const success = await contentModerationService.setImagePrimary(imageId);

      if (success) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, isPrimary: true }
              : { ...img, isPrimary: false }
          )
        );
        toast.success("Image set as primary");
        return true;
      } else {
        toast.error("Failed to set image as primary");
        return false;
      }
    } catch (error) {
      console.error("Error setting image primary:", error);
      toast.error("Failed to set image as primary");
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return {
    images,
    loading,
    actionLoading,
    deleteImage,
    setImagePrimary,
    refresh: loadImages,
  };
};

// Review-specific hook
export const useReviewModeration = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const allReviews = await contentModerationService.getAllReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: number) => {
    try {
      setActionLoading(reviewId);
      const success = await contentModerationService.deleteReview(reviewId);

      if (success) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        toast.success("Review deleted successfully");
        return true;
      } else {
        toast.error("Failed to delete review");
        return false;
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    loading,
    actionLoading,
    deleteReview,
    refresh: loadReviews,
  };
};
