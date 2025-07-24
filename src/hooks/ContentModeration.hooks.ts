// src/hooks/ContentModeration.hooks.ts

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { contentModerationService } from "../services/contentModerationService";
import {
  ImageItem,
  ReviewItem,
  ContentType,
} from "../types/ContentModeration.types";

export const useContentModeration = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [activeTab, setActiveTab] = useState<ContentType>("images");
  const [apiStatus, setApiStatus] = useState<string>("");

  // Test API connection first
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

  // Load images
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

  // Load reviews
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

  // Delete image
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

  // Delete review
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

  // Set image as primary
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

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "images") {
      loadImages();
    } else {
      loadReviews();
    }
  }, [activeTab]);

  return {
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
    refreshData: () => (activeTab === "images" ? loadImages() : loadReviews()),
  };
};
