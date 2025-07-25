"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Phone, PhoneOff, Video, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface IncomingCallNotificationProps {
    isOpen: boolean
    onAccept: () => void
    onDecline: () => void
    callerName: string
    callerId: number
    sessionId: string
}

export function IncomingCallNotification({
    isOpen,
    onAccept,
    onDecline,
    callerName,
    callerId,
    sessionId,
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
        // Navigate to video call page
        router.push(
            `/video-call/${sessionId}?tutorId=${
                user?.id
            }&tutorName=${encodeURIComponent(
                user?.firstName + " " + user?.lastName
            )}`
        )
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[400px] bg-white border border-gray-200 shadow-2xl">
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Phone className="h-10 w-10 text-white" />
                    </div>
                    <DialogTitle className="text-xl font-semibold text-gray-800">
                        Incoming Video Call
                    </DialogTitle>
                </DialogHeader>

                <div className="text-center space-y-4">
                    {/* Caller Info */}
                    <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                                {callerName.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                                {callerName}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Student requesting help
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
