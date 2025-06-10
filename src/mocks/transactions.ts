export interface Transaction {
  id: number;
  relatedTo: string;
  amount: number;
  customerName: string;
  type: 'payment' | 'withdrawal' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    relatedTo: 'Đặt chỗ #1',
    amount: 1500000,
    customerName: 'Nguyễn Văn A',
    type: 'payment',
    status: 'completed',
    date: '2025-05-10'
  },
  {
    id: 2,
    relatedTo: 'Đặt chỗ #2',
    amount: 1200000,
    customerName: 'Lê Văn C',
    type: 'payment',
    status: 'completed',
    date: '2025-05-12'
  }
];