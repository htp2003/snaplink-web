import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface SimpleModalTestProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId?: number;
  data?: any;
}

const SimpleModalTest: React.FC<SimpleModalTestProps> = ({
  isOpen,
  onClose,
  complaintId,
  data,
}) => {
  console.log("🔍 SimpleModalTest render:", {
    isOpen,
    complaintId,
    hasData: !!data,
  });

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6 z-[10000]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              Simple Modal Test - Complaint #{complaintId}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="bg-green-100 p-4 rounded">
              ✅ Modal is rendering successfully!
            </div>

            <div className="bg-blue-100 p-4 rounded">
              <p>
                <strong>Complaint ID:</strong> {complaintId}
              </p>
              <p>
                <strong>Has Data:</strong> {data ? "Yes" : "No"}
              </p>
              <p>
                <strong>Modal Open:</strong> {isOpen ? "Yes" : "No"}
              </p>
            </div>

            {data && (
              <div className="bg-gray-100 p-4 rounded">
                <h4 className="font-medium mb-2">Data:</h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render to document.body to avoid z-index issues
  return createPortal(modalContent, document.body);
};

export default SimpleModalTest;
