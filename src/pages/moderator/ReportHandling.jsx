// src/pages/moderator/ReportHandling.jsx
import { useState, useEffect } from 'react';

// Dữ liệu báo cáo mẫu
const reportsData = [
    {
        id: 1,
        type: 'content',
        reportedBy: { name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' },
        content: { id: 3, title: 'Bộ ảnh nghệ thuật đường phố', type: 'photographer_portfolio' },
        reason: 'Nội dung không phù hợp',
        createdAt: '2025-05-18T10:30:00',
        status: 'pending'
    },
    {
        id: 2,
        type: 'user',
        reportedBy: { name: 'Trần Thị B', email: 'tranthib@gmail.com' },
        user: { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com' },
        reason: 'Hành vi quấy rối',
        createdAt: '2025-05-17T14:20:00',
        status: 'pending'
    }
];

function ReportHandling() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            setReports(reportsData);
            setLoading(false);
        }, 1000);
    }, []);

    const handleResolve = (id) => {
        setReports(reports.map(report =>
            report.id === id ? { ...report, status: 'resolved' } : report
        ));
    };

    const handleIgnore = (id) => {
        setReports(reports.map(report =>
            report.id === id ? { ...report, status: 'ignored' } : report
        ));
    };

    if (loading) {
        return (
            <div className="h-40 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Xử lý báo cáo</h1>

            {reports.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    Không có báo cáo nào cần xử lý
                </div>
            ) : (
                <div className="space-y-6">
                    {reports.map(report => (
                        <div key={report.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                    Báo cáo {report.type === 'content' ? 'nội dung' : 'người dùng'}
                                </h2>
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                    {report.status === 'pending' ? 'Chờ xử lý' :
                                        report.status === 'resolved' ? 'Đã xử lý' : 'Đã bỏ qua'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Người báo cáo:</p>
                                    <p className="font-medium">{report.reportedBy.name}</p>
                                    <p className="text-sm text-gray-500">{report.reportedBy.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {report.type === 'content' ? 'Nội dung bị báo cáo:' : 'Người dùng bị báo cáo:'}
                                    </p>
                                    <p className="font-medium">
                                        {report.type === 'content' ? report.content.title : report.user.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {report.type === 'content' ? report.content.type : report.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-1">Lý do báo cáo:</p>
                                <p className="bg-gray-50 p-3 rounded-md">{report.reason}</p>
                            </div>

                            {report.status === 'pending' && (
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => handleIgnore(report.id)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                    >
                                        Bỏ qua
                                    </button>
                                    <button
                                        onClick={() => handleResolve(report.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        Xử lý
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ReportHandling;