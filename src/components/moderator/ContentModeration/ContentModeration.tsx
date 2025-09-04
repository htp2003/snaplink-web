import React, { useState } from "react";
import {
  Shield,
  Image as ImageIcon,
  Star, // Changed from MessageSquare to Star for ratings
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
  ChevronRight,
  ArrowLeft,
  Grid3X3,
  List,
  Filter,
  Search,
  Camera,
  Building,
  Clock,
  DollarSign,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useContentModeration } from "../../../hooks/moderator/ContentModeration.hooks";
import {
  ImageItem,
  RatingItem, // Changed from ReviewItem
  PhotographerModerationItem,
  VenueModerationItem,
  EventModerationItem,
  ContentType,
  VerificationStatus,
  BookingStatus,
} from "../../../types/moderator/ContentModeration.types";
import ContentDetailModal from "./ContentDetailModal";

// ===== NAVIGATION INTERFACES (Keep existing) =====
interface NavigationState {
  level: "category" | "itemList" | "imageList";
  category?: string;
  selectedItem?: any;
}

interface PhotographerListItem {
  photographerId: number;
  userId: number;
  fullName: string;
  hourlyRate?: number;
  rating?: number;
  profileImage?: string;
  availabilityStatus?: string;
  verificationStatus?: string;
  styles?: string[];
}

interface LocationListItem {
  locationId: number;
  name: string;
  address: string;
  hourlyRate?: number;
  capacity?: number;
  availabilityStatus?: string;
  locationOwner?: {
    businessName?: string;
  };
}

interface EventListItem {
  id: number;
  name: string;
  locationName?: string;
  startDate: string;
  endDate: string;
  status?: string;
  applicationsCount?: number;
}

