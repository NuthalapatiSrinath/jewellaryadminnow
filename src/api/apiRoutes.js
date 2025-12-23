export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  DIAMONDS: {
    GET_ALL: "/admin/diamonds",
    GET_FILTERS: "/admin/diamonds/filters",
    GET_BY_ID: (id) => `/admin/diamonds/${id}`,
    CREATE: "/admin/diamonds",
    UPDATE: (id) => `/admin/diamonds/${id}`,
    DELETE: (id) => `/admin/diamonds/${id}`,
    ACTIVATE: (id) => `/admin/diamonds/${id}/activate`,
    DEACTIVATE: (id) => `/admin/diamonds/${id}/deactivate`,
    GENERATE: "/admin/diamonds/generate",
    BULK_UPLOAD: "/admin/diamonds/bulk",
  },
};
