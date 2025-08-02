"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Phone, PhoneOff, Video } from "lucide-react"

interface IncomingCallModalProps {
    isOpen: boolean
    callerName: string
    callerId: string
    sessionId: string
    onAccept: () => void
    onDecline: () => void
}

export function IncomingCallModal({
    isOpen,
    callerName,
    callerId,
    sessionId,
    onAccept,
    onDecline
}: IncomingCallModalProps) {
    const [isResponding, setIsResponding] = useState(false)

    const handleAccept = () => {
        setIsResponding(true)
        onAccept()
    }

    const handleDecline = () => {
        setIsResponding(true)
        onDecline()
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md bg-white border-2 border-green-400 shadow-2xl">
                <DialogHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
                        <Phone className="h-10 w-10 text-white animate-bounce" />
                    </div>
                    <DialogTitle className="text-green-800 text-xl font-bold">
                        📞 Incoming Call
                    </DialogTitle>
                </DialogHeader>

                <div className="text-center space-y-4">
                    {/* Caller Info */}
                    <div className="flex items-center justify-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {callerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                {callerName}
                            </h3>
                            <p className="text-sm text-gray-600">
                                wants to start a video call
                            </p>
                        </div>
                    </div>

                    {/* Session Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600">
                            Session: {sessionId}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <Button
                            onClick={handleDecline}
                            disabled={isResponding}
                            variant="outline"
                            className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 px-6 py-3 rounded-full shadow-md"
                        >
                            <PhoneOff className="h-5 w-5 mr-2" />
                            Decline
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={isResponding}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg animate-pulse"
                        >
                            <Video className="h-5 w-5 mr-2" />
                            Accept Call
                        </Button>
                    </div>

                    {isResponding && (
                        <p className="text-sm text-gray-500 animate-pulse">
                            Responding...
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}