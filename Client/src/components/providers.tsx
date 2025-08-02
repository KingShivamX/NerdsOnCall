"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../context/AuthContext"
import { WebSocketProvider } from "../context/WebSocketContext"
import { TutorCallProvider } from "./layout/TutorCallProvider"
import { ReactNode, useState } from "react"

interface ProvidersProps {
    children: ReactNode
}

export function ReactQueryProvider({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <WebSocketProvider>
                    <TutorCallProvider>{children}</TutorCallProvider>
                </WebSocketProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}
