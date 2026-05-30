import axios from "axios";

// Determine the API base URL based on environment
const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, 
  withCredentials: true, // Important: enables sending cookies with requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

let isRefreshing = false;
let refreshPromise = null;

const clearTokens = () => {
  if (typeof window !== "undefined") {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const refreshToken = async () => {
  try {
    // Following Fittbot Standard: /api/corporate/auth/refresh-cookie
    const refreshResponse = await axios.post(
      `${getBaseURL()}/api/corporate/auth/refresh-cookie`,
      {}, 
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (refreshResponse?.status === 200) {
      return true;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    clearTokens();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return null;
  }
};

const verifyToken = async () => {
  try {
    const verifyResponse = await axios.get(`${getBaseURL()}/api/corporate/auth/verify`, {
      params: { device: "web" },
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (verifyResponse?.status === 200) {
      return verifyResponse.data;
    } else {
      throw new Error("Token verification failed");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          const retryResponse = await axios.get(`${getBaseURL()}/api/corporate/auth/verify`, {
            params: { device: "web" },
            withCredentials: true,
          });
          if (retryResponse?.status === 200) {
            return retryResponse.data;
          }
        }
      } catch (refreshError) {}
    }
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Pass aborted/cancelled requests directly through without converting them to network errors
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.name === 'CanceledError' || error.name === 'AbortError') {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error?.response?.status;

    if (!error.response) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        originalError: error,
      });
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const url = originalRequest.url;
    const isAuthEndpoint =
      url?.includes("/auth/login") ||
      url?.includes("/auth/verify") ||
      url?.includes("/auth/refresh-cookie");

    if (isAuthEndpoint) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
    }

    try {
      const refreshSuccess = await refreshPromise;
      if (refreshSuccess) {
        return axiosInstance(originalRequest);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }

    return Promise.reject(error);
  }
);

export { verifyToken };
export default axiosInstance;
