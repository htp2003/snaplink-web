// types/common.types.ts
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedRoles: ('admin' | 'moderator')[];
  index?: boolean;
}