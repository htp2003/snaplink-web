// components/dashboard/QuickActions.tsx
import React from "react";
import { AlertTriangle, Clock, FileX, Eye } from "lucide-react";

interface QuickActionsProps {
  userRole: string;
  pendingWithdrawals: number;
  pendingVerifications: number;
  reportedContent: number;
  withdrawalsList?: any[];
  verificationsList?: any[];
}

const QuickActions: React.FC<QuickActionsProps> = ({
  userRole,
  pendingWithdrawals,
  pendingVerifications,
  reportedContent,
  withdrawalsList = [],
  verificationsList = [],
}) => {
  const actions = [
    {
      title: "Yêu cầu rút tiền",
      count: pendingWithdrawals,
      icon: Clock,
      color: "orange",
      href: "/admin/withdrawals?status=pending",
      urgent: pendingWithdrawals > 5,
    },
    {
      title: "Chờ xác thực",
      count: pendingVerifications,
      icon: AlertTriangle,
      color: "red",
      href: "/admin/verifications?status=pending",
      urgent: pendingVerifications > 3,
    },
    {
      title: "Nội dung báo cáo",
      count: reportedContent,
      icon: FileX,
      color: "purple",
      href: "/admin/reports?status=pending",
      urgent: reportedContent > 0,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cần xử lý</h3>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
              action.urgent
                ? "border-red-200 bg-red-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <action.icon
                  className={`w-5 h-5 ${
                    action.urgent ? "text-red-600" : "text-gray-600"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-sm text-gray-500">
                    {action.count} mục cần xử lý
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  action.urgent
                    ? "bg-red-100 text-red-800"
                    : action.count > 0
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {action.count}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Withdrawals Preview */}
      {withdrawalsList.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Rút tiền gần đây
          </h4>
          <div className="space-y-2">
            {withdrawalsList.slice(0, 3).map((withdrawal, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 truncate">
                  {withdrawal.userName}
                </span>
                <span className="font-medium text-red-600">
                  -{withdrawal.amount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Verifications Preview */}
      {verificationsList.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Xác thực gần đây
          </h4>
          <div className="space-y-2">
            {verificationsList.slice(0, 3).map((verification, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600 truncate">
                  {verification.userName}
                </span>
                <span className="text-xs text-orange-600 capitalize">
                  {verification.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
