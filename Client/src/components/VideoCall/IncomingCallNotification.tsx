"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Phone, PhoneOff, User } from "lucide-react"

interface IncomingCallNotificationProps {
    isOpen: boolean
    onAccept: () => void
    onDecline: () => void
    callerName: string
    callerId: number | string
    sessionId: string
    callerRole?: "STUDENT" | "TUTOR"
}

export function IncomingCallNotification({
    isOpen,
    onAccept,
    onDecline,
    callerName,
    callerId,
    sessionId,
    callerRole,
}: IncomingCallNotificationProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [timeElapsed, setTimeElapsed] = useState(0)

    useEffect(() => {
        if (isOpen) {
            const timer = setInterval(() => {
                setTimeElapsed((prev) => prev + 1)
            }, 1000)

            // Auto-decline after 30 seconds
            const autoDeclineTimer = setTimeout(() => {
                onDecline()
            }, 30000)

            return () => {
                clearInterval(timer)
                clearTimeout(autoDeclineTimer)
            }
        } else {
            setTimeElapsed(0)
        }
    }, [isOpen, onDecline])

    const handleAccept = () => {
        onAccept()

        // Navigate to video call page based on user role
        if (user?.role === "TUTOR") {
            // Tutor accepting call from student
            router.push(
                `/video-call/${sessionId}?role=tutor&studentId=${callerId}&studentName=${encodeURIComponent(
                    callerName
                )}`
            )
        } else {
            // Student accepting call from tutor
            router.push(
                `/video-call/${sessionId}?role=student&tutorId=${callerId}&tutorName=${encodeURIComponent(
                    callerName
                )}`
            )
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
    }

    const getCallerTypeLabel = () => {
        if (user?.role === "TUTOR") {
            return "Student"
        } else {
            return "Tutor"
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_black]">
                <DialogHeader className="bg-black text-white p-4 -m-6 mb-6">
                    <DialogTitle className="text-yellow-300 text-xl font-black text-center uppercase tracking-wide drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        📞 Incoming Call
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 text-center">
                    {/* Caller Info */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <User className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                {callerName}
                            </p>
                            <p className="text-sm text-gray-600">
                                {getCallerTypeLabel()}
                            </p>
                        </div>
                    </div>

                    {/* Call Duration */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Call duration</p>
                        <p className="text-lg font-mono font-semibold text-gray-800">
                            {formatTime(timeElapsed)}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <Button
                            onClick={onDecline}
                            className="w-20 h-12 bg-red-500 border-4 border-black text-white font-bold shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all"
                        >
                            <PhoneOff className="h-5 w-5 mr-1" />
                            DECLINE
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="w-20 h-12 bg-green-500 border-4 border-black text-white font-bold shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all animate-pulse"
                        >
                            <Phone className="h-5 w-5 mr-1" />
                            ACCEPT
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
