export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'photographer' | 'venue_owner' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
}

export const mockUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'user', status: 'active' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', role: 'photographer', status: 'active' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', role: 'venue_owner', status: 'active' },
  { id: 4, name: 'Phạm Thị D', email: 'phamthid@gmail.com', role: 'user', status: 'inactive' },
  { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', role: 'photographer', status: 'pending' },
];