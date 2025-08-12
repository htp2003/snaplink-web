// src/components/admin/ContentModeration/ContentModeration.tsx - UPDATED VERSION

import React, { useState } from "react";
import {
  Shield,
  Image as ImageIcon,
  MessageSquare,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useContentModeration } from "../../../hooks/moderator/ContentModeration.hooks";
import {
  ImageItem,
  ReviewItem,
  PhotographerModerationItem,
  VenueModerationItem,
  EventModerationItem,
  ContentType,
  VerificationStatus,
} from "../../../types/moderator/ContentModeration.types";
import ContentDetailModal from "./ContentDetailModal";

// Stats Dashboard Component
const StatsDashboard: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: "Pending Review",
      value: stats.totalPending,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Approved",
      value: stats.totalApproved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Rejected",
      value: stats.totalRejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Flagged Images",
      value: stats.flaggedImages,
      icon: ImageIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Photographer Card Component
const PhotographerCard: React.FC<{
  photographer: PhotographerModerationItem;
  onVerify: (id: number, status: VerificationStatus, notes?: string) => void;
  onViewDetails: (photographer: PhotographerModerationItem) => void;
  loading?: boolean;
}> = ({ photographer, onVerify, onViewDetails, loading }) => {
  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return "bg-green-100 text-green-800";
      case VerificationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      case VerificationStatus.SUSPENDED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {photographer.profileImage ? (
            <img
              src={photographer.profileImage}
              alt={photographer.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {photographer.fullName}
            </h3>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                photographer.verificationStatus
              )}`}
            >
              {photographer.verificationStatus}
            </span>
          </div>
          <p className="text-sm text-gray-500">{photographer.email}</p>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">
              {photographer.averageRating.toFixed(1)} (
              {photographer.totalReviews} reviews)
            </span>
          </div>
          {photographer.yearsExperience && (
            <p className="text-xs text-gray-500 mt-1">
              {photographer.yearsExperience} years experience
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => onViewDetails(photographer)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>

        {photographer.verificationStatus === VerificationStatus.PENDING && (
          <div className="flex space-x-2">
            <button
              onClick={() =>
                onVerify(photographer.id, VerificationStatus.REJECTED)
              }
              disabled={loading}
              className="flex items-center text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </button>
            <button
              onClick={() =>
                onVerify(photographer.id, VerificationStatus.VERIFIED)
              }
              disabled={loading}
              className="flex items-center text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Image Card Component (Updated with category info)
const ImageCard: React.FC<{
  image: ImageItem;
  onDelete: (id: number) => void;
  onView: (image: ImageItem) => void;
  onSetPrimary: (id: number) => void;
  loading?: boolean;
}> = ({ image, onDelete, onView, onSetPrimary, loading }) => {
  const getImageCategory = () => {
    if (image.photographerId)
      return { label: "Photographer", color: "bg-blue-100 text-blue-800" };
    if (image.locationId)
      return { label: "Location", color: "bg-green-100 text-green-800" };
    if (image.eventId)
      return { label: "Event", color: "bg-purple-100 text-purple-800" };
    return { label: "Other", color: "bg-gray-100 text-gray-800" };
  };

  const category = getImageCategory();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={image.url}
          alt={image.caption || "Content"}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
        {image.isPrimary && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
            Primary
          </span>
        )}
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${category.color}`}
        >
          {category.label}
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">
            {new Date(image.createdAt).toLocaleDateString()}
          </p>
          <div className="text-xs text-gray-400">
            ID:{" "}
            {image.photographerId || image.locationId || image.eventId || "N/A"}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onView(image)}
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          <div className="flex space-x-2">
            {!image.isPrimary && (
              <button
                onClick={() => onSetPrimary(image.id)}
                disabled={loading}
                className="flex items-center text-green-600 hover:text-green-800 text-sm disabled:opacity-50"
              >
                <Star className="w-4 h-4 mr-1" />
                Primary
              </button>
            )}
            <button
              onClick={() => onDelete(image.id)}
              disabled={loading}
              className="flex items-center text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Review Card Component (Updated)
const ReviewCard: React.FC<{
  review: ReviewItem;
  onDelete: (id: number) => void;
  loading?: boolean;
}> = ({ review, onDelete, loading }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
      </div>
      <button
        onClick={() => onDelete(review.id)}
        disabled={loading}
        className="text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <p className="text-gray-700 mb-2">{review.comment}</p>
    <p className="text-xs text-gray-500">
      {new Date(review.createdAt).toLocaleDateString()}
    </p>
  </div>
);

