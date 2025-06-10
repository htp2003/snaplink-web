export interface ContentModeration {
  id: number;
  type: 'photographer_profile' | 'venue_photos' | 'photographer_portfolio';
  user: {
    name: string;
    email: string;
  };
  title: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const mockContents: ContentModeration[] = [
  {
    id: 1,
    type: 'photographer_profile',
    user: { name: 'Trần Thị B', email: 'tranthib@gmail.com' },
    title: 'Cập nhật hồ sơ nhiếp ảnh gia',
    description: 'Chuyên chụp ảnh cưới, ảnh sự kiện và ảnh thể thao',
    createdAt: '2025-05-15T10:30:00',
    status: 'pending'
  },
  {
    id: 2,
    type: 'venue_photos',
    user: { name: 'Lê Văn C', email: 'levanc@gmail.com' },
    title: 'Thêm ảnh cho địa điểm',
    description: 'Thêm 5 ảnh mới cho quán cafe',
    createdAt: '2025-05-14T14:20:00',
    status: 'pending'
  },
  {
    id: 3,
    type: 'photographer_portfolio',
    user: { name: 'Hoàng Văn E', email: 'hoangvane@gmail.com' },
    title: 'Thêm ảnh vào bộ sưu tập',
    description: 'Bộ ảnh nghệ thuật đường phố',
    createdAt: '2025-05-13T09:15:00',
    status: 'approved'
  },
];