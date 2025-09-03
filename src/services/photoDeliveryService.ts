// Simplified photoDeliveryService.ts
import { apiClient } from "./apiClient";

export interface PhotoDeliveryResponse {
  photoDeliveryId: number;
  bookingId: number;
  deliveryMethod?: string;
  driveLink?: string;
  driveFolderName?: string;
  photoCount?: number;
  status?: string;
  uploadedAt?: string;
  deliveredAt?: string;
  expiresAt?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  customerName?: string;
  photographerName?: string;
  bookingDate?: string;
  locationName?: string;
}

class PhotoDeliveryService {
  private baseUrl = "/api/PhotoDelivery";

  // Fixed method to work with apiClient format
  async getPhotoDeliveryByBooking(
    bookingId: number
  ): Promise<PhotoDeliveryResponse | null> {
    console.log("📡 API Call: GET", `${this.baseUrl}/booking/${bookingId}`);

    try {
      // ApiClient returns {success: boolean, data: T}
      const response = await apiClient.get(
        `${this.baseUrl}/booking/${bookingId}`
      );

      console.log("📡 ApiClient response:", response);

      if (response.success && response.data) {
        console.log("✅ API Success via apiClient");

        // response.data is the PhotoDelivery API response: {error: 0, message: "", data: {...}}
        const photoDeliveryResponse = response.data;
        console.log("📸 PhotoDelivery API response:", photoDeliveryResponse);

        if (photoDeliveryResponse.error === 0 && photoDeliveryResponse.data) {
          console.log(
            "✅ PhotoDelivery success, data:",
            photoDeliveryResponse.data
          );
          console.log(
            "🔗 Drive link found:",
            photoDeliveryResponse.data.driveLink
          );
          return photoDeliveryResponse.data as PhotoDeliveryResponse;
        } else {
          console.log(
            "❌ PhotoDelivery API error:",
            photoDeliveryResponse.message
          );
          return null;
        }
      } else {
        console.log("❌ ApiClient error:", response.message);
        return null;
      }
    } catch (error: any) {
      console.error("💥 API Call failed:", error);
      return null;
    }
  }
}

export const photoDeliveryService = new PhotoDeliveryService();
