"use client"

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react"
import { User } from "../types"
import { api, login as apiLogin } from "../lib/api"

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
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
            const response = await apiLogin({ email, password })
            const { token, user: userData } = response.data

            localStorage.setItem("token", token)
            api.defaults.headers.Authorization = `Bearer ${token}`
            setUser(userData)
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        delete api.defaults.headers.Authorization
        setUser(null)
    }

    const value: AuthContextType = {
        user,
        login,
        logout,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
