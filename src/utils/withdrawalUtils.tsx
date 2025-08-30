// utils/withdrawalUtils.tsx
import React from "react";
import { ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { WithdrawalRequest } from "../types/admin/Withdrawal.types";

// Check if rejectionReason field contains an image URL
export const isImageUrl = (text: string): boolean => {
  if (!text) return false;

  // Check for common image hosting domains and file extensions
  const imagePatterns = [
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i, // Direct image URLs
    /^https?:\/\/(.*\.)?imgur\.com\/.+/i, // Imgur
    /^https?:\/\/(.*\.)?ibb\.co\/.+/i, // ImgBB
    /^https?:\/\/(.*\.)?postimg\.cc\/.+/i, // PostImg
    /^https?:\/\/(.*\.)?imgbb\.com\/.+/i, // ImgBB alternative
    /^https?:\/\/(.*\.)?cloudinary\.com\/.+/i, // Cloudinary
    /^https?:\/\/(.*\.)?drive\.google\.com\/.+/i, // Google Drive
    /^https?:\/\/(.*\.)?dropbox\.com\/.+/i, // Dropbox
  ];

  return imagePatterns.some((pattern) => pattern.test(text));
};

// Convert hosting service URLs to direct image URLs
export const getDirectImageUrl = (url: string): string => {
  if (!url) return url;

  // ImgBB: https://ibb.co/ynXkc7f8 → https://i.ibb.co/ynXkc7f8/image.jpg
  const ibbMatch = url.match(/https?:\/\/ibb\.co\/([a-zA-Z0-9]+)/);
  if (ibbMatch) {
    const imageId = ibbMatch[1];
    return `https://i.ibb.co/${imageId}/bill.jpg`;
  }

  // Imgur: https://imgur.com/abc123 → https://i.imgur.com/abc123.jpg
  const imgurMatch = url.match(
    /https?:\/\/(.*\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)/
  );
  if (imgurMatch) {
    const imageId = imgurMatch[2];
    return `https://i.imgur.com/${imageId}.jpg`;
  }

  // Return original URL if no conversion needed
  return url;
};

// Get display type for rejectionReason field
export const getRejectionReasonType = (
  rejectionReason: string | null | undefined
): "image" | "text" | "none" => {
  if (!rejectionReason) return "none";
  return isImageUrl(rejectionReason) ? "image" : "text";
};

// Render bill image section
export const renderBillImageSection = (
  rejectionReason: string,
  title: string = "Hình ảnh hóa đơn chuyển tiền"
) => {
  const directImageUrl = getDirectImageUrl(rejectionReason);

  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2 text-gray-700">{title}</h4>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="space-y-3">
          <a
            href={rejectionReason}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-900 underline text-sm break-all block"
          >
            {rejectionReason}
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(rejectionReason, "_blank")}
              className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Xem full size
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(rejectionReason);
                toast.success("Đã copy link!");
              }}
              className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
            >
              Copy link
            </button>
          </div>

          {/* Image preview - Try multiple URLs */}
          <div className="mt-3">
            <div className="border rounded-lg overflow-hidden bg-white">
              <img
                src={directImageUrl}
                alt="Hóa đơn chuyển tiền"
                className="w-full max-h-60 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(rejectionReason, "_blank")}
                onError={(e) => {
                  const target = e.currentTarget;

                  // Try original URL if direct URL fails
                  if (target.src !== rejectionReason) {
                    target.src = rejectionReason;
                    return;
                  }

                  // Show fallback if both URLs fail
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="p-8 text-center text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded">
                        <div class="mb-2 text-2xl">🖼️</div>
                        <div class="font-medium mb-1">Không thể hiển thị ảnh</div>
                        <div>Click "Xem full size" để mở ảnh</div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Click vào ảnh để xem full size
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render rejection reason section
export const renderRejectionReasonSection = (rejectionReason: string) => {
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2 text-gray-700">Lý do từ chối</h4>
      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
        <p className="text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          {rejectionReason}
        </p>
      </div>
    </div>
  );
};

// Main function to render rejectionReason field intelligently
export const renderRejectionReasonField = (withdrawal: WithdrawalRequest) => {
  if (!withdrawal.rejectionReason) {
    return null;
  }

  const isImage = isImageUrl(withdrawal.rejectionReason);

  if (isImage) {
    return renderBillImageSection(withdrawal.rejectionReason);
  } else {
    return renderRejectionReasonSection(withdrawal.rejectionReason);
  }
};
