import axios from "axios";

// Access environment variable or use localhost for dev
const BASE_URL =
  process.env.REACT_APP_API_URL || "https://jewellery-gules-one.vercel.app/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add Interceptors (e.g., for attaching tokens automatically)
apiClient.interceptors.request.use(
  (config) => {
    // Example: Attach token from localStorage if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (like 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Logic to redirect to login or clear storage
      console.error("Unauthorized! Logging out...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
