import apiClient from "../api/apiClient";
import { API_ROUTES } from "../api/apiRoutes";

/**
 * Auth Service – Admin Authentication
 * Backend base: /api
 * Login endpoint: /api/admin/auth/login
 */
const authService = {
  /**
   * Admin Login
   * @param {Object} credentials { email, password }
   * @returns {Object} { admin_token, user }
   */
  login: async (credentials) => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, credentials);

    return response.data;
  },

  /**
   * (Optional) Register – only if backend supports it
   */
  register: async (userData) => {
    const response = await apiClient.post(API_ROUTES.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Admin Logout
   * Clears token client-side
   */
  logout: async () => {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    } finally {
      // ✅ Always clear token locally
      localStorage.removeItem("token");
    }
  },

  /**
   * Get Current Logged-in Admin
   * Requires Authorization header
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(API_ROUTES.AUTH.ME);
    return response.data;
  },
};

export default authService;
