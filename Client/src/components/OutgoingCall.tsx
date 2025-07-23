"use client"

import { useVideoCall } from "@/context/VideoCallContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { PhoneOff } from "lucide-react"

export default function OutgoingCall() {
    const { callState, endCall } = useVideoCall()

    // Only show when making an outgoing call
    if (!callState.isOutgoingCall) {
        return null
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                {callState.calleeName?.[0] || "T"}
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">
                                Calling...
                            </h2>
                            <p className="text-slate-600 mb-6">
                                Calling {callState.calleeName || "Tutor"}
                            </p>
                            <div className="animate-pulse mb-6">
                                <div className="flex justify-center space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                            <Button
                                onClick={endCall}
                                variant="outline"
                                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                                <PhoneOff className="h-4 w-4 mr-2" />
                                Cancel Call
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}