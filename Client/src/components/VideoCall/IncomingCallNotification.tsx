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
    callerRole?: 'STUDENT' | 'TUTOR'
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
        if (user?.role === 'TUTOR') {
            // Tutor accepting call from student
            router.push(
                `/video-call/${sessionId}?role=tutor&studentId=${callerId}&studentName=${encodeURIComponent(callerName)}`
            )
        } else {
            // Student accepting call from tutor
            router.push(
                `/video-call/${sessionId}?role=student&tutorId=${callerId}&tutorName=${encodeURIComponent(callerName)}`
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
        if (user?.role === 'TUTOR') {
            return 'Student'
        } else {
            return 'Tutor'
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md bg-white border-2 border-blue-300 shadow-2xl">
                <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-xl font-bold text-blue-900">
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
                            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-200 transition-all"
                        >
                            <PhoneOff className="h-6 w-6" />
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-200 transition-all animate-pulse"
                        >
                            <Phone className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex justify-center space-x-8 text-sm text-gray-600">
                        <span>Decline</span>
                        <span>Accept</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
