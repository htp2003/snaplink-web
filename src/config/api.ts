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

// Consolidated API Endpoints - Based on latest API documentation
export const API_ENDPOINTS = {
  // ========== AUTHENTICATION ==========
  LOGIN: "/api/Auth/login",
  LOGOUT: "/api/Auth/Logout",
  FORGOT_PASSWORD_START: "/api/Auth/forgot-password/start",
  FORGOT_PASSWORD_VERIFY: "/api/Auth/forgot-password/verify",
  FORGOT_PASSWORD_RESET: "/api/Auth/forgot-password/reset",

  // ========== USERS ==========
  USERS_ALL: "/api/User/all",
  USERS_BY_ID: "/api/User/{userId}",
  USERS_BY_ROLE: "/api/User/by-role/{roleName}",
  USERS_BY_EMAIL: "/api/User/GetUserByEmail",
  USERS_CREATE_ADMIN: "/api/User/create-admin",
  USERS_CREATE_USER: "/api/User/create-user",
  USERS_CREATE_PHOTOGRAPHER: "/api/User/create-photographer",
  USERS_CREATE_LOCATIONOWNER: "/api/User/create-locationowner",
  USERS_CREATE_MODERATOR: "/api/User/create-moderator",
  USERS_UPDATE: "/api/User/update",
  USERS_DELETE: "/api/User/delete/{userId}",
  USERS_HARD_DELETE: "/api/User/hard-delete/{userId}",
  USERS_ASSIGN_ROLES: "/api/User/assign-roles",
  USERS_VERIFY_EMAIL: "/api/User/verify-email",
  USERS_CHANGE_PASSWORD: "/api/User/change-password",
  USERS_CHANGE_PASSWORD_FOR: "/api/User/change-password-for/{targetUserId}",

  // ========== PHOTOGRAPHERS ==========
  PHOTOGRAPHERS_ALL: "/api/Photographer",
  PHOTOGRAPHERS_BY_ID: "/api/Photographer/{id}",
  PHOTOGRAPHERS_DETAIL: "/api/Photographer/{id}/detail",
  PHOTOGRAPHERS_CREATE: "/api/Photographer",
  PHOTOGRAPHERS_UPDATE: "/api/Photographer/{id}",
  PHOTOGRAPHERS_DELETE: "/api/Photographer/{id}",
  PHOTOGRAPHERS_BY_STYLE: "/api/Photographer/style/{styleName}",
  PHOTOGRAPHERS_AVAILABLE: "/api/Photographer/available",
  PHOTOGRAPHERS_FEATURED: "/api/Photographer/featured",
  PHOTOGRAPHERS_UPDATE_AVAILABILITY: "/api/Photographer/{id}/availability",
  PHOTOGRAPHERS_UPDATE_RATING: "/api/Photographer/{id}/rating",
  PHOTOGRAPHERS_VERIFY: "/api/Photographer/{id}/verify",
  PHOTOGRAPHERS_STYLES: "/api/Photographer/{id}/styles",
  PHOTOGRAPHERS_ADD_STYLE: "/api/Photographer/{id}/styles/{styleId}",
  PHOTOGRAPHERS_REMOVE_STYLE: "/api/Photographer/{id}/styles/{styleId}",
  PHOTOGRAPHERS_NEARBY: "/api/Photographer/nearby",
  PHOTOGRAPHERS_BY_CITY: "/api/Photographer/city/{city}",
  PHOTOGRAPHERS_DISTANCE: "/api/Photographer/{photographerId}/distance",
  PHOTOGRAPHERS_UPDATE_LOCATION: "/api/Photographer/{id}/location",

  // ========== LOCATIONS/VENUES ==========
  LOCATIONS_ALL: "/api/Location/GetAllLocations",
  LOCATIONS_BY_ID: "/api/Location/GetLocationById",
  LOCATIONS_CREATE: "/api/Location/CreateLocation",
  LOCATIONS_UPDATE: "/api/Location/UpdateLocation",
  LOCATIONS_DELETE: "/api/Location/DeleteLocation",
  LOCATIONS_NEARBY_COMBINED: "/api/Location/nearby/combined",
  LOCATIONS_UPDATE_COORDINATES: "/api/Location/update-coordinates/{id}",

  // ========== LOCATION OWNERS ==========
  LOCATION_OWNERS_ALL: "/api/LocationOwner",
  LOCATION_OWNERS_BY_ID: "/api/LocationOwner/GetByLocationOwnerId",
  LOCATION_OWNERS_CREATE: "/api/LocationOwner/CreatedLocationOwnerId",
  LOCATION_OWNERS_UPDATE: "/api/LocationOwner/UpdateByLocationOwnerId",
  LOCATION_OWNERS_DELETE: "/api/LocationOwner/DeleteByLocationOwnerId",

  // ========== BOOKINGS ==========
  BOOKINGS_CREATE: "/api/Booking/create",
  BOOKINGS_BY_ID: "/api/Booking/{bookingId}",
  BOOKINGS_UPDATE: "/api/Booking/{bookingId}",
  BOOKINGS_BY_USER: "/api/Booking/user/{userId}",
  BOOKINGS_BY_PHOTOGRAPHER: "/api/Booking/photographer/{photographerId}",
  BOOKINGS_CANCEL: "/api/Booking/{bookingId}/cancel",
  BOOKINGS_COMPLETE: "/api/Booking/{bookingId}/Complete",
  BOOKINGS_CONFIRM: "/api/Booking/{bookingId}/confirm",
  BOOKINGS_AVAILABILITY_PHOTOGRAPHER:
    "/api/Booking/availability/photographer/{photographerId}",
  BOOKINGS_AVAILABILITY_LOCATION:
    "/api/Booking/availability/location/{locationId}",
  BOOKINGS_AVAILABILITY_COMBINED:
    "/api/Booking/availability/location/{locationId}/photographer/{photographerId}",
  BOOKINGS_PHOTOGRAPHERS_BY_LOCATION:
    "/api/Booking/location/{locationId}/photographers",
  BOOKINGS_CALCULATE_PRICE: "/api/Booking/calculate-price",
  BOOKINGS_COUNT_BY_LOCATION: "/api/Booking/count/location/{locationId}",
  BOOKINGS_CLEANUP_EXPIRED: "/api/Booking/cleanup-expired",
  BOOKINGS_CLEANUP_ALL_PENDING: "/api/Booking/cleanup-all-pending",

  // ========== AVAILABILITY ==========
  AVAILABILITY_BY_PHOTOGRAPHER:
    "/api/Availability/photographer/{photographerId}",
  AVAILABILITY_BY_DAY: "/api/Availability/day/{dayOfWeek}",
  AVAILABILITY_BY_ID: "/api/Availability/{availabilityId}",
  AVAILABILITY_CREATE: "/api/Availability",
  AVAILABILITY_UPDATE: "/api/Availability/{availabilityId}",
  AVAILABILITY_DELETE: "/api/Availability/{availabilityId}",
  AVAILABILITY_DELETE_ALL: "/api/Availability/photographer/{photographerId}",
  AVAILABILITY_BULK_CREATE: "/api/Availability/bulk",
  AVAILABILITY_CHECK: "/api/Availability/check",
  AVAILABILITY_UPDATE_STATUS: "/api/Availability/{availabilityId}/status",
  AVAILABILITY_GET_PHOTOGRAPHERS: "/api/Availability/available-photographers",
  AVAILABILITY_GET_SLOTS:
    "/api/Availability/photographer/{photographerId}/available-slots",

  // ========== REVIEWS ==========
  REVIEWS_ALL: "/api/Review",
  REVIEWS_BY_ID: "/api/Review/{id}",
  REVIEWS_CREATE: "/api/Review",
  REVIEWS_UPDATE: "/api/Review/{id}",
  REVIEWS_DELETE: "/api/Review/{id}",
  REVIEWS_BY_PHOTOGRAPHER: "/api/Review/photographer/{photographerId}",
  REVIEWS_BY_BOOKING: "/api/Review/booking/{bookingId}",
  REVIEWS_AVERAGE_RATING:
    "/api/Review/photographer/{photographerId}/average-rating",

  // ========== STYLES ==========
  STYLES_ALL: "/api/Style",
  STYLES_BY_ID: "/api/Style/{id}",
  STYLES_DETAIL: "/api/Style/{id}/detail",
  STYLES_CREATE: "/api/Style",
  STYLES_UPDATE: "/api/Style/{id}",
  STYLES_DELETE: "/api/Style/{id}",
  STYLES_SEARCH: "/api/Style/search/{name}",
  STYLES_POPULAR: "/api/Style/popular",
  STYLES_WITH_COUNT: "/api/Style/with-count",

  // ========== USER STYLES ==========
  USER_STYLES_BY_USER: "/api/UserStyle/user/{userId}",
  USER_STYLES_UPDATE: "/api/UserStyle/user/{userId}",
  USER_STYLES_ADD: "/api/UserStyle",
  USER_STYLES_REMOVE: "/api/UserStyle/user/{userId}/style/{styleId}",
  USER_STYLES_RECOMMENDATIONS: "/api/UserStyle/user/{userId}/recommendations",
  USER_STYLES_PHOTOGRAPHERS: "/api/UserStyle/user/{userId}/photographers",
  USER_STYLES_CHECK: "/api/UserStyle/user/{userId}/style/{styleId}/check",
  USER_STYLES_USERS_BY_STYLE: "/api/UserStyle/style/{styleId}/users",

  // ========== TRANSACTIONS ==========
  TRANSACTIONS_ALL: "/api/Transaction",
  TRANSACTIONS_BY_ID: "/api/Transaction/{transactionId}",
  TRANSACTIONS_BY_USER: "/api/Transaction/history/user/{userId}",
  TRANSACTIONS_BY_PHOTOGRAPHER:
    "/api/Transaction/history/photographer/{photographerId}",
  TRANSACTIONS_BY_LOCATION_OWNER:
    "/api/Transaction/history/location-owner/{locationOwnerId}",
  TRANSACTIONS_MONTHLY_INCOME: "/api/Transaction/monthly-income/{userId}",

  // ========== PAYMENTS ==========
  PAYMENTS_CREATE: "/api/Payment/create",
  PAYMENTS_WALLET_TOPUP: "/api/Payment/wallet-topup",
  PAYMENTS_BY_ID: "/api/Payment/{paymentId}",
  PAYMENTS_CANCEL_BOOKING: "/api/Payment/booking/{bookingId}/cancel",
  PAYMENTS_WEBHOOK: "/api/Payment/webhook",

  // ========== WALLET ==========
  WALLET_BALANCE: "/api/Wallet/balance",
  WALLET_BALANCE_BY_USER: "/api/Wallet/balance/{userId}",
  WALLET_TRANSFER: "/api/Wallet/transfer",

  // ========== WITHDRAWALS ==========
  WITHDRAWALS_ALL: "/api/WithdrawalRequest",
  WITHDRAWALS_CREATE: "/api/WithdrawalRequest",
  WITHDRAWALS_BY_ID: "/api/WithdrawalRequest/{withdrawalId}",
  WITHDRAWALS_DETAIL: "/api/WithdrawalRequest/{withdrawalId}/detail",
  WITHDRAWALS_UPDATE: "/api/WithdrawalRequest/{withdrawalId}",
  WITHDRAWALS_DELETE: "/api/WithdrawalRequest/{withdrawalId}",
  WITHDRAWALS_BY_USER: "/api/WithdrawalRequest/user",
  WITHDRAWALS_BY_STATUS: "/api/WithdrawalRequest/status/{status}",
  WITHDRAWALS_PROCESS: "/api/WithdrawalRequest/{withdrawalId}/process",
  WITHDRAWALS_APPROVE: "/api/WithdrawalRequest/{withdrawalId}/approve",
  WITHDRAWALS_REJECT: "/api/WithdrawalRequest/{withdrawalId}/reject",
  WITHDRAWALS_COMPLETE: "/api/WithdrawalRequest/{withdrawalId}/complete",
  WITHDRAWALS_LIMITS: "/api/WithdrawalRequest/limits",

  // ========== NOTIFICATIONS ==========
  NOTIFICATIONS_ALL: "/api/Notification/GetAllNotifications",
  NOTIFICATIONS_BY_ID: "/api/Notification/GetNotificationById/{id}",
  NOTIFICATIONS_CREATE: "/api/Notification/CreateNotification",
  NOTIFICATIONS_UPDATE: "/api/Notification/UpdateNotification/{id}",
  NOTIFICATIONS_DELETE: "/api/Notification/DeleteNotification/{id}",

  // ========== PUSH NOTIFICATIONS ==========
  PUSH_REGISTER_DEVICE: "/api/PushNotification/register-device",
  PUSH_UPDATE_DEVICE: "/api/PushNotification/device/{deviceId}",
  PUSH_DELETE_DEVICE: "/api/PushNotification/device/{deviceId}",
  PUSH_DELETE_BY_TOKEN: "/api/PushNotification/device/token/{expoPushToken}",
  PUSH_GET_BY_TOKEN: "/api/PushNotification/device/token/{expoPushToken}",
  PUSH_GET_USER_DEVICES: "/api/PushNotification/user/{userId}/devices",
  PUSH_SEND: "/api/PushNotification/send",
  PUSH_SEND_BULK: "/api/PushNotification/send-bulk",
  PUSH_UPDATE_LAST_USED:
    "/api/PushNotification/device/token/{expoPushToken}/last-used",
  PUSH_VALIDATE_TOKEN: "/api/PushNotification/validate-token",
  PUSH_CLEANUP_TOKENS: "/api/PushNotification/cleanup-tokens",

  // ========== CHAT ==========
  CHAT_SEND_MESSAGE: "/api/Chat/send-message",
  CHAT_GET_MESSAGE: "/api/Chat/messages/{messageId}",
  CHAT_DELETE_MESSAGE: "/api/Chat/messages/{messageId}",
  CHAT_GET_CONVERSATION_MESSAGES:
    "/api/Chat/conversations/{conversationId}/messages",
  CHAT_MARK_READ: "/api/Chat/messages/{messageId}/mark-read",
  CHAT_CREATE_CONVERSATION: "/api/Chat/conversations",
  CHAT_GET_CONVERSATIONS: "/api/Chat/conversations",
  CHAT_GET_CONVERSATION: "/api/Chat/conversations/{conversationId}",
  CHAT_UPDATE_CONVERSATION: "/api/Chat/conversations/{conversationId}",
  CHAT_DELETE_CONVERSATION: "/api/Chat/conversations/{conversationId}",
  CHAT_ADD_PARTICIPANT: "/api/Chat/conversations/{conversationId}/participants",
  CHAT_REMOVE_PARTICIPANT:
    "/api/Chat/conversations/{conversationId}/participants",
  CHAT_GET_PARTICIPANTS:
    "/api/Chat/conversations/{conversationId}/participants",
  CHAT_LEAVE_CONVERSATION: "/api/Chat/conversations/{conversationId}/leave",
  CHAT_GET_UNREAD_COUNT:
    "/api/Chat/conversations/{conversationId}/unread-count",
  CHAT_CHECK_PARTICIPANT:
    "/api/Chat/conversations/{conversationId}/is-participant",
  CHAT_GET_DIRECT: "/api/Chat/direct-conversation",
  CHAT_TYPING: "/api/Chat/conversations/{conversationId}/typing",
  CHAT_TEST_SIGNALR: "/api/Chat/test-signalr",

  // ========== IMAGES ==========
  IMAGES_UPLOAD: "/api/Image",
  IMAGES_UPDATE: "/api/Image",
  IMAGES_BY_ID: "/api/Image/{id}",
  IMAGES_DELETE: "/api/Image/{id}",
  IMAGES_HARD_DELETE: "/api/Image/{id}/hard",
  IMAGES_RESTORE: "/api/Image/{id}/restore",
  IMAGES_BY_USER: "/api/Image/user/{userId}",
  IMAGES_BY_PHOTOGRAPHER: "/api/Image/photographer/{photographerId}",
  IMAGES_BY_LOCATION: "/api/Image/location/{locationId}",
  IMAGES_BY_EVENT: "/api/Image/event/{eventId}",
  IMAGES_USER_PRIMARY: "/api/Image/user/{userId}/primary",
  IMAGES_PHOTOGRAPHER_PRIMARY:
    "/api/Image/photographer/{photographerId}/primary",
  IMAGES_LOCATION_PRIMARY: "/api/Image/location/{locationId}/primary",
  IMAGES_EVENT_PRIMARY: "/api/Image/event/{eventId}/primary",
  IMAGES_DELETED: "/api/Image/deleted",
  IMAGES_SET_PRIMARY: "/api/Image/{id}/set-primary",

  // ========== LOCATION EVENTS ==========
  LOCATION_EVENTS_ALL: "/api/LocationEvent",
  LOCATION_EVENTS_CREATE: "/api/LocationEvent",
  LOCATION_EVENTS_BY_ID: "/api/LocationEvent/{eventId}",
  LOCATION_EVENTS_DETAIL: "/api/LocationEvent/{eventId}/detail",
  LOCATION_EVENTS_UPDATE: "/api/LocationEvent/{eventId}",
  LOCATION_EVENTS_DELETE: "/api/LocationEvent/{eventId}",
  LOCATION_EVENTS_BY_LOCATION: "/api/LocationEvent/location/{locationId}",
  LOCATION_EVENTS_ACTIVE: "/api/LocationEvent/active",
  LOCATION_EVENTS_UPCOMING: "/api/LocationEvent/upcoming",
  LOCATION_EVENTS_UPDATE_STATUS: "/api/LocationEvent/{eventId}/status",
  LOCATION_EVENTS_APPLY: "/api/LocationEvent/apply",
  LOCATION_EVENTS_RESPOND: "/api/LocationEvent/respond-application",
  LOCATION_EVENTS_APPLICATIONS: "/api/LocationEvent/{eventId}/applications",
  LOCATION_EVENTS_PHOTOGRAPHER_APPLICATIONS:
    "/api/LocationEvent/photographer/{photographerId}/applications",
  LOCATION_EVENTS_WITHDRAW:
    "/api/LocationEvent/{eventId}/photographer/{photographerId}/withdraw",
  LOCATION_EVENTS_APPROVED_PHOTOGRAPHERS:
    "/api/LocationEvent/{eventId}/approved-photographers",

  // ========== PHOTO DELIVERY ==========
  PHOTO_DELIVERY_CREATE: "/api/PhotoDelivery",
  PHOTO_DELIVERY_BY_ID: "/api/PhotoDelivery/{photoDeliveryId}",
  PHOTO_DELIVERY_UPDATE: "/api/PhotoDelivery/{photoDeliveryId}",
  PHOTO_DELIVERY_DELETE: "/api/PhotoDelivery/{photoDeliveryId}",
  PHOTO_DELIVERY_BY_BOOKING: "/api/PhotoDelivery/booking/{bookingId}",
  PHOTO_DELIVERY_BY_PHOTOGRAPHER:
    "/api/PhotoDelivery/photographer/{photographerId}",
  PHOTO_DELIVERY_BY_CUSTOMER: "/api/PhotoDelivery/customer/{customerId}",
  PHOTO_DELIVERY_BY_STATUS: "/api/PhotoDelivery/status/{status}",
  PHOTO_DELIVERY_PENDING: "/api/PhotoDelivery/pending",
  PHOTO_DELIVERY_EXPIRED: "/api/PhotoDelivery/expired",

  // ========== SUBSCRIPTIONS & PACKAGES ==========
  PACKAGES_ALL: "/api/Package/GetPackages",
  PACKAGES_BY_ID: "/api/Package/GetPackage/{packageId}",
  PACKAGES_CREATE: "/api/Package/CreatePackage",
  PACKAGES_UPDATE: "/api/Package/UpdatePackage/{packageId}",
  PACKAGES_DELETE: "/api/Package/DeletePackage/{packageId}",
  SUBSCRIPTIONS_SUBSCRIBE: "/api/Subscription/Subscribe",
  SUBSCRIPTIONS_BY_PHOTOGRAPHER:
    "/api/Subscription/Photographer/{photographerId}",
  SUBSCRIPTIONS_BY_LOCATION: "/api/Subscription/Location/{locationId}",
  SUBSCRIPTIONS_SUBSCRIBERS: "/api/Subscription/subscribers",
  SUBSCRIPTIONS_PHOTOGRAPHERS: "/api/Subscription/subscribers/photographers",
  SUBSCRIPTIONS_LOCATIONS: "/api/Subscription/subscribers/locations",
  SUBSCRIPTIONS_CANCEL: "/api/Subscription/{subscriptionId}/cancel",
  SUBSCRIPTIONS_EXPIRE_NOW: "/api/Subscription/expire-run-now",

  // ========== RATINGS ==========
  RATINGS_ALL: "/api/Rating/GetRatings",
  RATINGS_BY_ID: "/api/Rating/GetRatingById/{id}",
  RATINGS_BY_PHOTOGRAPHER: "/api/Rating/ByPhotographer/{photographerId}",
  RATINGS_BY_LOCATION: "/api/Rating/ByLocation/{locationId}",
  RATINGS_CREATE: "/api/Rating/CreateRating",
  RATINGS_UPDATE: "/api/Rating/UpdateRating/{id}",
  RATINGS_DELETE: "/api/Rating/DeleteRating/{id}",

  // ========== EXTERNAL SERVICES ==========
  GOOGLE_PLACES_SEARCH: "/api/GooglePlaces/search-nearby",
  GOOGLE_PLACES_TYPES: "/api/GooglePlaces/place-types",
  GOOGLE_PLACES_PHOTO: "/api/GooglePlaces/photo",
  IMAGE_GENERATION_EDIT: "/api/ImageGeneration/edit",

  // ========== ESCROW ==========
  ESCROW_BALANCE: "/api/Escrow/balance/{bookingId}",
  ESCROW_TRANSACTIONS: "/api/Escrow/transactions/{bookingId}",

  // ========== ROLES ==========
  ROLES_INIT_DEFAULT: "/api/Role/init-default",

  // ========== WEATHER (DEMO) ==========
  WEATHER_FORECAST: "/WeatherForecast",
} as const;

