"use client"

import { useEffect } from "react"
import { useVideoCall } from "@/context/VideoCallContext"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, PhoneOff, Video, Clock } from "lucide-react"

export default function IncomingCalls() {
    const { callState, acceptCall, rejectCall } = useVideoCall()
    const { user } = useAuth()

    // Detailed console logging
    console.log('🎯 IncomingCalls component render')
    console.log('🎯 User:', user?.id, user?.role)
    console.log('🎯 CallState:', JSON.stringify(callState, null, 2))
    console.log('🎯 isIncomingCall:', callState.isIncomingCall)
    console.log('🎯 callerId:', callState.callerId)
    console.log('🎯 callerName:', callState.callerName)
    console.log('🎯 sessionId:', callState.sessionId)

    // Track state changes
    useEffect(() => {
        console.log('🔄 IncomingCalls useEffect - callState changed:', JSON.stringify(callState, null, 2))
        console.log('🔄 IncomingCalls useEffect - isIncomingCall:', callState.isIncomingCall)
    }, [callState])

    useEffect(() => {
        console.log('🔄 IncomingCalls useEffect - isIncomingCall specifically changed:', callState.isIncomingCall)
        if (callState.isIncomingCall) {
            console.log('🔔 INCOMING CALL DETECTED IN COMPONENT!')
            console.log('🔔 Caller ID:', callState.callerId)
            console.log('🔔 Caller Name:', callState.callerName)
            console.log('🔔 Session ID:', callState.sessionId)
        }
    }, [callState.isIncomingCall])

    // Only show for tutors
    if (user?.role !== "TUTOR") {
        console.log('🎯 Not showing IncomingCalls - user is not TUTOR')
        return null
    }

    // If no incoming calls, show empty state
    if (!callState.isIncomingCall) {
        return (
            <Card className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle className="flex items-center text-slate-800">
                        <Phone className="w-5 h-5 mr-2 text-emerald-600" />
                        Incoming Video Calls
                        <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">
                            0
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                    <div className="text-center py-8">
                        <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500">No incoming calls</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Students will see your call requests here
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Show incoming call
    return (
        <Card className="bg-white/95 backdrop-blur-sm border border-emerald-200 shadow-lg ring-2 ring-emerald-100">
            <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex items-center text-slate-800">
                    <Phone className="w-5 h-5 mr-2 text-emerald-600 animate-pulse" />
                    Incoming Video Calls
                    <Badge className="ml-2 bg-emerald-100 text-emerald-700 animate-pulse">
                        1
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {callState.callerName?.[0] || "S"}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800">
                                        {callState.callerName || "Unknown Student"}
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Student ID: {callState.callerId}
                                    </p>
                                    <div className="flex items-center mt-2 text-xs text-slate-500">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Calling now
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex space-x-3 mt-4">
                            <Button
                                onClick={rejectCall}
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                            >
                                <PhoneOff className="h-4 w-4 mr-2" />
                                Decline
                            </Button>
                            <Button
                                onClick={acceptCall}
                                size="sm"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Phone className="h-4 w-4 mr-2" />
                                Accept Call
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}