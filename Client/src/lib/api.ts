import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only log errors that are not expected business logic errors
        if (error.response?.status !== 400) {
            console.error(
                "API Error:",
                error.response?.status,
                error.response?.data
            )
        }

        // Handle 401 errors by clearing invalid tokens
        if (error.response?.status === 401) {
            console.log("401 error detected, clearing token...")
            localStorage.removeItem("token")
            document.cookie =
                "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

            // Only redirect to login if not already on auth pages
            if (
                typeof window !== "undefined" &&
                !window.location.pathname.includes("/auth/") &&
                !window.location.pathname.includes("/login")
            ) {
                window.location.href = "/auth/login"
            }
        }

        return Promise.reject(error)
    }
)