// Venue Card Component (New)
const VenueCard: React.FC<{
  venue: VenueModerationItem;
  onViewDetails: (venue: VenueModerationItem) => void;
}> = ({ venue, onViewDetails }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-900">{venue.venueName}</h3>
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          venue.isActive
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {venue.isActive ? "Active" : "Inactive"}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{venue.address}</p>
    <p className="text-xs text-gray-500 mb-3">Owner: {venue.ownerName}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-900">
        {venue.hourlyRate ? `$${venue.hourlyRate}/hr` : "Price not set"}
      </span>
      <button
        onClick={() => onViewDetails(venue)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        <Eye className="w-4 h-4 mr-1" />
        View
      </button>
    </div>
  </div>
);

// Event Card Component (New)
const EventCard: React.FC<{
  event: EventModerationItem;
  onViewDetails: (event: EventModerationItem) => void;
}> = ({ event, onViewDetails }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-900">{event.eventName}</h3>
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {event.status}
      </span>
    </div>
    <p className="text-sm text-gray-600 mb-2">{event.locationName}</p>
    <div className="flex items-center text-xs text-gray-500 mb-2">
      <Calendar className="w-3 h-3 mr-1" />
      {new Date(event.startDate).toLocaleDateString()} -{" "}
      {new Date(event.endDate).toLocaleDateString()}
    </div>
    <div className="flex justify-between items-center">
      <div className="text-sm">
        <span className="text-gray-500">Applications: </span>
        <span className="font-medium">{event.applicationsCount}</span>
      </div>
      <button
        onClick={() => onViewDetails(event)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
      >
        <Eye className="w-4 h-4 mr-1" />
        View
      </button>
    </div>
  </div>
);

// Main Component
const ContentModeration: React.FC = () => {
  const {
    loading,
    images,
    reviews,
    photographers,
    venues,
    events,
    stats,
    activeTab,
    apiStatus,
    setActiveTab,
    deleteImage,
    deleteReview,
    setImagePrimary,
    verifyPhotographer,
    testAPI,
    refreshData,
  } = useContentModeration();

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [imageFilter, setImageFilter] = useState<
    "all" | "photographer" | "location" | "event"
  >("all");

  // Filter images by category
  const filteredImages = images.filter((image) => {
    if (imageFilter === "all") return true;
    if (imageFilter === "photographer") return image.photographerId;
    if (imageFilter === "location") return image.locationId;
    if (imageFilter === "event") return image.eventId;
    return true;
  });

  // Get image counts by category
  const imageCounts = {
    all: images.length,
    photographer: images.filter((img) => img.photographerId).length,
    location: images.filter((img) => img.locationId).length,
    event: images.filter((img) => img.eventId).length,
  };

  const handleDeleteImage = async (imageId: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteImage(imageId);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId);
    }
  };

  const handleSetImagePrimary = async (imageId: number) => {
    await setImagePrimary(imageId);
  };

  const handleVerifyPhotographer = async (
    id: number,
    status: VerificationStatus,
    notes?: string
  ) => {
    await verifyPhotographer(id, status, notes);
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const tabs: { key: ContentType; label: string; icon: any; count: number }[] =
    [
      { key: "images", label: "Images", icon: ImageIcon, count: images.length },
      {
        key: "reviews",
        label: "Reviews",
        icon: MessageSquare,
        count: reviews.length,
      },
      {
        key: "photographers",
        label: "Photographers",
        icon: Users,
        count: photographers.length,
      },
      { key: "venues", label: "Venues", icon: MapPin, count: venues.length },
      { key: "events", label: "Events", icon: Calendar, count: events.length },
    ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              Content Moderation
            </h1>
            <p className="mt-2 text-gray-600">
              Review and moderate user-generated content
            </p>
            {apiStatus && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
                <strong>API Status:</strong> {apiStatus}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={testAPI}
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-lg"
            >
              <Shield className="w-4 h-4" />
              <span>Test API</span>
            </button>
            <button
              onClick={refreshData}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <StatsDashboard stats={stats} />

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-5 h-5 inline mr-2" />
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading content...</p>
        </div>
      ) : (
        <>
          {/* Images Tab */}
          {activeTab === "images" && (
            <div>
              {/* Image Category Filter */}
              <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Filter by Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "All Images", count: imageCounts.all },
                    {
                      key: "photographer",
                      label: "Photographer Portfolio",
                      count: imageCounts.photographer,
                    },
                    {
                      key: "location",
                      label: "Location Photos",
                      count: imageCounts.location,
                    },
                    {
                      key: "event",
                      label: "Event Photos",
                      count: imageCounts.event,
                    },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setImageFilter(filter.key as any)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        imageFilter === filter.key
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onDelete={handleDeleteImage}
                    onView={handleViewDetails}
                    onSetPrimary={handleSetImagePrimary}
                    loading={loading}
                  />
                ))}
                {filteredImages.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    {imageFilter === "all"
                      ? "No images found"
                      : `No ${imageFilter} images found`}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onDelete={handleDeleteReview}
                  loading={loading}
                />
              ))}
              {reviews.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No reviews found
                </div>
              )}
            </div>
          )}

          {/* Photographers Tab */}
          {activeTab === "photographers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photographers.map((photographer) => (
                <PhotographerCard
                  key={photographer.id}
                  photographer={photographer}
                  onVerify={handleVerifyPhotographer}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                />
              ))}
              {photographers.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No photographers found
                </div>
              )}
            </div>
          )}

          {/* Venues Tab */}
          {activeTab === "venues" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onViewDetails={handleViewDetails}
                />
              ))}
              {venues.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No venues found
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                />
              ))}
              {events.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No events found
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <ContentDetailModal
        content={selectedItem}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedItem(null);
        }}
        onApprove={(id) => {
          // Handle approval based on content type
          console.log("Approve:", id);
        }}
        onReject={(id) => {
          // Handle rejection based on content type
          console.log("Reject:", id);
        }}
      />
    </div>
  );
};

export default ContentModeration;