// Stats Dashboard Component (unchanged)
const StatsDashboard: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      title: "Pending Review",
      value: stats.totalPending,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      title: "Approved",
      value: stats.totalApproved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Rejected",
      value: stats.totalRejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      title: "Total Ratings", // Changed from "Total Images"
      value: stats.totalRatings,
      icon: Star, // Changed icon
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-6 shadow-sm border ${stat.borderColor}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===== IMAGE CATEGORIES OVERVIEW (Keep existing) =====
const ImageCategoriesOverview: React.FC<{
  images: ImageItem[];
  photographers: PhotographerModerationItem[];
  venues: VenueModerationItem[];
  events: EventModerationItem[];
  onSelectCategory: (category: string) => void;
}> = ({ images, photographers, venues, events, onSelectCategory }) => {
  const categories = [
    {
      key: "photographer",
      title: "Photographer Portfolios",
      description: "Profile and portfolio images from photographers",
      icon: Camera,
      color: "blue",
      count: photographers.length,
      itemLabel: "photographers",
    },
    {
      key: "location",
      title: "Location Photos",
      description: "Images showcasing venues and shooting locations",
      icon: Building,
      color: "green",
      count: venues.length,
      itemLabel: "locations",
    },
    {
      key: "event",
      title: "Event Photos",
      description: "Images from photography events and sessions",
      icon: Calendar,
      color: "purple",
      count: events.length,
      itemLabel: "events",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        hover: "hover:bg-blue-100",
        icon: "text-blue-500",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
        hover: "hover:bg-green-100",
        icon: "text-green-500",
      },
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        hover: "hover:bg-purple-100",
        icon: "text-purple-500",
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Image Categories
        </h2>
        <div className="text-sm text-gray-500">
          Total: {images.length} images across all categories
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const colors = getColorClasses(category.color);
          return (
            <button
              key={category.key}
              onClick={() => onSelectCategory(category.key)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${colors.bg} ${colors.border} ${colors.hover} group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <category.icon className={`w-5 h-5 mr-2 ${colors.icon}`} />
                    <h3 className={`font-semibold ${colors.text}`}>
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${colors.text}`}>
                      {category.count}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.itemLabel}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 ${colors.text} group-hover:translate-x-1 transition-transform`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ===== PHOTOGRAPHER LIST COMPONENTS (Keep existing) =====
const PhotographerListView: React.FC<{
  photographers: PhotographerModerationItem[];
  onBack: () => void;
  onSelectPhotographer: (photographer: PhotographerModerationItem) => void;
  loading?: boolean;
}> = ({ photographers, onBack, onSelectPhotographer, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPhotographers = photographers.filter(
    (photographer) =>
      photographer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photographer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Photographers ({filteredPhotographers.length})
            </h2>
            <p className="text-sm text-gray-500">
              Select a photographer to view their images
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search photographers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Photographer List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photographers...</p>
        </div>
      ) : filteredPhotographers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No photographers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotographers.map((photographer) => (
            <PhotographerListCard
              key={photographer.id}
              photographer={photographer}
              onClick={() => onSelectPhotographer(photographer)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PhotographerListCard: React.FC<{
  photographer: PhotographerModerationItem;
  onClick: () => void;
}> = ({ photographer, onClick }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {photographer.profileImage ? (
            <img
              src={photographer.profileImage}
              alt={photographer.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {photographer.fullName}
              </h3>
              <p className="text-sm text-gray-500">{photographer.email}</p>
            </div>
            {/* {photographer.verificationStatus && (
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  photographer.verificationStatus
                )}`}
              >
                {photographer.verificationStatus}
              </span>
            )} */}
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">
                  {i < Math.floor(photographer.averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {photographer.averageRating.toFixed(1)} (
              {photographer.totalReviews} ratings)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {photographer.yearsExperience} years experience
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </button>
  );
};

// ===== LOCATION LIST COMPONENTS (Keep existing) =====
const LocationListView: React.FC<{
  venues: VenueModerationItem[];
  onBack: () => void;
  onSelectLocation: (venue: VenueModerationItem) => void;
  loading?: boolean;
}> = ({ venues, onBack, onSelectLocation, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVenues = venues.filter(
    (venue) =>
      venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Locations ({filteredVenues.length})
            </h2>
            <p className="text-sm text-gray-500">
              Select a location to view its images
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Location List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No locations found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <LocationListCard
              key={venue.id}
              venue={venue}
              onClick={() => onSelectLocation(venue)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const LocationListCard: React.FC<{
  venue: VenueModerationItem;
  onClick: () => void;
}> = ({ venue, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
          {venue.venueName}
        </h3>
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ml-2 ${venue.isActive
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
        >
          {venue.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">{venue.address}</p>
        </div>
        {venue.ownerName && (
          <div className="flex items-center">
            <Users className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600">Owner: {venue.ownerName}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">
          {venue.hourlyRate
            ? `${venue.hourlyRate.toLocaleString()}đ/hr`
            : "Free"}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );
};

// ===== EVENT LIST COMPONENTS (Keep existing) =====
const EventListView: React.FC<{
  events: EventModerationItem[];
  onBack: () => void;
  onSelectEvent: (event: EventModerationItem) => void;
  loading?: boolean;
}> = ({ events, onBack, onSelectEvent, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Events ({filteredEvents.length})
            </h2>
            <p className="text-sm text-gray-500">
              Select an event to view its images
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Event List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No events found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventListCard
              key={event.id}
              event={event}
              onClick={() => onSelectEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventListCard: React.FC<{
  event: EventModerationItem;
  onClick: () => void;
}> = ({ event, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
          {event.eventName}
        </h3>
        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200 ml-2">
          {event.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-1">
            {event.locationName}
          </p>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {new Date(event.startDate).toLocaleDateString()} -{" "}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">
            {event.applicationsCount} applications
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
      </div>
    </button>
  );
};

// ===== IMAGE GALLERY COMPONENT (Keep existing) =====
const ImageGallery: React.FC<{
  images: ImageItem[];
  itemInfo: { type: string; name: string; id: number };
  onBack: () => void;
  onDelete: (id: number) => void;
  onView: (image: ImageItem) => void;
  onSetPrimary: (id: number) => void;
  loading?: boolean;
}> = ({
  images,
  itemInfo,
  onBack,
  onDelete,
  onView,
  onSetPrimary,
  loading,
}) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredImages = images.filter(
      (img) =>
        searchTerm === "" ||
        (img.caption &&
          img.caption.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to {itemInfo.type} List
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {itemInfo.name}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredImages.length} images found
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search captions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Images */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No images found for this {itemInfo.type.toLowerCase()}
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-4"
            }
          >
            {filteredImages.map((image) =>
              viewMode === "grid" ? (
                <ImageGridCard
                  key={image.id}
                  image={image}
                  onDelete={onDelete}
                  onView={onView}
                  onSetPrimary={onSetPrimary}
                  loading={loading}
                />
              ) : (
                <ImageListItem
                  key={image.id}
                  image={image}
                  onDelete={onDelete}
                  onView={onView}
                  onSetPrimary={onSetPrimary}
                  loading={loading}
                />
              )
            )}
          </div>
        )}
      </div>
    );
  };

// ===== IMAGE CARD COMPONENTS (Keep existing) =====
const ImageGridCard: React.FC<{
  image: ImageItem;
  onDelete: (id: number) => void;
  onView: (image: ImageItem) => void;
  onSetPrimary: (id: number) => void;
  loading?: boolean;
}> = ({ image, onDelete, onView, onSetPrimary, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
    <div className="aspect-square bg-gray-100 relative overflow-hidden">
      <img
        src={image.url}
        alt={image.caption || "Content"}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/300x300?text=No+Image";
        }}
      />
      {image.isPrimary && (
        <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Primary
        </span>
      )}

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
        <button
          onClick={() => onView(image)}
          className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        {!image.isPrimary && (
          <button
            onClick={() => onSetPrimary(image.id)}
            disabled={loading}
            className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Set as Primary"
          >
            <Star className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(image.id)}
          disabled={loading}
          className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {image.caption && (
      <div className="p-3">
        <p className="text-sm text-gray-600 truncate" title={image.caption}>
          {image.caption}
        </p>
      </div>
    )}
  </div>
);

const ImageListItem: React.FC<{
  image: ImageItem;
  onDelete: (id: number) => void;
  onView: (image: ImageItem) => void;
  onSetPrimary: (id: number) => void;
  loading?: boolean;
}> = ({ image, onDelete, onView, onSetPrimary, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={image.url}
          alt={image.caption || "Content"}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/64x64?text=No+Image";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {image.caption || `Image ${image.id}`}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(image.createdAt).toLocaleDateString()}
              {image.isPrimary && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                  Primary
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(image)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!image.isPrimary && (
              <button
                onClick={() => onSetPrimary(image.id)}
                disabled={loading}
                className="text-yellow-600 hover:text-yellow-800 p-1 disabled:opacity-50"
                title="Set as Primary"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(image.id)}
              disabled={loading}
              className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ===== NEW: RATING CARD COMPONENT (Replace ReviewCard) =====
const RatingCard: React.FC<{
  rating: RatingItem;
  onDelete: (id: number) => void;
  onViewDetails: (rating: RatingItem) => void;
  loading?: boolean;
}> = ({ rating, onDelete, onViewDetails, loading }) => {
  const getBookingStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header with rating */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-lg">
                {i < rating.score ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            ({rating.score}/5)
          </span>
          <span className="text-xs text-gray-500">
            Booking ID: {rating.bookingId}
          </span>
        </div>
        <button
          onClick={() => onDelete(rating.id)}
          disabled={loading}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1"
          title="Delete Rating"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Basic Info (since we don't have booking details yet) */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Reviewer ID: {rating.reviewerUserId}
            </span>
            <span className="text-xs">
              {new Date(rating.createdAt).toLocaleDateString()}
            </span>
          </div>

          {rating.photographerId && (
            <div className="flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              <span>Photographer ID: {rating.photographerId}</span>
            </div>
          )}

          {rating.locationId && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Location ID: {rating.locationId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rating Comment */}
      {rating.comment && (
        <div className="mb-3">
          <p className="text-gray-700 line-clamp-3 text-sm">{rating.comment}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Rating ID: {rating.id}</span>
        <button
          onClick={() => onViewDetails(rating)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Photographer Card Component (simplified)
const PhotographerCard: React.FC<{
  photographer: PhotographerModerationItem;
  onVerify: (id: number, status: VerificationStatus, notes?: string) => void;
  onViewDetails: (photographer: PhotographerModerationItem) => void;
  loading?: boolean;
}> = ({ photographer, onVerify, onViewDetails, loading }) => {
  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return "bg-green-100 text-green-800 border-green-200";
      case VerificationStatus.REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      case VerificationStatus.SUSPENDED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
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
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {photographer.fullName}
              </h3>
              <p className="text-sm text-gray-500">{photographer.email}</p>
            </div>
            <span
              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                photographer.verificationStatus
              )}`}
            >
              {photographer.verificationStatus}
            </span>
          </div>

          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">
                  {i < Math.floor(photographer.averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {photographer.averageRating.toFixed(1)} (
              {photographer.totalReviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {photographer.yearsExperience} years experience
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onViewDetails(photographer)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </button>

              {photographer.verificationStatus ===
                VerificationStatus.PENDING && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        onVerify(photographer.id, VerificationStatus.REJECTED)
                      }
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        onVerify(photographer.id, VerificationStatus.VERIFIED)
                      }
                      disabled={loading}
                      className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT WITH RATING MANAGEMENT =====
const ContentModeration: React.FC = () => {
  const {
    loading,
    images,
    ratings, // Changed from reviews
    photographers,
    venues,
    events,
    stats,
    activeTab,
    apiStatus,
    setActiveTab,
    deleteImage,
    deleteRating, // Changed from deleteReview
    updateRating, // New method
    setImagePrimary,
    verifyPhotographer,
    testAPI,
    refreshData,
    // Item-specific image methods
    itemImages,
    itemImagesLoading,
    loadPhotographerImages,
    loadLocationImages,
    loadEventImages,
    clearItemImages,
  } = useContentModeration();

  // Navigation state
  const [navigationState, setNavigationState] = useState<NavigationState>({
    level: "category",
  });

  // Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleDeleteImage = async (imageId: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      await deleteImage(imageId);
    }
  };

  const handleDeleteRating = async (ratingId: number) => {
    if (confirm("Are you sure you want to delete this rating?")) {
      await deleteRating(ratingId);
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

  // Navigation handlers (keep existing)
  const handleSelectCategory = (category: string) => {
    setNavigationState({
      level: "itemList",
      category,
    });
    clearItemImages();
  };

  const handleSelectItem = async (item: any, category: string) => {
    setNavigationState({
      level: "imageList",
      category,
      selectedItem: item,
    });

    // Load images for this specific item
    if (category === "photographer") {
      const photographerId = item.photographerId || item.id;
      await loadPhotographerImages(photographerId);
    } else if (category === "location") {
      const locationId = item.locationId || item.id;
      await loadLocationImages(locationId);
    } else if (category === "event") {
      const eventId = item.id;
      await loadEventImages(eventId);
    }
  };

  const handleBackToCategories = () => {
    setNavigationState({
      level: "category",
    });
  };

  const handleBackToItemList = () => {
    setNavigationState({
      level: "itemList",
      category: navigationState.category,
    });
  };

  const getItemInfo = () => {
    if (!navigationState.selectedItem || !navigationState.category) {
      return { type: "", name: "", id: 0 };
    }

    const item = navigationState.selectedItem;

    if (navigationState.category === "photographer") {
      return {
        type: "Photographer",
        name: item.fullName || "Unknown Photographer",
        id: item.photographerId || item.id,
      };
    } else if (navigationState.category === "location") {
      return {
        type: "Location",
        name: item.name || item.venueName || "Unknown Location",
        id: item.locationId || item.id,
      };
    } else if (navigationState.category === "event") {
      return {
        type: "Event",
        name: item.name || item.eventName || "Unknown Event",
        id: item.id,
      };
    }

    return { type: "", name: "", id: 0 };
  };

  const tabs: { key: ContentType; label: string; icon: any; count: number }[] =
    [
      { key: "images", label: "Images", icon: ImageIcon, count: images.length },
      {
        key: "ratings", // Changed from "reviews"
        label: "Ratings", // Changed from "Reviews"
        icon: Star, // Changed from MessageSquare
        count: ratings.length, // Changed from reviews.length
      },
      // {
      //   key: "photographers",
      //   label: "Photographers",
      //   icon: Users,
      //   count: photographers.length,
      // },
      { key: "venues", label: "Venues", icon: MapPin, count: venues.length },
      { key: "events", label: "Events", icon: Calendar, count: events.length },
    ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-green-600" />
                Content Moderation
              </h1>
              <p className="mt-2 text-gray-600">
                Review and moderate user-generated content across the platform
              </p>

            </div>

          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard stats={stats} />

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-xl">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setNavigationState({ level: "category" }); // Reset navigation when switching tabs
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.key
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading content...</p>
            </div>
          ) : (
            <>
              {/* Images Tab - Enhanced with 3-level navigation */}
              {activeTab === "images" && (
                <>
                  {navigationState.level === "category" && (
                    <ImageCategoriesOverview
                      images={images}
                      photographers={photographers}
                      venues={venues}
                      events={events}
                      onSelectCategory={handleSelectCategory}
                    />
                  )}

                  {navigationState.level === "itemList" &&
                    navigationState.category === "photographer" && (
                      <PhotographerListView
                        photographers={photographers}
                        onBack={handleBackToCategories}
                        onSelectPhotographer={(photographer) =>
                          handleSelectItem(photographer, "photographer")
                        }
                        loading={loading}
                      />
                    )}

                  {navigationState.level === "itemList" &&
                    navigationState.category === "location" && (
                      <LocationListView
                        venues={venues}
                        onBack={handleBackToCategories}
                        onSelectLocation={(venue) =>
                          handleSelectItem(venue, "location")
                        }
                        loading={loading}
                      />
                    )}

                  {navigationState.level === "itemList" &&
                    navigationState.category === "event" && (
                      <EventListView
                        events={events}
                        onBack={handleBackToCategories}
                        onSelectEvent={(event) =>
                          handleSelectItem(event, "event")
                        }
                        loading={loading}
                      />
                    )}

                  {navigationState.level === "imageList" && (
                    <ImageGallery
                      images={itemImages}
                      itemInfo={getItemInfo()}
                      onBack={handleBackToItemList}
                      onDelete={handleDeleteImage}
                      onView={handleViewDetails}
                      onSetPrimary={handleSetImagePrimary}
                      loading={itemImagesLoading}
                    />
                  )}
                </>
              )}

              {/* Ratings Tab (Changed from Reviews Tab) */}
              {activeTab === "ratings" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Rating Management
                    </h2>
                    <div className="text-sm text-gray-500">
                      {ratings.length} ratings total
                    </div>
                  </div>

                  {ratings.length === 0 ? (
                    <div className="text-center py-12">
                      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No ratings found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ratings.map((rating) => (
                        <RatingCard
                          key={rating.id}
                          rating={rating}
                          onDelete={handleDeleteRating}
                          onViewDetails={handleViewDetails}
                          loading={loading}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Photographers Tab (unchanged) */}
              {activeTab === "photographers" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Photographer Verification
                    </h2>
                    <div className="text-sm text-gray-500">
                      {photographers.length} photographers total
                    </div>
                  </div>

                  {photographers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No photographers found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {photographers.map((photographer) => (
                        <PhotographerCard
                          key={photographer.id}
                          photographer={photographer}
                          onVerify={handleVerifyPhotographer}
                          onViewDetails={handleViewDetails}
                          loading={loading}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Venues Tab */}
              {activeTab === "venues" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Venue Management
                    </h2>
                    <div className="text-sm text-gray-500">
                      {venues.length} venues total
                    </div>
                  </div>

                  {venues.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No venues found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {venues.map((venue) => (
                        <VenueCard
                          key={venue.id}
                          venue={venue}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Event Management
                    </h2>
                    <div className="text-sm text-gray-500">
                      {events.length} events total
                    </div>
                  </div>

                  {events.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No events found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Modal */}
        <ContentDetailModal
          content={selectedItem}
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedItem(null);
          }}
          onApprove={(id) => {
            console.log("Approve:", id);
          }}
          onReject={(id) => {
            console.log("Reject:", id);
          }}
        />
      </div>
    </div>
  );
};

// Venue Card Component (unchanged)
const VenueCard: React.FC<{
  venue: VenueModerationItem;
  onViewDetails: (venue: VenueModerationItem) => void;
}> = ({ venue, onViewDetails }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
        {venue.venueName}
      </h3>
      <span
        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${venue.isActive
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-gray-100 text-gray-800 border border-gray-200"
          }`}
      >
        {venue.isActive ? "Active" : "Inactive"}
      </span>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-start">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-sm text-gray-600 line-clamp-2">{venue.address}</p>
      </div>
      <div className="flex items-center">
        <Users className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        <p className="text-sm text-gray-600">Owner: {venue.ownerName}</p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-lg font-semibold text-gray-900">
        {venue.hourlyRate ? `${venue.hourlyRate}/hr` : "Price not set"}
      </span>
      <button
        onClick={() => onViewDetails(venue)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        <Eye className="w-4 h-4 mr-1" />
        View Details
      </button>
    </div>
  </div>
);

// Event Card Component (unchanged)
const EventCard: React.FC<{
  event: EventModerationItem;
  onViewDetails: (event: EventModerationItem) => void;
}> = ({ event, onViewDetails }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
        {event.eventName}
      </h3>
      <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
        {event.status}
      </span>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex items-center">
        <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        <p className="text-sm text-gray-600 line-clamp-1">
          {event.locationName}
        </p>
      </div>
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        <p className="text-sm text-gray-600">
          {new Date(event.startDate).toLocaleDateString()} -{" "}
          {new Date(event.endDate).toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Users className="w-4 h-4 text-gray-400 mr-1" />
        <span className="text-sm text-gray-600">
          {event.applicationsCount} applications
        </span>
      </div>
      <button
        onClick={() => onViewDetails(event)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
      >
        <Eye className="w-4 h-4 mr-1" />
        View Details
      </button>
    </div>
  </div>
);

export default ContentModeration;
