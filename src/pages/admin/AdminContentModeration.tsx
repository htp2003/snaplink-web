import React, { useState, useEffect } from "react";
import { mockContents, type ContentModeration } from "../../mocks/content";
import ContentDetailModal from "../../components/admin/modals/ContentDetailModal";

const ContentModeration: React.FC = () => {
  const [contentList, setContentList] = useState<ContentModeration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] =
    useState<ContentModeration | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setContentList(mockContents);
      setLoading(false);
    }, 500);
  }, []);

  const getTypeLabel = (type: ContentModeration["type"]): string => {
    switch (type) {
      case "photographer_profile":
        return "Hồ sơ nhiếp ảnh gia";
      case "venue_photos":
        return "Ảnh địa điểm";
      case "photographer_portfolio":
        return "Bộ sưu tập ảnh";
      default:
        return "Khác";
    }
  };

  const getStatusColor = (status: ContentModeration["status"]): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewContent = (content: ContentModeration) => {
    setSelectedContent(content);
    setShowModal(true);
  };

  const handleApprove = (id: number) => {
    setContentList((prev) =>
      prev.map((content) =>
        content.id === id ? { ...content, status: "approved" } : content
      )
    );
  };

  const handleReject = (id: number) => {
    setContentList((prev) =>
      prev.map((content) =>
        content.id === id ? { ...content, status: "rejected" } : content
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kiểm duyệt nội dung</h1>

      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người gửi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contentList.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {content.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {content.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {content.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {content.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(content.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        content.status
                      )}`}
                    >
                      {content.status === "approved"
                        ? "Đã duyệt"
                        : content.status === "rejected"
                        ? "Đã từ chối"
                        : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewContent(content)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Xem
                    </button>
                    {content.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(content.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(content.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Content Detail Modal */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
export default ContentModeration;
