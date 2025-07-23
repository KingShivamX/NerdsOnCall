"use client"

import { ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"
import { TutorCallNotification } from "@/components/VideoCall/TutorCallNotification"

interface TutorCallProviderProps {
  children: ReactNode
}

export function TutorCallProvider({ children }: TutorCallProviderProps) {
  const { user } = useAuth()
  
  return (
    <>
      {children}
      {/* Only render the notification component for tutors */}
      {user?.role === 'TUTOR' && <TutorCallNotification />}
    </>
  )
}