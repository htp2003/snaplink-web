// src/services/bookingService.ts - FIXED VERSION

import { apiClient, replaceUrlParams } from "./apiClient";
import { userService } from "./userService";
import {
  BookingData,
  BookingStats,
  UpdateBookingRequest,
} from "../types/admin/BookingManagement.types";

// Interface cho API response format thực tế
interface BookingApiResponse {
  error: number;
  message: string;
  data:
    | {
        bookings: any[];
        totalCount: number;
        page: number;
        pageSize: number;
      }
    | any[];
}

class BookingService {
  // Get booking by ID with populated data
  async getBookingById(bookingId: number): Promise<BookingData | null> {
    try {
      const response = await apiClient.get<any>(`/api/Booking/${bookingId}`);
      if (response.success && response.data) {
        const bookingData = this.normalizeBookingData(response.data);
        return await this.populateBookingData(bookingData);
      }
      return null;
    } catch (error) {
      console.error("Error fetching booking:", error);
      return null;
    }
  }

  // Get all bookings from users (workaround vì không có GET /api/Booking)
  async getAllBookings(): Promise<BookingData[]> {
    try {
      console.log("🔄 Loading all bookings...");

      // Lấy tất cả users từ UserService
      const usersResponse = await userService.getAllUsers();
      if (!usersResponse.success || !usersResponse.data) {
        throw new Error("Failed to fetch users");
      }

      const users = usersResponse.data;
      console.log(`📋 Found ${users.length} users, fetching bookings...`);

      const allBookings: BookingData[] = [];

      // Fetch bookings cho từng user (parallel processing, giới hạn 20 users để tránh quá tải)
      const userBatches = this.chunkArray(users, 20);

      for (const batch of userBatches) {
        const userBookingPromises = batch.map(async (user) => {
          try {
            // Direct fetch thay vì dùng apiClient để debug response format
            const token = this.getAuthToken();
            const response = await fetch(
              `https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net/api/Booking/user/${user.userId}?pageSize=100`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              console.warn(
                `❌ Failed to fetch bookings for user ${user.userId}: ${response.status}`
              );
              return [];
            }

            const data: BookingApiResponse = await response.json();
            console.log(`📊 User ${user.userId} response:`, data);

            // Handle different response formats
            let bookings: any[] = [];

            if (data.error === 0 && data.data) {
              // Format: { error: 0, message: "...", data: { bookings: [...] } }
              if (Array.isArray(data.data)) {
                bookings = data.data;
              } else if (
                data.data.bookings &&
                Array.isArray(data.data.bookings)
              ) {
                bookings = data.data.bookings;
              }
            } else if (Array.isArray(data)) {
              // Direct array response
              bookings = data;
            }

            console.log(
              `✅ Found ${bookings.length} bookings for user ${user.userId}`
            );

            return bookings.map((booking) => {
              const normalizedBooking = this.normalizeBookingData(booking);
              // Data đã có sẵn userName, userEmail từ API, không cần populate từ UserService
              return {
                ...normalizedBooking,
                customer: {
                  userId: normalizedBooking.userId,
                  fullName: normalizedBooking.userName,
                  email: normalizedBooking.userEmail,
                  phoneNumber: user.phoneNumber, // From UserService
                  profileImage: user.profileImage, // From UserService
                },
                photographer: {
                  userId: normalizedBooking.photographerId,
                  fullName: normalizedBooking.photographerName,
                  email: normalizedBooking.photographerEmail,
                  phoneNumber: "", // Would need separate call
                  hourlyRate: normalizedBooking.pricePerHour,
                },
                location: normalizedBooking.locationName
                  ? {
                      id: normalizedBooking.locationId || 0,
                      name: normalizedBooking.locationName,
                      address: normalizedBooking.locationAddress || "",
                      hourlyRate: normalizedBooking.pricePerHour,
                    }
                  : undefined,
              };
            });
          } catch (error) {
            console.error(
              `❌ Error fetching bookings for user ${user.userId}:`,
              error
            );
            return [];
          }
        });

        const batchResults = await Promise.all(userBookingPromises);
        const batchBookings = batchResults.flat();
        allBookings.push(...batchBookings);

        console.log(
          `📦 Batch processed: +${batchBookings.length} bookings (Total: ${allBookings.length})`
        );
      }

      // Remove duplicates by booking ID
      const uniqueBookings = allBookings.reduce((acc, booking) => {
        if (!acc.find((b) => b.bookingId === booking.bookingId)) {
          acc.push(booking);
        }
        return acc;
      }, [] as BookingData[]);

      console.log(`🎯 Final unique bookings: ${uniqueBookings.length}`);

      // Data đã được populate từ API response, skip thêm populate
      console.log(`✅ Successfully loaded ${uniqueBookings.length} bookings`);
      return uniqueBookings;
    } catch (error) {
      console.error("❌ Error fetching all bookings:", error);
      return [];
    }
  }

