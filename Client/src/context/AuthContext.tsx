"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react"
import { User, LoginRequest, RegisterRequest } from "../types"
import { api } from "../lib/api"

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (data: RegisterRequest) => Promise<void>
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("token")
                if (token) {
                    const response = await api.get("/auth/me")
                    setUser(response.data)
                }
            } catch (error) {
                console.error("Auth initialization error:", error)
                localStorage.removeItem("token")
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post("/auth/login", { email, password })
            const { token, user: userData } = response.data

            localStorage.setItem("token", token)
            setUser(userData)
        } catch (error) {
            throw error
        }
    }

    const register = async (data: RegisterRequest) => {
        try {
            const response = await api.post("/auth/register", data)
            const { token, user: userData } = response.data

            localStorage.setItem("token", token)
            setUser(userData)
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
