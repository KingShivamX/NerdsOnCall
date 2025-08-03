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
            <DialogContent className="sm:max-w-md bg-yellow-100 border-4 border-black shadow-[8px_8px_0px_0px_black]">
                <DialogHeader className="bg-yellow-300 text-black p-4 -m-6 mb-6 border-b-4 border-black">
                    <DialogTitle className="text-black text-xl font-black text-center uppercase tracking-wide flex items-center justify-center">
                        <Phone className="h-6 w-6 mr-2" />
                        Incoming Call
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 text-center">
                    {/* Caller Info */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-20 h-20 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_black] rounded-full flex items-center justify-center animate-pulse">
                            <User className="h-10 w-10 text-black" />
                        </div>
                        <div>
                            <p className="text-lg font-black text-black truncate max-w-xs">
                                {callerName}
                            </p>
                            <p className="text-sm text-black font-bold">
                                {getCallerTypeLabel()}
                            </p>
                        </div>
                    </div>

                    {/* Call Duration */}
                    <div className="bg-yellow-200 border-2 border-black shadow-[2px_2px_0px_0px_black] p-3">
                        <p className="text-sm text-black font-bold">
                            Call duration
                        </p>
                        <p className="text-lg font-mono font-black text-black">
                            {formatTime(timeElapsed)}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-4 pb-6">
                        <Button
                            onClick={onDecline}
                            className="min-w-[120px] h-12 bg-red-400 hover:bg-red-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-200 flex items-center justify-center"
                        >
                            <PhoneOff className="h-4 w-4 mr-2" />
                            DECLINE
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="min-w-[120px] h-12 bg-green-400 hover:bg-green-500 text-black font-black border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-200 animate-pulse flex items-center justify-center"
                        >
                            <Phone className="h-4 w-4 mr-2" />
                            ACCEPT
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
