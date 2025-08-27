import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  Phone,
  Mail,
  Camera,
  DollarSign,
  Users,
  Clock,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import {
  ImageItem,
  RatingItem,
  PhotographerModerationItem,
  VenueModerationItem,
  EventModerationItem,
  VerificationStatus,
} from "../../../types/moderator/ContentModeration.types";

type ContentItem =
  | ImageItem
  | RatingItem
  | PhotographerModerationItem
  | VenueModerationItem
  | EventModerationItem;

interface ContentDetailModalProps {
  content: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (id: number, notes?: string) => void;
  onReject?: (id: number, reason?: string) => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !content) return null;

  const isImage = (item: ContentItem): item is ImageItem => "url" in item;
  const isRating = (item: ContentItem): item is RatingItem =>
    "score" in item && "bookingId" in item;
  const isPhotographer = (
    item: ContentItem
  ): item is PhotographerModerationItem =>
    "fullName" in item && "email" in item;
  const isVenue = (item: ContentItem): item is VenueModerationItem =>
    "venueName" in item && "ownerId" in item;
  const isEvent = (item: ContentItem): item is EventModerationItem =>
    "eventName" in item && "startDate" in item;

  const getContentTitle = (): string => {
    if (isImage(content)) return content.caption || "Image Content";
    if (isRating(content)) return `Rating - ${content.score} stars`;
    if (isPhotographer(content)) return content.fullName;
    if (isVenue(content)) return content.venueName;
    if (isEvent(content)) return content.eventName;
    return "Content Details";
  };

  const getContentType = (): string => {
    if (isImage(content)) return "Image";
    if (isRating(content)) return "Rating";
    if (isPhotographer(content)) return "Photographer";
    if (isVenue(content)) return "Venue";
    if (isEvent(content)) return "Event";
    return "Content";
  };

  const getStatusColor = (status?: string): string => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "verified":
      case "approved":
      case "active":
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "suspended":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatus = (): string => {
    if (isPhotographer(content)) return content.verificationStatus;
    if (isVenue(content)) return content.isActive ? "Active" : "Inactive";
    if (isEvent(content)) return content.status;
    if (isRating(content) && content.booking) return content.booking.status;
    return "N/A";
  };

  const canApproveReject = (): boolean => {
    if (isPhotographer(content))
      return content.verificationStatus === VerificationStatus.PENDING;
    return false;
  };

  const handleApprove = () => {
    if (onApprove && "id" in content) {
      onApprove(content.id);
      onClose();
    }
  };

  const handleReject = () => {
    if (onReject && "id" in content) {
      onReject(content.id);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderImageDetails = (image: ImageItem) => (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={image.url}
          alt={image.caption || "Content"}
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/600x400?text=No+Image";
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Image Information</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Caption:</strong> {image.caption || "No caption"}
            </p>
            <p>
              <strong>Primary:</strong> {image.isPrimary ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(image.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Associated IDs</h4>
          <div className="space-y-2 text-sm">
            {image.photographerId && (
              <p>
                <strong>Photographer ID:</strong> {image.photographerId}
              </p>
            )}
            {image.locationId && (
              <p>
                <strong>Location ID:</strong> {image.locationId}
              </p>
            )}
            {image.eventId && (
              <p>
                <strong>Event ID:</strong> {image.eventId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRatingDetails = (rating: RatingItem) => (
    <div className="space-y-6">
      {/* Rating Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400 text-2xl mr-3">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < rating.score ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-xl font-semibold">({rating.score}/5)</span>
          </div>
          <div className="text-sm text-gray-500">Rating ID: {rating.id}</div>
        </div>
        {rating.comment ? (
          <div className="mt-3">
            <h5 className="font-medium text-gray-900 mb-2">Comment:</h5>
            <p className="text-gray-700 leading-relaxed bg-white p-3 rounded border">
              {rating.comment}
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-gray-500 italic">No comment provided</p>
          </div>
        )}
      </div>

      {/* Basic Rating Information */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Rating Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-900">
                Booking ID:
              </span>
              <p className="text-sm text-gray-600">{rating.bookingId}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">
                Reviewer ID:
              </span>
              <p className="text-sm text-gray-600">{rating.reviewerUserId}</p>
            </div>
            {rating.photographerId && (
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Photographer ID:
                </span>
                <p className="text-sm text-gray-600">{rating.photographerId}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {rating.locationId && (
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Location ID:
                </span>
                <p className="text-sm text-gray-600">{rating.locationId}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-900">
                Created:
              </span>
              <p className="text-sm text-gray-600">
                {new Date(rating.createdAt).toLocaleString()}
              </p>
            </div>
            {rating.updatedAt && (
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Updated:
                </span>
                <p className="text-sm text-gray-600">
                  {new Date(rating.updatedAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show booking details if available */}
      {rating.booking ? (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Booking Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Booking Code:
                </span>
                <p className="text-sm text-gray-600 font-mono">
                  {rating.booking.bookingCode}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Date & Time:
                </span>
                <div className="text-sm text-gray-600">
                  <p>
                    {new Date(rating.booking.bookingDate).toLocaleDateString()}
                  </p>
                  <p>
                    {rating.booking.startTime} - {rating.booking.endTime}
                  </p>
                  <p className="text-xs">
                    Duration: {rating.booking.duration} hours
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Status:
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ml-2 ${getStatusColor(
                    rating.booking.status
                  )}`}
                >
                  {rating.booking.status}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Total Amount:
                </span>
                <p className="text-lg font-semibold text-green-600">
                  {rating.booking.totalAmount.toLocaleString()}đ
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Booking Details Not Available
              </p>
              <p className="text-xs text-yellow-700">
                Booking information could not be retrieved for booking ID:{" "}
                {rating.bookingId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPhotographerDetails = (
    photographer: PhotographerModerationItem
  ) => (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {photographer.profileImage ? (
            <img
              src={photographer.profileImage}
              alt={photographer.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {photographer.fullName}
          </h3>
          <div className="flex items-center mt-1">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="ml-1 text-gray-600">
              {photographer.averageRating.toFixed(1)} (
              {photographer.totalReviews} reviews)
            </span>
          </div>
          {photographer.bio && (
            <p className="text-gray-600 mt-2">{photographer.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">{photographer.email}</span>
            </div>
            {photographer.phoneNumber && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">{photographer.phoneNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Professional Details
          </h4>
          <div className="space-y-3">
            {photographer.yearsExperience && (
              <div className="flex items-center">
                <Camera className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">
                  {photographer.yearsExperience} years experience
                </span>
              </div>
            )}
            {photographer.hourlyRate && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">${photographer.hourlyRate}/hour</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {photographer.equipment && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Equipment</h4>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {photographer.equipment}
          </p>
        </div>
      )}

      {photographer.portfolioImages &&
        photographer.portfolioImages.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Portfolio Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photographer.portfolioImages.slice(0, 8).map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );

  const renderVenueDetails = (venue: VenueModerationItem) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {venue.venueName}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{venue.address}</span>
        </div>
        {venue.description && (
          <p className="text-gray-600">{venue.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Venue Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <User className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">Owner: {venue.ownerName}</span>
            </div>
            {venue.capacity && (
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">
                  Capacity: {venue.capacity} people
                </span>
              </div>
            )}
            {venue.hourlyRate && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">${venue.hourlyRate}/hour</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Features</h4>
          <div className="space-y-2">
            {venue.amenities && venue.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {venue.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No amenities listed</p>
            )}
          </div>
        </div>
      </div>

      {venue.images && venue.images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Venue Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {venue.images.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={`Venue ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderEventDetails = (event: EventModerationItem) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.eventName}
        </h3>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{event.locationName}</span>
        </div>
        {event.description && (
          <p className="text-gray-600">{event.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Event Information</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <div className="text-sm">
                <p>Start: {new Date(event.startDate).toLocaleString()}</p>
                <p>End: {new Date(event.endDate).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm">
                Max Photographers: {event.maxPhotographers}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Pricing & Stats</h4>
          <div className="space-y-3">
            {event.originalPrice && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm">
                  Original: ${event.originalPrice}
                  {event.discountedPrice &&
                    ` → Discounted: ${event.discountedPrice}`}
                </span>
              </div>
            )}
            <div className="text-sm">
              <p>Applications: {event.applicationsCount}</p>
              <p>Bookings: {event.bookingsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {event.images && event.images.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Event Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {event.images.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={`Event ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (isImage(content)) return renderImageDetails(content);
    if (isRating(content)) return renderRatingDetails(content);
    if (isPhotographer(content)) return renderPhotographerDetails(content);
    if (isVenue(content)) return renderVenueDetails(content);
    if (isEvent(content)) return renderEventDetails(content);
    return <p>Unknown content type</p>;
  };

  const modalContent = (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
      }}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold">{getContentTitle()}</h2>
            <span className="text-sm text-gray-500">({getContentType()})</span>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                getStatus()
              )}`}
            >
              {getStatus()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">{renderContent()}</div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Close
          </button>

          {canApproveReject() && (
            <div className="space-x-3">
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ContentDetailModal;
