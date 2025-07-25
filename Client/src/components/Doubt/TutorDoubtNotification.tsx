"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { useWebSocket } from "@/context/WebSocketContext"
import { api } from "@/lib/api"
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
import {
    MessageCircle,
    CheckCircle,
    XCircle,
    Calendar,
    Paperclip,
    Star,
} from "lucide-react"
import { VideoCallModal } from "@/components/VideoCall/VideoCallModal"

interface TutorDoubtNotificationProps {
    onNewDoubt?: (doubt?: any) => void
}

export function TutorDoubtNotification({
    onNewDoubt,
}: TutorDoubtNotificationProps) {
    const { user } = useAuth()
    const { doubtSocket } = useWebSocket()
    const [isOpen, setIsOpen] = useState(false)
    const [incomingDoubt, setIncomingDoubt] = useState<any>(null)
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)
    const [studentDetails, setStudentDetails] = useState<any>(null)

    useEffect(() => {
        if (doubtSocket && user?.role === "TUTOR") {
            doubtSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log("Received WebSocket message:", data)

                    if (data.type === "new_doubt") {
                        console.log(
                            "Processing new_doubt message with data:",
                            data.doubt
                        )
                        handleNewDoubt(data.doubt)
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error)
                }
            }
        }
    }, [doubtSocket, user])

    useEffect(() => {
        if (incomingDoubt) {
            fetchStudentDetails(incomingDoubt.student.id)
        }
    }, [incomingDoubt])

    const handleNewDoubt = (doubt: any) => {
        setIncomingDoubt(doubt)
        setIsOpen(true)

        // Show toast notification
        toast.success(
            `New doubt request from ${doubt.student.firstName} ${
                doubt.student.lastName
            } about ${doubt.subject.replace(/_/g, " ")}`,
            {
                duration: 10000,
            }
        )

        // Notify parent component with the new doubt data
        if (onNewDoubt) {
            onNewDoubt(doubt)
        }
    }

    const fetchStudentDetails = async (studentId: number) => {
        try {
            const response = await api.get(`/api/users/${studentId}`)
            setStudentDetails(response.data)
        } catch (error) {
            console.error("Error handling incoming call:", error)
            toast.error("Failed to fetch student details")
        }
    }

    const handleAcceptDoubt = async () => {
        if (!incomingDoubt) return

        try {
            // Update doubt status to ASSIGNED
            await api.put(`/doubts/${incomingDoubt.id}/status?status=ASSIGNED`)

            // Close the notification dialog
            setIsOpen(false)

            // Open video call modal immediately (this replaces the "Accept Call" popup)
            setIsCallModalOpen(true)

            toast.success("Doubt accepted! Starting video call...")
        } catch (error) {
            console.error("Error accepting doubt:", error)
            toast.error("Failed to accept doubt")
        }
    }

    const handleRejectDoubt = async () => {
        if (!incomingDoubt) return

        try {
            // Update doubt status to CANCELLED
            await api.put(`/doubts/${incomingDoubt.id}/status?status=CANCELLED`)

            // Close the notification dialog
            setIsOpen(false)

            toast.success("You've rejected the doubt request")
        } catch (error) {
            console.error("Error rejecting doubt:", error)
            toast.error("Failed to reject doubt")
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT":
                return "bg-red-100 text-red-800 border-red-200"
            case "HIGH":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "LOW":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    if (!user || user.role !== "TUTOR") {
        return null
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200 shadow-2xl">
                    <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 mb-6 p-6 border-b border-gray-200">
                        <DialogTitle className="flex items-center text-gray-800">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                                <MessageCircle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">
                                    New Doubt Request
                                </h2>
                                <p className="text-sm text-gray-600 font-normal">
                                    A student needs your help
                                </p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    {incomingDoubt && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {incomingDoubt.student.firstName?.[0]}
                                    {incomingDoubt.student.lastName?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">
                                        {incomingDoubt.student.firstName}{" "}
                                        {incomingDoubt.student.lastName}
                                    </h3>
                                    {studentDetails?.rating && (
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-3 w-3 text-amber-500 fill-current" />
                                            <span className="text-xs text-slate-600">
                                                {studentDetails.rating} rating
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {incomingDoubt.subject.replace(
                                            /_/g,
                                            " "
                                        )}
                                    </Badge>
                                    <Badge
                                        className={`text-xs border ${getPriorityColor(
                                            incomingDoubt.priority
                                        )}`}
                                    >
                                        {incomingDoubt.priority}
                                    </Badge>
                                </div>
                                <h4 className="font-medium text-slate-800 mb-2">
                                    {incomingDoubt.title}
                                </h4>
                                <p className="text-sm text-slate-600 mb-4">
                                    {incomingDoubt.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            {new Date(
                                                incomingDoubt.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {incomingDoubt.attachments?.length > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <Paperclip className="h-3 w-3" />
                                            <span>
                                                {
                                                    incomingDoubt.attachments
                                                        .length
                                                }{" "}
                                                files
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="bg-gray-50 -m-6 mt-6 p-6 border-t border-gray-200 flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleRejectDoubt}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                        </Button>
                        <Button
                            onClick={handleAcceptDoubt}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept & Start Call
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Video Call Modal */}
            {incomingDoubt && studentDetails && (
                <VideoCallModal
                    isOpen={isCallModalOpen}
                    onClose={() => setIsCallModalOpen(false)}
                    tutorId={incomingDoubt.student.id}
                    tutorName={`${incomingDoubt.student.firstName} ${incomingDoubt.student.lastName}`}
                    sessionId={`doubt_${incomingDoubt.id}`}
                />
            )}
        </>
    )
}
