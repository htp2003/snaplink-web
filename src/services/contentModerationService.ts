// src/services/contentModerationService.ts

import { authService } from "./authService";
import { ImageItem, ReviewItem } from "../types/ContentModeration.types";

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

  // Image Services
  async getAllImages(): Promise<ImageItem[]> {
    try {
      console.log("🔄 Fetching images...");

      // Skip endpoint checking for now since it causes 405 errors
      // await this.checkImageEndpoints();

      // Try simple approach first
      try {
        return await this.getAllImagesSimple();
      } catch (simpleError) {
        console.log("⚠️ Simple approach failed, trying complex approach...");
      }

      // Original complex approach
      const response = await fetch(`${API_BASE}/Photographer`, {
        headers: this.getHeaders(),
      });

      console.log("📊 Photographers response status:", response.status);

      if (!response.ok) {
        throw new Error(`Photographers API failed: ${response.status}`);
      }

      const photographers = await response.json();
      console.log("👥 Photographers count:", photographers.length);

      if (!Array.isArray(photographers) || photographers.length === 0) {
        console.log("⚠️ No photographers found");
        return [];
      }

      // Try to get images from first photographer only
      const firstPhotographer = photographers[0];
      console.log("🎯 Testing with photographer ID:", firstPhotographer.id);

      const imageResponse = await fetch(
        `${API_BASE}/Image/photographer/${firstPhotographer.id}`,
        {
          headers: this.getHeaders(),
        }
      );

      console.log("🖼️ Images response status:", imageResponse.status);

      if (imageResponse.ok) {
        const images = await imageResponse.json();
        console.log("✅ Images loaded:", images.length);
        return Array.isArray(images) ? images : [];
      } else {
        const errorText = await imageResponse.text();
        console.error("❌ Images API failed:", imageResponse.status, errorText);
        throw new Error(
          `Images API failed: ${imageResponse.status} - ${errorText}`
        );
      }
    } catch (error) {
      console.error("💥 Error in getAllImages:", error);
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

  async getReview(reviewId: number): Promise<ReviewItem | null> {
    try {
      const response = await fetch(`${API_BASE}/Review/${reviewId}`, {
        headers: this.getHeaders(),
      });

      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error fetching review:", error);
      return null;
    }
  }

  // Test API connectivity
  async testAPIConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🧪 Testing API connection...");

      // Test simplest endpoint first
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
        // Try to get error details
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

  // Alternative: Try different API approach
  async getAllImagesSimple(): Promise<ImageItem[]> {
    try {
      console.log("🔄 Trying simple approach...");

      // Just try to get images from a specific photographer ID (if we know one exists)
      // Or try a different endpoint that might work
      const testPhotographerId = 1; // Try with ID 1

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
        // Try to get error details
        const errorText = await response.text();
        console.error("❌ Image API Error details:", errorText);
        throw new Error(`Image API failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("💥 Error in getAllImagesSimple:", error);
      throw error;
    }
  }

  // Check if Image API endpoints exist
  async checkImageEndpoints(): Promise<void> {
    console.log("🧪 Checking available Image endpoints...");

    const testEndpoints = [
      { url: `${API_BASE}/Image/photographer/1`, name: "photographer" },
      { url: `${API_BASE}/Image/location/1`, name: "location" },
      { url: `${API_BASE}/Image/event/1`, name: "event" },
    ];

    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: "GET", // Changed from HEAD to GET
          headers: this.getHeaders(),
        });
        console.log(
          `📊 ${endpoint.name} endpoint: ${response.status} ${
            response.ok ? "✅" : "❌"
          }`
        );
      } catch (error) {
        console.log(`❌ ${endpoint.name} endpoint: Network error`);
      }
    }
  }
}

export const contentModerationService = new ContentModerationService();
