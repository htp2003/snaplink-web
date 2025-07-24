// src/components/admin/ContentModeration/ContentModeration.tsx

import React, { useState } from "react";
import {
  Shield,
  Image as ImageIcon,
  MessageSquare,
  Trash2,
  RefreshCw,
  Eye,
  X,
} from "lucide-react";
import { useContentModeration } from "../../../hooks/ContentModeration.hooks";
import { ImageItem, ReviewItem } from "../../../types/ContentModeration.types";

// Image Card Component
const ImageCard: React.FC<{
  image: ImageItem;
  onDelete: (id: number) => void;
  onView: (image: ImageItem) => void;
}> = ({ image, onDelete, onView }) => (
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
    </div>
    <div className="p-3">
      <p className="text-xs text-gray-500 mb-2">
        {new Date(image.createdAt).toLocaleDateString()}
      </p>
      <div className="flex justify-between items-center">
        <button
          onClick={() => onView(image)}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        <button
          onClick={() => onDelete(image.id)}
          className="flex items-center text-red-600 hover:text-red-800 text-sm"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  </div>
);

// Review Card Component
const ReviewCard: React.FC<{
  review: ReviewItem;
  onDelete: (id: number) => void;
}> = ({ review, onDelete }) => (
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
        className="text-red-600 hover:text-red-800"
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

// Image Modal Component
const ImageModal: React.FC<{
  image: ImageItem | null;
  onClose: () => void;
}> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Image Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <img
            src={image.url}
            alt={image.caption || "Content"}
            className="w-full rounded-lg mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/600x400?text=No+Image";
            }}
          />
          <div className="space-y-2">
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
            <p>
              <strong>ID:</strong> {image.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ContentModeration: React.FC = () => {
  const {
    loading,
    images,
    reviews,
    activeTab,
    apiStatus,
    setActiveTab,
    deleteImage,
    deleteReview,
    testAPI,
    refreshData,
  } = useContentModeration();

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

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

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("images")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "images"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ImageIcon className="w-5 h-5 inline mr-2" />
              Images ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Reviews ({reviews.length})
            </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onDelete={handleDeleteImage}
                  onView={setSelectedImage}
                />
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No images found
                </div>
              )}
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
                />
              ))}
              {reviews.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No reviews found
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default ContentModeration;
