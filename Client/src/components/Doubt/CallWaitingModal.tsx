"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import {
    Clock,
    Video,
    CheckCircle,
    XCircle,
    Loader2,
    Phone
} from "lucide-react"


interface CallWaitingModalProps {
    isOpen: boolean
    onClose: () => void
    doubt?: any
    tutorName?: string
    status: 'waiting' | 'accepted' | 'rejected'
    onStartCall?: () => void
}

export function CallWaitingModal({
    isOpen,
    onClose,
    doubt,
    tutorName,
    status,
    onStartCall
}: CallWaitingModalProps) {
    const [waitingTime, setWaitingTime] = useState(0)

    useEffect(() => {
        if (status === 'waiting' && isOpen) {
            const interval = setInterval(() => {
                setWaitingTime(prev => prev + 1)
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [status, isOpen])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getStatusContent = () => {
        switch (status) {
            case 'waiting':
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                Waiting for {tutorName} to respond
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Your doubt has been sent. The tutor will accept or decline shortly.
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                                <Clock className="h-4 w-4" />
                                <span>Waiting time: {formatTime(waitingTime)}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                    {doubt?.subject?.replace(/_/g, " ")}
                                </Badge>
                                <Badge className="text-xs bg-blue-100 text-blue-800">
                                    {doubt?.priority}
                                </Badge>
                            </div>
                            <h4 className="font-medium text-slate-800 mb-1">
                                {doubt?.title}
                            </h4>
                            <p className="text-sm text-slate-600 line-clamp-2">
                                {doubt?.description}
                            </p>
                        </div>
                    </div>
                )

            case 'accepted':
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                {tutorName} accepted your doubt!
                            </h3>
                            <p className="text-slate-600 mb-4">
                                Great! Your tutor is ready to help. Click the button below to start the video call.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    if (onStartCall) {
                                        onStartCall()
                                    }
                                    onClose()
                                }}
                                className="w-full bg-green-600 hover:bg-green-700"
                                size="lg"
                            >
                                <Video className="h-5 w-5 mr-2" />
                                Start Video Call
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="w-full"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )

            case 'rejected':
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                Request Declined
                            </h3>
                            <p className="text-slate-600 mb-4">
                                {tutorName} is unable to help with your doubt right now.
                                You can try asking another tutor or try again later.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Button
                                onClick={onClose}
                                className="w-full"
                                variant="outline"
                            >
                                Find Another Tutor
                            </Button>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white border border-gray-200 shadow-xl z-[9999] fixed">
                <div className="bg-white rounded-lg p-6 relative z-[10000]">
                    <DialogHeader className="pb-4 border-b border-gray-100">
                        <DialogTitle className="flex items-center text-slate-800">
                            <Phone className="h-5 w-5 mr-2 text-blue-600" />
                            Doubt Request Status
                        </DialogTitle>
                    </DialogHeader>

                    <div className="pt-4">
                        {getStatusContent()}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}