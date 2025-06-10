export interface Booking {
  id: number;
  customerName: string;
  photographerName: string;
  venueName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const mockBookings: Booking[] = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    photographerName: 'Trần Thị B',
    venueName: 'Studio Ánh Sáng',
    date: '2025-05-25',
    time: '09:30',
    status: 'pending'
  },
  {
    id: 2,
    customerName: 'Lê Văn C',
    photographerName: 'Hoàng Văn E',
    venueName: 'Quán Cafe Sân Vườn',
    date: '2025-05-26',
    time: '14:00',
    status: 'confirmed'
  },
];