  // Normalize booking data từ API response - FIXED FOR ACTUAL API FORMAT
  private normalizeBookingData(rawBooking: any): BookingData {
    return {
      // Direct mapping từ API response
      bookingId: rawBooking.bookingId,
      userId: rawBooking.userId,
      userName: rawBooking.userName,
      userEmail: rawBooking.userEmail,
      photographerId: rawBooking.photographerId,
      photographerName: rawBooking.photographerName,
      photographerEmail: rawBooking.photographerEmail,
      locationId: rawBooking.locationId,
      locationName: rawBooking.locationName,
      locationAddress: rawBooking.locationAddress,
      startDatetime: rawBooking.startDatetime,
      endDatetime: rawBooking.endDatetime,
      status: rawBooking.status,
      specialRequests: rawBooking.specialRequests,
      totalPrice: rawBooking.totalPrice,
      createdAt: rawBooking.createdAt,
      updatedAt: rawBooking.updatedAt,
      hasPayment: rawBooking.hasPayment,
      paymentStatus: rawBooking.paymentStatus,
      paymentAmount: rawBooking.paymentAmount,
      escrowBalance: rawBooking.escrowBalance,
      hasEscrowFunds: rawBooking.hasEscrowFunds,
      durationHours: rawBooking.durationHours,
      pricePerHour: rawBooking.pricePerHour,

      // Computed fields for compatibility
      id: rawBooking.bookingId,
      totalAmount: rawBooking.totalPrice,
    };
  }

  // Helper: Get auth token từ localStorage
  private getAuthToken(): string {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");
      return token || "";
    } catch (error) {
      console.error("Error getting auth token:", error);
      return "";
    }
  }

  // Helper: Chunk array into smaller arrays
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Populate booking với thông tin user và photographer
  private async populateBookingData(
    booking: BookingData
  ): Promise<BookingData | null> {
    try {
      const populatedBooking = { ...booking };

      // Populate customer info if not already populated
      if (!populatedBooking.customer && booking.userId) {
        try {
          const customerResponse = await userService.getUserById(
            booking.userId
          );
          if (customerResponse.success && customerResponse.data) {
            const customer = customerResponse.data;
            populatedBooking.customer = {
              userId: customer.userId,
              fullName: customer.fullName,
              email: customer.email,
              phoneNumber: customer.phoneNumber,
              profileImage: customer.profileImage,
            };
          }
        } catch (error) {
          console.warn(`Could not populate customer ${booking.userId}:`, error);
        }
      }

      // Populate photographer info
      if (!populatedBooking.photographer && booking.photographerId) {
        try {
          const photographerResponse = await userService.getUserById(
            booking.photographerId
          );
          if (photographerResponse.success && photographerResponse.data) {
            const photographer = photographerResponse.data;
            populatedBooking.photographer = {
              userId: photographer.userId,
              fullName: photographer.fullName,
              email: photographer.email,
              phoneNumber: photographer.phoneNumber,
              hourlyRate: photographer.photographers?.[0]?.hourlyRate,
            };
          }
        } catch (error) {
          console.warn(
            `Could not populate photographer ${booking.photographerId}:`,
            error
          );
        }
      }

      return populatedBooking;
    } catch (error) {
      console.error("Error populating booking data:", error);
      return booking;
    }
  }

  // Rest of the methods remain the same...
  async updateBooking(
    bookingId: number,
    data: UpdateBookingRequest
  ): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/Booking/${bookingId}`, data);
      return response.success;
    } catch (error) {
      console.error("Error updating booking:", error);
      return false;
    }
  }

  async confirmBooking(bookingId: number): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/Booking/${bookingId}/confirm`);
      return response.success;
    } catch (error) {
      console.error("Error confirming booking:", error);
      return false;
    }
  }

  // Calculate booking statistics
  calculateStats(bookings: BookingData[]): BookingStats {
    const stats: BookingStats = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      inProgress: 0,
      refunded: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageBookingValue: 0,
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    bookings.forEach((booking) => {
      // Count by status
      switch (booking.status) {
        case "Pending":
          stats.pending++;
          break;
        case "Confirmed":
          stats.confirmed++;
          break;
        case "Completed":
          stats.completed++;
          break;
        case "Cancelled":
          stats.cancelled++;
          break;
        case "InProgress":
          stats.inProgress++;
          break;
        case "Refunded":
          stats.refunded++;
          break;
      }

      // Calculate revenue
      const amount = booking.totalPrice || 0;
      if (booking.status === "Completed") {
        stats.totalRevenue += amount;

        const bookingDate = new Date(booking.createdAt);
        if (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        ) {
          stats.monthlyRevenue += amount;
        }
      }
    });

    // Calculate average booking value
    const completedBookings = bookings.filter((b) => b.status === "Completed");
    if (completedBookings.length > 0) {
      stats.averageBookingValue = stats.totalRevenue / completedBookings.length;
    }

    return stats;
  }

  // Trong bookingService hiện tại, thêm:
  async cancelBooking(bookingId: number) {
    const response = await apiClient.put(`/api/Booking/${bookingId}/cancel`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "Failed to cancel booking");
    }
  }

  async completeBooking(bookingId: number) {
    const response = await apiClient.put(`/api/Booking/${bookingId}/Complete`);
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || "Failed to complete booking");
    }
  }
}

export const bookingService = new BookingService();
