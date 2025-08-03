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
                <DialogHeader className="bg-green-500 text-white p-4 -m-6 mb-6 rounded-t-lg">
                    <DialogTitle className="text-white text-xl font-bold text-center">
                        📞 Incoming Call
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 bg-white">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 animate-pulse shadow-lg">
                        <Phone className="h-10 w-10 text-white" />
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-black mb-2">
                            {callerName}
                        </h3>
                        <p className="text-gray-600 font-medium">
                            Student requesting help
                        </p>
                    </div>

                    {/* Action Buttons - Larger and Better Styled */}
                    <div className="flex justify-center space-x-6 pt-4">
                        <Button
                            onClick={handleDecline}
                            disabled={isResponding}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 text-lg border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all"
                        >
                            <PhoneOff className="h-6 w-6 mr-3" />
                            DECLINE
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={isResponding}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 text-lg border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all animate-pulse"
                        >
                            <Video className="h-6 w-6 mr-3" />
                            ACCEPT
                        </Button>
                    </div>

                    {isResponding && (
                        <p className="text-sm text-gray-500 animate-pulse mt-4">
                            Responding...
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
