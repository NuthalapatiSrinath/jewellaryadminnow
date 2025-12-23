import apiClient from "../api/apiClient";
import { API_ROUTES } from "../api/apiRoutes";

const diamondService = {
  getAllDiamonds: async (params = {}) => {
    // --- THE FIX ---
    // Filter out keys that have empty strings "", null, or undefined values.
    // This ensures we don't send ?active=&shape= which breaks the backend logic.
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );

    // Debug log to verify what is actually being sent
    console.log(
      "🚀 [FRONTEND SERVICE] Fetching diamonds with clean params:",
      cleanParams
    );

    const response = await apiClient.get(API_ROUTES.DIAMONDS.GET_ALL, {
      params: cleanParams,
    });
    return response.data;
  },

  getFilters: async () => {
    const response = await apiClient.get(API_ROUTES.DIAMONDS.GET_FILTERS);
    return response.data;
  },

  createDiamond: async (data) => {
    const response = await apiClient.post(API_ROUTES.DIAMONDS.CREATE, data);
    return response.data;
  },

  updateDiamond: async (id, data) => {
    const response = await apiClient.put(API_ROUTES.DIAMONDS.UPDATE(id), data);
    return response.data;
  },

  deleteDiamond: async (id) => {
    const response = await apiClient.delete(API_ROUTES.DIAMONDS.DELETE(id));
    return response.data;
  },

  toggleActivation: async (id, isActive) => {
    // If we want to make it active (isActive=true), call activate endpoint
    // If we want to make it inactive (isActive=false), call deactivate endpoint
    const route = isActive
      ? API_ROUTES.DIAMONDS.ACTIVATE(id)
      : API_ROUTES.DIAMONDS.DEACTIVATE(id);

    const response = await apiClient.patch(route);
    return response.data;
  },

  generateDiamonds: async (data) => {
    const response = await apiClient.post(API_ROUTES.DIAMONDS.GENERATE, data);
    return response.data;
  },

  bulkUpload: async (file) => {
    const formData = new FormData();
    formData.append("file", file); // Must match backend field name 'file'

    const response = await apiClient.post(
      API_ROUTES.DIAMONDS.BULK_UPLOAD,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
};

export default diamondService;
