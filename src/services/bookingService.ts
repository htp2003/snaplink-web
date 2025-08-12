// src/services/bookingService.ts

import { apiClient, replaceUrlParams } from "./apiClient";
import { userService } from "./userService";
import {
  BookingData,
  BookingStats,
  UpdateBookingRequest,
} from "../types/admin/BookingManagement.types";

class BookingService {
  // Get booking by ID with populated data
  async getBookingById(bookingId: number): Promise<BookingData | null> {
    try {
      const response = await apiClient.get<BookingData>(
        `/api/Booking/${bookingId}`
      );
      if (response.success && response.data) {
        return await this.populateBookingData(response.data);
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
      // Lấy tất cả users từ UserService
      const usersResponse = await userService.getAllUsers();
      if (!usersResponse.success || !usersResponse.data) {
        throw new Error("Failed to fetch users");
      }

      const users = usersResponse.data;
      const allBookings: BookingData[] = [];

      // Fetch bookings cho từng user (parallel processing, giới hạn 50 users để tránh quá tải)
      const userBookingPromises = users.slice(0, 50).map(async (user) => {
        try {
          const bookingsResponse = await apiClient.get<{
            bookings: BookingData[];
            totalCount: number;
            page: number;
            pageSize: number;
          }>(`/api/Booking/user/${user.userId}?pageSize=100`);

          if (bookingsResponse.success && bookingsResponse.data?.bookings) {
            return bookingsResponse.data.bookings.map((booking) => ({
              ...booking,
              customer: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profileImage: user.profileImage,
              },
            }));
          }
          return [];
        } catch (error) {
          console.error(
            `Error fetching bookings for user ${user.userId}:`,
            error
          );
          return [];
        }
      });

      const userBookingsResults = await Promise.all(userBookingPromises);
      const flattenedBookings = userBookingsResults.flat();

      // Remove duplicates by booking ID
      const uniqueBookings = flattenedBookings.reduce((acc, booking) => {
        if (!acc.find((b) => b.id === booking.id)) {
          acc.push(booking);
        }
        return acc;
      }, [] as BookingData[]);

      // Populate additional data (photographer, location)
      for (const booking of uniqueBookings) {
        const populatedBooking = await this.populateBookingData(booking);
        if (populatedBooking) {
          allBookings.push(populatedBooking);
        }
      }

      return allBookings;
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      return [];
    }
  }

  // Get bookings by photographer
  async getBookingsByPhotographer(
    photographerId: number,
    page = 1,
    pageSize = 50
  ): Promise<{
    bookings: BookingData[];
    totalCount: number;
  }> {
    try {
      const response = await apiClient.get<{
        bookings: BookingData[];
        totalCount: number;
        page: number;
        pageSize: number;
      }>(
        `/api/Booking/photographer/${photographerId}?page=${page}&pageSize=${pageSize}`
      );

      if (response.success && response.data) {
        const populatedBookings = await Promise.all(
          response.data.bookings.map((booking) =>
            this.populateBookingData(booking)
          )
        );

        return {
          bookings: populatedBookings.filter(Boolean) as BookingData[],
          totalCount: response.data.totalCount,
        };
      }
      return { bookings: [], totalCount: 0 };
    } catch (error) {
      console.error("Error fetching photographer bookings:", error);
      return { bookings: [], totalCount: 0 };
    }
  }

  // Update booking
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

  // Confirm booking
  async confirmBooking(bookingId: number): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/Booking/${bookingId}/confirm`);
      return response.success;
    } catch (error) {
      console.error("Error confirming booking:", error);
      return false;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: number): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/Booking/${bookingId}/cancel`);
      return response.success;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return false;
    }
  }

  // Complete booking
  async completeBooking(bookingId: number): Promise<boolean> {
    try {
      const response = await apiClient.put(
        `/api/Booking/${bookingId}/Complete`
      );
      return response.success;
    } catch (error) {
      console.error("Error completing booking:", error);
      return false;
    }
  }

  // Populate booking với thông tin user và photographer
  private async populateBookingData(
    booking: BookingData
  ): Promise<BookingData | null> {
    try {
      const populatedBooking = { ...booking };

      // Populate customer info if not already populated
      if (!populatedBooking.customer && booking.userId) {
        const customerResponse = await userService.getUserById(booking.userId);
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
      }

      // Populate photographer info
      if (!populatedBooking.photographer && booking.photographerId) {
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
      }

      // TODO: Populate location info when location API is available
      // if (booking.locationId) {
      //   const locationResponse = await locationService.getLocationById(booking.locationId);
      //   populatedBooking.location = locationResponse.data;
      // }

      return populatedBooking;
    } catch (error) {
      console.error("Error populating booking data:", error);
      return booking;
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
        case "pending":
          stats.pending++;
          break;
        case "confirmed":
          stats.confirmed++;
          break;
        case "completed":
          stats.completed++;
          break;
        case "cancelled":
          stats.cancelled++;
          break;
        case "in_progress":
          stats.inProgress++;
          break;
        case "refunded":
          stats.refunded++;
          break;
      }

      // Calculate revenue
      const amount = booking.totalAmount || 0;
      if (booking.status === "completed") {
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
    const completedBookings = bookings.filter((b) => b.status === "completed");
    if (completedBookings.length > 0) {
      stats.averageBookingValue = stats.totalRevenue / completedBookings.length;
    }

    return stats;
  }
}

export const bookingService = new BookingService();
