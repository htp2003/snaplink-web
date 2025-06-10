export interface AuthUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator';
}

export const mockAuthUsers: AuthUser[] = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@snaplink.com',
    password: 'password',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Moderator',
    email: 'moderator@snaplink.com',
    password: 'password',
    role: 'moderator'
  }
];