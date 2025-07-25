"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useWebSocket } from "@/context/WebSocketContext"
import toast from "react-hot-toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Video, MessageCircle, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface StudentDoubtNotificationProps {
    onDoubtAccepted?: (doubt?: any) => void
}

export function StudentDoubtNotification({
    onDoubtAccepted,
}: StudentDoubtNotificationProps) {
    const { user } = useAuth()
    const { doubtSocket } = useWebSocket()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [acceptedDoubt, setAcceptedDoubt] = useState<any>(null)

    useEffect(() => {
        if (doubtSocket && user?.role === "STUDENT") {
            doubtSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("Student received WebSocket message:", data)

                    if (data.type === "doubt_accepted") {
                        console.log("Processing doubt_accepted message:", data)

                        setAcceptedDoubt(data.doubt)
                        setIsOpen(true)

                        // Show toast notification
                        toast.success(
                            `Your question has been accepted by ${data.tutorName}!`,
                            {
                                duration: 5000,
                                icon: "✅",
                            }
                        )

                        // Optional callback
                        if (onDoubtAccepted) {
                            onDoubtAccepted(data.doubt)
                        }
                    }
                } catch (error) {
                    console.error(
                        "Error parsing student WebSocket message:",
                        error
                    )
                }
            }
        }
    }, [doubtSocket, user, onDoubtAccepted])

    const handleStartVideoCall = () => {
        if (acceptedDoubt) {
            // Generate session ID
            const sessionId = `doubt_${acceptedDoubt.id}_${Date.now()}`
            const tutorName = acceptedDoubt.tutorName || "Tutor"

            // Navigate to video call page
            router.push(
                `/video-call/${sessionId}?tutorId=${
                    acceptedDoubt.tutorId
                }&tutorName=${encodeURIComponent(tutorName)}&doubtId=${
                    acceptedDoubt.id
                }`
            )

            setIsOpen(false)
        }
    }

    const handleViewMyQuestions = () => {
        router.push("/my-questions")
        setIsOpen(false)
    }

    const handleClose = () => {
        setIsOpen(false)
        setAcceptedDoubt(null)
    }

    if (!user || user.role !== "STUDENT") {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white border-2 border-green-300 shadow-2xl">
                <DialogHeader className="bg-white text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
                        <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <DialogTitle className="text-green-800 text-xl font-bold">
                        🎉 Question Accepted!
                    </DialogTitle>
                </DialogHeader>

                {acceptedDoubt && (
                    <div className="bg-white p-4 space-y-4">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800 mb-2">
                                A tutor has accepted your question!
                            </p>
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <h4 className="font-medium text-green-800 mb-1">
                                    "{acceptedDoubt.title}"
                                </h4>
                                <div className="flex items-center justify-center space-x-2">
                                    <Badge className="bg-green-100 text-green-800">
                                        {acceptedDoubt.subject?.replace(
                                            /_/g,
                                            " "
                                        )}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {acceptedDoubt.priority}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            <p>
                                You can now start a video call to get help with
                                your question!
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex justify-center space-x-3 bg-white pt-4">
                    <Button
                        variant="outline"
                        onClick={handleViewMyQuestions}
                        className="bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View My Questions
                    </Button>
                    <Button
                        onClick={handleStartVideoCall}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                    >
                        <Video className="h-4 w-4 mr-2" />
                        Start Video Call
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
