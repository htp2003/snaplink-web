// src/pages/moderator/ContentModeration.jsx
import { useState, useEffect } from 'react';
import { contents } from '../../mockData';
import { Search, CheckCircle, XCircle } from 'lucide-react';

function ContentModeration() {
    const [contentList, setContentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            // Chỉ lấy nội dung đang chờ duyệt
            const pendingContents = contents.filter(content => content.status === 'pending');
            setContentList(pendingContents);
            setLoading(false);
        }, 1000);
    }, []);

    const handleApprove = (id) => {
        setContentList(contentList.map(item =>
            item.id === id ? { ...item, status: 'approved' } : item
        ));
        toast.success('Đã duyệt nội dung');
    };

    const handleReject = (id) => {
        setContentList(contentList.map(item =>
            item.id === id ? { ...item, status: 'rejected' } : item
        ));
        toast.success('Đã từ chối nội dung');
    };

    // Lọc nội dung theo tìm kiếm
    const filteredContents = contentList.filter(content =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Kiểm duyệt nội dung</h1>

            <div className="mb-6 flex justify-between">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nội dung..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-40 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredContents.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            Không có nội dung nào cần duyệt
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nội dung
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Người đăng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredContents.map(content => (
                                    <tr key={content.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{content.title}</div>
                                            <div className="text-sm text-gray-500">{content.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium">{content.user.name}</div>
                                            <div className="text-sm text-gray-500">{content.user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {content.type === 'photographer_profile' ? 'Hồ sơ nhiếp ảnh gia' :
                                                    content.type === 'venue_photos' ? 'Ảnh địa điểm' : 'Bộ sưu tập ảnh'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleApprove(content.id)}
                                                className="text-green-600 hover:text-green-900 mr-3 flex items-center"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                                            </button>
                                            <button
                                                onClick={() => handleReject(content.id)}
                                                className="text-red-600 hover:text-red-900 flex items-center"
                                            >
                                                <XCircle className="w-4 h-4 mr-1" /> Từ chối
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default ContentModeration;