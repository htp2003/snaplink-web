import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, Lock, Unlock, X, Loader2 } from "lucide-react";

interface SimpleUser {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profileImage?: string;
  bio?: string;
  createAt: string;
  updateAt: string;
  status: string;
  [key: string]: any;
}

// Delete User Confirmation Modal
interface DeleteUserModalProps {
  user: SimpleUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: SimpleUser) => Promise<void>;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setConfirmText("");
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    if (confirmText !== "DELETE") {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(user);
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const isConfirmValid = confirmText === "DELETE";

  const modalContent = (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800">
                  Warning: Permanent Deletion
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  You are about to permanently delete the user account for{" "}
                  <strong>{user.fullName}</strong>. This will:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  <li>Remove all user data permanently</li>
                  <li>Delete associated bookings and transactions</li>
                  <li>Cannot be recovered after deletion</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">User Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Username:</strong> @{user.userName}
              </p>
              <p>
                <strong>User ID:</strong> {user.userId}
              </p>
              <p>
                <strong>Status:</strong> {user.status}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">
                DELETE
              </code>{" "}
              to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Type DELETE to confirm"
              disabled={loading}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmValid || loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Toggle Status Confirmation Modal
interface ToggleStatusModalProps {
  user: SimpleUser | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (user: SimpleUser) => Promise<void>;
}

export const ToggleStatusModal: React.FC<ToggleStatusModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);

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

  if (!isOpen || !user) return null;

  const isLocking = user.status === "Active";
  const newStatus = isLocking ? "Inactive" : "Active";
  const action = isLocking ? "lock" : "unlock";
  const actionText = isLocking ? "Lock" : "Unlock";

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(user);
      onClose();
    } catch (error) {
      console.error("Toggle status error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className={`p-3 rounded-full ${
                isLocking ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {isLocking ? (
                <Lock className="w-6 h-6 text-red-600" />
              ) : (
                <Unlock className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {actionText} User Account
              </h3>
              <p className="text-sm text-gray-600">
                Change user account status
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div
            className={`mb-4 p-4 border rounded-lg ${
              isLocking
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  isLocking ? "text-red-600" : "text-green-600"
                }`}
              />
              <div>
                <h4
                  className={`font-medium ${
                    isLocking ? "text-red-800" : "text-green-800"
                  }`}
                >
                  {isLocking ? "Lock User Account" : "Unlock User Account"}
                </h4>
                <p
                  className={`mt-1 text-sm ${
                    isLocking ? "text-red-700" : "text-green-700"
                  }`}
                >
                  {isLocking ? (
                    <>
                      This will prevent <strong>{user.fullName}</strong> from
                      accessing their account. They will not be able to log in
                      or use the system until unlocked.
                    </>
                  ) : (
                    <>
                      This will restore access for{" "}
                      <strong>{user.fullName}</strong>. They will be able to log
                      in and use the system normally.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">User Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Name:</strong> {user.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Current Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </p>
              <p>
                <strong>New Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    newStatus === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {newStatus}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2 ${
              isLocking
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isLocking ? "Locking..." : "Unlocking..."}</span>
              </>
            ) : (
              <>
                {isLocking ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
                <span>{actionText} User</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
