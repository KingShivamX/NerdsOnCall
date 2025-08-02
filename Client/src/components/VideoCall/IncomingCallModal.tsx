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
    onDecline,
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
            <DialogContent className="sm:max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_black]">
                <DialogHeader className="bg-black text-white p-4 -m-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
                        <Phone className="h-10 w-10 text-white animate-bounce" />
                    </div>
                    <DialogTitle className="text-white text-xl font-bold text-center">
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
                                Student requesting help
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-4">
                        <Button
                            onClick={handleDecline}
                            disabled={isResponding}
                            variant="outline"
                            className="bg-red-500 border-4 border-black text-white font-bold shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all px-6 py-3"
                        >
                            <PhoneOff className="h-5 w-5 mr-2" />
                            DECLINE
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={isResponding}
                            className="bg-green-500 border-4 border-black text-white font-bold shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all animate-pulse px-6 py-3"
                        >
                            <Video className="h-5 w-5 mr-2" />
                            ACCEPT CALL
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
