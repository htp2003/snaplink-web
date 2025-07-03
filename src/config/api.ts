// config/api.ts
export const API_BASE_URL =
  "https://snaplinkapi-g7eubeghazh5byd8.southeastasia-01.azurewebsites.net";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/Auth/login",

  // Users
  USERS_ALL: "/api/User/all",
  USERS_BY_ID: "/api/User/{userId}",
  USERS_BY_ROLE: "/api/User/by-role/{roleName}",
  USERS_CREATE_ADMIN: "/api/User/create-admin",
  USERS_CREATE_MODERATOR: "/api/User/create-moderator",
  USERS_UPDATE: "/api/User/update",
  USERS_DELETE: "/api/User/delete/{userId}",
  USERS_ASSIGN_ROLES: "/api/User/assign-roles",

  // Photographers
  PHOTOGRAPHERS_ALL: "/api/Photographer",
  PHOTOGRAPHERS_BY_ID: "/api/Photographer/{id}",
  PHOTOGRAPHERS_DETAIL: "/api/Photographer/{id}/detail",
  PHOTOGRAPHERS_CREATE: "/api/Photographer",
  PHOTOGRAPHERS_UPDATE: "/api/Photographer/{id}",
  PHOTOGRAPHERS_DELETE: "/api/Photographer/{id}",
  PHOTOGRAPHERS_VERIFY: "/api/Photographer/{id}/verify",

  // Locations/Venues
  LOCATIONS_ALL: "/api/Location/GetAllLocations",
  LOCATIONS_BY_ID: "/api/Location/GetLocationById",
  LOCATIONS_CREATE: "/api/Location/CreateLocation",
  LOCATIONS_UPDATE: "/api/Location/UpdateLocation",
  LOCATIONS_DELETE: "/api/Location/DeleteLocation",

  // Reviews
  REVIEWS_ALL: "/api/Review",
  REVIEWS_BY_ID: "/api/Review/{id}",
  REVIEWS_CREATE: "/api/Review",
  REVIEWS_UPDATE: "/api/Review/{id}",
  REVIEWS_DELETE: "/api/Review/{id}",

  // Styles
  STYLES_ALL: "/api/Style",
  STYLES_BY_ID: "/api/Style/{id}",
  STYLES_CREATE: "/api/Style",
  STYLES_UPDATE: "/api/Style/{id}",
  STYLES_DELETE: "/api/Style/{id}",

  // Notifications
  NOTIFICATIONS_ALL: "/api/Notification/GetAllNotifications",
  NOTIFICATIONS_CREATE: "/api/Notification/CreateNotification",
  NOTIFICATIONS_UPDATE: "/api/Notification/UpdateNotification/{id}",
  NOTIFICATIONS_DELETE: "/api/Notification/DeleteNotification/{id}",
};
