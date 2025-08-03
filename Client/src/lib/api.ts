import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and validate expiration
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if token is expired before making request
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp <= currentTime) {
          // Token is expired, clear it
          console.log("Request interceptor: Token expired, clearing...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          // Don't add expired token to request
          return config;
        }

        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        // Invalid token format, clear it
        console.log("Request interceptor: Invalid token format, clearing...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log errors that are not expected business logic errors
    if (error.response?.status !== 400) {
      console.error("API Error:", error.response?.status, error.response?.data);
    }

    // Handle 401 errors by clearing invalid tokens
    if (error.response?.status === 401) {
      console.log("401 error detected for URL:", error.config?.url);
      console.log(
        "Current pathname:",
        typeof window !== "undefined" ? window.location.pathname : "server"
      );

      // Check if this is a token expiration issue
      const token = localStorage.getItem("token");
      let isTokenExpired = false;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;
          isTokenExpired = payload.exp <= currentTime;
        } catch (e) {
          isTokenExpired = true; // Invalid token format
        }
      }

      // If token is expired or invalid, clear it and redirect
      if (isTokenExpired || !token) {
        console.log("Token is expired or invalid, clearing and redirecting...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        // Show user-friendly message
        if (typeof window !== "undefined") {
          // Import toast dynamically to avoid SSR issues
          import("react-hot-toast").then(({ default: toast }) => {
            toast.error("Your session has expired. Please log in again.");
          });

          // Redirect to login page after a short delay
          setTimeout(() => {
            if (
              !window.location.pathname.includes("/auth/") &&
              !window.location.pathname.includes("/login")
            ) {
              window.location.href = "/auth/login";
            }
          }, 1500);
        }
      } else {
        console.log(
          "401 error but token seems valid, letting component handle it..."
        );
      }
    }

    return Promise.reject(error);
  }
);