// Helper function to replace URL parameters
export const buildUrl = (
  endpoint: string,
  params: Record<string, string | number>
): string => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, String(value));
  });
  return url;
};

// Endpoint groups for easier organization
export const ENDPOINT_GROUPS = {
  AUTH: [
    "LOGIN",
    "LOGOUT",
    "FORGOT_PASSWORD_START",
    "FORGOT_PASSWORD_VERIFY",
    "FORGOT_PASSWORD_RESET",
  ],
  USERS: Object.keys(API_ENDPOINTS).filter((key) => key.startsWith("USERS_")),
  PHOTOGRAPHERS: Object.keys(API_ENDPOINTS).filter((key) =>
    key.startsWith("PHOTOGRAPHERS_")
  ),
  BOOKINGS: Object.keys(API_ENDPOINTS).filter((key) =>
    key.startsWith("BOOKINGS_")
  ),
  TRANSACTIONS: Object.keys(API_ENDPOINTS).filter((key) =>
    key.startsWith("TRANSACTIONS_")
  ),
  PAYMENTS: Object.keys(API_ENDPOINTS).filter((key) =>
    key.startsWith("PAYMENTS_")
  ),
  WITHDRAWALS: Object.keys(API_ENDPOINTS).filter((key) =>
    key.startsWith("WITHDRAWALS_")
  ),
} as const;

// Validation helper
export const validateEndpoint = (
  endpoint: keyof typeof API_ENDPOINTS
): boolean => {
  return endpoint in API_ENDPOINTS;
};

// Get endpoint with parameter validation
export const getEndpoint = (
  endpoint: keyof typeof API_ENDPOINTS,
  params?: Record<string, string | number>
): string => {
  if (!validateEndpoint(endpoint)) {
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }

  const url = API_ENDPOINTS[endpoint];
  return params ? buildUrl(url, params) : url;
};
