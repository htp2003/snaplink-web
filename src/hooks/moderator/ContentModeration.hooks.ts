// src/hooks/moderator/ContentModeration.hooks.ts - UPDATED FOR RATING MANAGEMENT

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { contentModerationService } from "../../services/contentModerationService";
import {
  ImageItem,
  RatingItem, // Changed from ReviewItem
  ContentType,
  PhotographerModerationItem,
  VenueModerationItem,
  EventModerationItem,
  ModerationStats,
  ModerationFilters,
  PaginationParams,
  VerificationStatus,
  UpdateRatingDto,
} from "../../types/moderator/ContentModeration.types";

// ===== MAIN CONTENT MODERATION HOOK (Enhanced) =====
export const useContentModeration = () => {
  // Existing state
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [ratings, setRatings] = useState<RatingItem[]>([]); // Changed from reviews
  const [activeTab, setActiveTab] = useState<ContentType>("images");
  const [apiStatus, setApiStatus] = useState<string>("");

  // Enhanced state for structured navigation
  const [stats, setStats] = useState<ModerationStats | null>(null);
  const [photographers, setPhotographers] = useState<
    PhotographerModerationItem[]
  >([]);
  const [venues, setVenues] = useState<VenueModerationItem[]>([]);
  const [events, setEvents] = useState<EventModerationItem[]>([]);

  // NEW: State for individual item images
  const [itemImages, setItemImages] = useState<ImageItem[]>([]);
  const [itemImagesLoading, setItemImagesLoading] = useState(false);

  // Test API connection (keep existing)
  const testAPI = async () => {
    console.log("Testing API connection...");
    const result = await contentModerationService.testAPIConnection();
    setApiStatus(result.message);

    if (result.success) {
      toast.success("API connected successfully");
    } else {
      toast.error(`API Error: ${result.message}`);
      console.error("API Connection failed:", result.message);
    }

    return result.success;
  };

  // Load stats for dashboard
  const loadStats = async () => {
    try {
      console.log("Loading moderation stats...");
      const statsData = await contentModerationService.getModerationStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error("Failed to load statistics");
    }
  };

  // ===== ENHANCED IMAGE LOADING METHODS =====

  // Load all images (existing method)
  const loadImages = async () => {
    try {
      setLoading(true);

      // Test API first
      const apiWorking = await testAPI();
      if (!apiWorking) {
        console.log("API not working, skipping image load");
        setImages([]);
        return;
      }

      const allImages = await contentModerationService.getAllImages();
      console.log("Loaded images:", allImages.length);
      setImages(allImages);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error(
        `Failed to load images: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // NEW: Load images for specific photographer
  const loadPhotographerImages = async (photographerId: number) => {
    try {
      setItemImagesLoading(true);
      console.log(`Loading images for photographer ${photographerId}`);

      const images = await contentModerationService.getImagesForPhotographer(
        photographerId
      );
      setItemImages(images);
      console.log(
        `Loaded ${images.length} images for photographer ${photographerId}`
      );

      return images;
    } catch (error) {
      console.error("Error loading photographer images:", error);
      toast.error("Failed to load photographer images");
      setItemImages([]);
      return [];
    } finally {
      setItemImagesLoading(false);
    }
  };

  // NEW: Load images for specific location
  const loadLocationImages = async (locationId: number) => {
    try {
      setItemImagesLoading(true);
      console.log(`Loading images for location ${locationId}`);

      const images = await contentModerationService.getImagesForLocation(
        locationId
      );
      setItemImages(images);
      console.log(`Loaded ${images.length} images for location ${locationId}`);

      return images;
    } catch (error) {
      console.error("Error loading location images:", error);
      toast.error("Failed to load location images");
      setItemImages([]);
      return [];
    } finally {
      setItemImagesLoading(false);
    }
  };

  // NEW: Load images for specific event
  const loadEventImages = async (eventId: number) => {
    try {
      setItemImagesLoading(true);
      console.log(`Loading images for event ${eventId}`);

      const images = await contentModerationService.getImagesForEvent(eventId);
      setItemImages(images);
      console.log(`Loaded ${images.length} images for event ${eventId}`);

      return images;
    } catch (error) {
      console.error("Error loading event images:", error);
      toast.error("Failed to load event images");
      setItemImages([]);
      return [];
    } finally {
      setItemImagesLoading(false);
    }
  };

  // ===== ENTITY LOADING METHODS =====

  // Load ratings (changed from loadReviews)
  const loadRatings = async () => {
    try {
      setLoading(true);

      const allRatings = await contentModerationService.getAllRatings();
      console.log("Loaded ratings:", allRatings.length);
      setRatings(allRatings);
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error(
        `Failed to load ratings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Load photographers for moderation
  const loadPhotographers = async () => {
    try {
      setLoading(true);
      console.log("Loading photographers for moderation...");

      const response =
        await contentModerationService.getPhotographersForModeration();
      setPhotographers(response.items);
      console.log("Photographers loaded:", response.items.length);
    } catch (error) {
      console.error("Error loading photographers:", error);
      toast.error("Failed to load photographers");
    } finally {
      setLoading(false);
    }
  };

  // Load venues for moderation
  const loadVenues = async () => {
    try {
      setLoading(true);
      console.log("Loading venues for moderation...");

      const response = await contentModerationService.getVenuesForModeration();
      setVenues(response.items);
      console.log("Venues loaded:", response.items.length);
    } catch (error) {
      console.error("Error loading venues:", error);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  // Load events for moderation
  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log("Loading events for moderation...");

      const response = await contentModerationService.getEventsForModeration();
      setEvents(response.items);
      console.log("Events loaded:", response.items.length);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // ===== ACTION METHODS =====

  // Existing delete methods
  const deleteImage = async (imageId: number) => {
    try {
      const success = await contentModerationService.deleteImage(imageId);
      if (success) {
        // Update both main images list and item-specific images list
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        setItemImages((prev) => prev.filter((img) => img.id !== imageId));
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

  // NEW: Rating management methods (replace review methods)
  const deleteRating = async (ratingId: number) => {
    try {
      const success = await contentModerationService.deleteRating(ratingId);
      if (success) {
        setRatings((prev) => prev.filter((rating) => rating.id !== ratingId));
        toast.success("Rating deleted successfully");
        return true;
      }
      toast.error("Failed to delete rating");
      return false;
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
      return false;
    }
  };

  const updateRating = async (
    ratingId: number,
    updateData: UpdateRatingDto
  ) => {
    try {
      const success = await contentModerationService.updateRating(
        ratingId,
        updateData
      );
      if (success) {
        // Reload the rating to get updated data
        const updatedRating = await contentModerationService.getRatingById(
          ratingId
        );
        if (updatedRating) {
          setRatings((prev) =>
            prev.map((rating) =>
              rating.id === ratingId ? updatedRating : rating
            )
          );
        }
        toast.success("Rating updated successfully");
        return true;
      }
      toast.error("Failed to update rating");
      return false;
    } catch (error) {
      console.error("Error updating rating:", error);
      toast.error("Failed to update rating");
      return false;
    }
  };

  const setImagePrimary = async (imageId: number) => {
    try {
      const success = await contentModerationService.setImagePrimary(imageId);
      if (success) {
        // Update both main images list and item-specific images list
        const updateImages = (prev: ImageItem[]) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, isPrimary: true }
              : { ...img, isPrimary: false }
          );

        setImages(updateImages);
        setItemImages(updateImages);
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

  // Verify photographer
  const verifyPhotographer = async (
    photographerId: number,
    status: VerificationStatus,
    notes?: string
  ) => {
    try {
      console.log(`Verifying photographer ${photographerId} as ${status}`);
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

  // ===== UTILITY METHODS =====

  // Clear item-specific images when navigating away
  const clearItemImages = () => {
    setItemImages([]);
  };

  // Get filtered images based on category and item ID
  const getFilteredImages = (category: string, itemId: number): ImageItem[] => {
    if (category === "photographer") {
      return images.filter((img) => img.photographerId === itemId);
    } else if (category === "location") {
      return images.filter((img) => img.locationId === itemId);
    } else if (category === "event") {
      return images.filter((img) => img.eventId === itemId);
    }
    return [];
  };

  // Load data based on active tab (only refresh current tab data)
  useEffect(() => {
    if (activeTab === "images") {
      // For images tab, we already have all data loaded
      console.log(`Images tab active, data already loaded`);
      return;
    }

    console.log(`Refreshing data for tab: ${activeTab}`);

    switch (activeTab) {
      case "ratings": // Changed from "reviews"
        loadRatings();
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
    }
  }, [activeTab]);

  // Load stats and initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      console.log("Loading initial data for all tabs...");

      // Load stats first
      await loadStats();

      // Load all data to populate tab counts
      await Promise.all([
        loadImages(),
        loadRatings(), // Changed from loadReviews
        loadPhotographers(),
        loadVenues(),
        loadEvents(),
      ]);

      console.log("Initial data loading completed");
    };

    loadInitialData();
  }, []);

  // Universal refresh function
  const refreshData = useCallback(() => {
    console.log(`Refreshing data for tab: ${activeTab}`);

    switch (activeTab) {
      case "images":
        return loadImages();
      case "ratings": // Changed from "reviews"
        return loadRatings();
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
    // Updated state (changed reviews to ratings)
    loading,
    images,
    ratings, // Changed from reviews
    activeTab,
    apiStatus,
    setActiveTab,
    deleteImage,
    deleteRating, // Changed from deleteReview
    updateRating, // New method
    setImagePrimary,
    testAPI,
    refreshData,

    // Enhanced state and methods
    stats,
    photographers,
    venues,
    events,
    verifyPhotographer,
    loadStats,
    loadPhotographers,
    loadVenues,
    loadEvents,

    // NEW: Item-specific image methods
    itemImages,
    itemImagesLoading,
    loadPhotographerImages,
    loadLocationImages,
    loadEventImages,
    clearItemImages,
    getFilteredImages,

    // Utility
    refresh: refreshData,
  };
};

// ===== SPECIALIZED HOOKS FOR SPECIFIC MODERATION AREAS =====

// Enhanced Photographer-specific hook
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

  const loadPhotographerImages = useCallback(async (photographerId: number) => {
    try {
      return await contentModerationService.getImagesForPhotographer(
        photographerId
      );
    } catch (error) {
      console.error("Error loading photographer images:", error);
      toast.error("Failed to load photographer images");
      return [];
    }
  }, []);

  useEffect(() => {
    loadPhotographers();
  }, [loadPhotographers]);

  return {
    photographers,
    loading,
    actionLoading,
    verifyPhotographer,
    loadPhotographerImages,
    refresh: loadPhotographers,
  };
};

// Enhanced Image-specific hook
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

  const loadImagesForPhotographer = useCallback(
    async (photographerId: number) => {
      try {
        setLoading(true);
        return await contentModerationService.getImagesForPhotographer(
          photographerId
        );
      } catch (error) {
        console.error("Error loading photographer images:", error);
        toast.error("Failed to load photographer images");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadImagesForLocation = useCallback(async (locationId: number) => {
    try {
      setLoading(true);
      return await contentModerationService.getImagesForLocation(locationId);
    } catch (error) {
      console.error("Error loading location images:", error);
      toast.error("Failed to load location images");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadImagesForEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      return await contentModerationService.getImagesForEvent(eventId);
    } catch (error) {
      console.error("Error loading event images:", error);
      toast.error("Failed to load event images");
      return [];
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
    loadImagesForPhotographer,
    loadImagesForLocation,
    loadImagesForEvent,
    refresh: loadImages,
  };
};

// ===== NEW: Rating-specific hook (Replace useReviewModeration) =====
export const useRatingModeration = () => {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadRatings = useCallback(async () => {
    try {
      setLoading(true);
      const allRatings = await contentModerationService.getAllRatings();
      setRatings(allRatings);
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRating = useCallback(async (ratingId: number) => {
    try {
      setActionLoading(ratingId);
      const success = await contentModerationService.deleteRating(ratingId);

      if (success) {
        setRatings((prev) => prev.filter((rating) => rating.id !== ratingId));
        toast.success("Rating deleted successfully");
        return true;
      } else {
        toast.error("Failed to delete rating");
        return false;
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("Failed to delete rating");
      return false;
    } finally {
      setActionLoading(null);
    }
  }, []);

  const updateRating = useCallback(
    async (ratingId: number, updateData: UpdateRatingDto) => {
      try {
        setActionLoading(ratingId);
        const success = await contentModerationService.updateRating(
          ratingId,
          updateData
        );

        if (success) {
          // Reload the rating to get updated data
          const updatedRating = await contentModerationService.getRatingById(
            ratingId
          );
          if (updatedRating) {
            setRatings((prev) =>
              prev.map((rating) =>
                rating.id === ratingId ? updatedRating : rating
              )
            );
          }
          toast.success("Rating updated successfully");
          return true;
        } else {
          toast.error("Failed to update rating");
          return false;
        }
      } catch (error) {
        console.error("Error updating rating:", error);
        toast.error("Failed to update rating");
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    []
  );

  useEffect(() => {
    loadRatings();
  }, [loadRatings]);

  return {
    ratings,
    loading,
    actionLoading,
    deleteRating,
    updateRating,
    refresh: loadRatings,
  };
};

// ===== VENUE-SPECIFIC HOOK =====
export const useVenueModeration = () => {
  const [venues, setVenues] = useState<VenueModerationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVenues = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentModerationService.getVenuesForModeration();
      setVenues(response.items);
    } catch (error) {
      console.error("Error loading venues:", error);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadVenueImages = useCallback(async (locationId: number) => {
    try {
      return await contentModerationService.getImagesForLocation(locationId);
    } catch (error) {
      console.error("Error loading venue images:", error);
      toast.error("Failed to load venue images");
      return [];
    }
  }, []);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  return {
    venues,
    loading,
    loadVenueImages,
    refresh: loadVenues,
  };
};

// ===== EVENT-SPECIFIC HOOK =====
export const useEventModeration = () => {
  const [events, setEvents] = useState<EventModerationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await contentModerationService.getEventsForModeration();
      setEvents(response.items);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEventImages = useCallback(async (eventId: number) => {
    try {
      return await contentModerationService.getImagesForEvent(eventId);
    } catch (error) {
      console.error("Error loading event images:", error);
      toast.error("Failed to load event images");
      return [];
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    loading,
    loadEventImages,
    refresh: loadEvents,
  };
};
