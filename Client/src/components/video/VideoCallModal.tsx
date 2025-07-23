"use client"

import { useEffect, useRef, useState } from "react"
import { useVideoCall } from "@/context/VideoCallContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    MonitorOff,
    MessageCircle,
    X,
    Maximize,
    Minimize
} from "lucide-react"

export default function VideoCallModal() {
    const {
        callState,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        startScreenShare,
        stopScreenShare,
        sendChatMessage,
        chatMessages
    } = useVideoCall()

    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const [showChat, setShowChat] = useState(false)
    const [chatMessage, setChatMessage] = useState("")
    const [isFullscreen, setIsFullscreen] = useState(false)


    // Set up local video stream
    useEffect(() => {
        if (localVideoRef.current && callState.localStream) {
            localVideoRef.current.srcObject = callState.localStream
        }
    }, [callState.localStream])

    // Set up remote video stream
    useEffect(() => {
        if (remoteVideoRef.current && callState.remoteStream) {
            remoteVideoRef.current.srcObject = callState.remoteStream
        }
    }, [callState.remoteStream])

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            sendChatMessage(chatMessage.trim())
            setChatMessage("")
        }
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Debug logging for call state
    useEffect(() => {
        console.log('🎬 VideoCallModal - Call state changed:', {
            isInCall: callState.isInCall,
            isIncomingCall: callState.isIncomingCall,
            isOutgoingCall: callState.isOutgoingCall,
            callerId: callState.callerId,
            callerName: callState.callerName,
            sessionId: callState.sessionId
        });
        
        // If we have an incoming call, store the timestamp
        if (callState.isIncomingCall) {
            (window as any).lastIncomingCallTime = Date.now();
        }
        
        // If we're not in any call state, make sure to clean up
        if (!callState.isInCall && !callState.isIncomingCall && !callState.isOutgoingCall) {
            (window as any).lastIncomingCallTime = null;
        }
    }, [callState.isInCall, callState.isIncomingCall, callState.isOutgoingCall, callState.callerId, callState.callerName, callState.sessionId])
    
    // Add a cleanup effect to ensure we don't have stale call state
    useEffect(() => {
        // This will run when the component unmounts or when dependencies change
        return () => {
            console.log('🎬 VideoCallModal - Cleanup effect running');
            
            // Don't call endCall() in cleanup as it can cause infinite loops
            // The VideoCallContext will handle proper cleanup
        };
    }, [])
    
    // Track when the incoming call started to auto-reject after a timeout
    const incomingCallStartTimeRef = useRef<number | null>(null);
    
    // Add an effect to handle incoming call timeout
    useEffect(() => {
        // If we have a new incoming call, record the start time
        if (callState.isIncomingCall && !incomingCallStartTimeRef.current) {
            incomingCallStartTimeRef.current = Date.now();
            console.log('🎬 VideoCallModal - New incoming call detected, recording start time');
            
            // Auto-reject the call after 30 seconds if not answered
            const autoRejectTimer = setTimeout(() => {
                if (callState.isIncomingCall) {
                    console.log('🎬 VideoCallModal - Auto-rejecting call after timeout');
                    rejectCall();
                }
            }, 30000); // 30 seconds
            
            return () => {
                clearTimeout(autoRejectTimer);
            };
        }
        
        // If the call is no longer incoming, reset the start time
        if (!callState.isIncomingCall) {
            incomingCallStartTimeRef.current = null;
        }
    }, [callState.isIncomingCall, rejectCall])
    
    // Add a direct handler for the call end event
    useEffect(() => {
        // Listen for custom call-end events that might be dispatched by other components
        const handleCallEndEvent = () => {
            console.log('🎬 VideoCallModal - Received call-end event, forcing reset');
            endCall();
        };
        
        window.addEventListener('call-end', handleCallEndEvent);
        
        return () => {
            window.removeEventListener('call-end', handleCallEndEvent);
        };
    }, [endCall])

    // Don't render if not in call or no call state
    if (!callState.isInCall && !callState.isIncomingCall && !callState.isOutgoingCall) {
        console.log('🎬 VideoCallModal - Not rendering (no active call state)')
        return null
    }

    console.log('🎬 VideoCallModal - Rendering with state:', {
        isInCall: callState.isInCall,
        isIncomingCall: callState.isIncomingCall,
        isOutgoingCall: callState.isOutgoingCall
    })

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col">
                {/* Incoming Call */}
                {callState.isIncomingCall && (
                    <div className="flex-1 flex items-center justify-center">
                        <Card className="w-full max-w-md">
                            <CardContent className="p-8 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                    {callState.callerName?.[0] || "U"}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">
                                    Incoming Call
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    {callState.callerName || "Unknown"} is calling you
                                </p>
                                <div className="flex space-x-4 justify-center">
                                    <Button
                                        onClick={rejectCall}
                                        variant="outline"
                                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                    >
                                        <PhoneOff className="h-4 w-4 mr-2" />
                                        Decline
                                    </Button>
                                    <Button
                                        onClick={acceptCall}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Accept
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Outgoing Call */}
                {callState.isOutgoingCall && (
                    <div className="flex-1 flex items-center justify-center">
                        <Card className="w-full max-w-md">
                            <CardContent className="p-8 text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                    {callState.calleeName?.[0] || "U"}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 mb-2">
                                    Calling...
                                </h2>
                                <p className="text-slate-600 mb-6">
                                    Calling {callState.calleeName || "Unknown"}
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
                                    Cancel
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Active Call */}
                {callState.isInCall && (
                    <div className="flex-1 flex flex-col">
                        {/* Video Area */}
                        <div className="flex-1 relative">
                            {/* Remote Video (Main) */}
                            <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />

                                {/* Remote user info overlay */}
                                <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                                    <span className="text-sm">
                                        {callState.callerId ? callState.callerName : callState.calleeName}
                                    </span>
                                </div>

                                {/* Connection status */}
                                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                                    <span className="text-sm capitalize">
                                        {callState.connectionState || 'connecting'}
                                    </span>
                                </div>

                                {/* Local Video (Picture-in-Picture) */}
                                <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-800 rounded-lg overflow-hidden border-2 border-white">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    {callState.isVideoOff && (
                                        <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                                            <VideoOff className="h-8 w-8 text-slate-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Screen sharing indicator */}
                                {callState.isScreenSharing && (
                                    <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg">
                                        <Monitor className="h-4 w-4 inline mr-2" />
                                        <span className="text-sm">Sharing Screen</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-4 flex items-center justify-center space-x-4">
                            {/* Mute/Unmute */}
                            <Button
                                onClick={toggleMute}
                                variant={callState.isMuted ? "default" : "outline"}
                                size="lg"
                                className={`rounded-full w-12 h-12 ${callState.isMuted
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                {callState.isMuted ? (
                                    <MicOff className="h-5 w-5" />
                                ) : (
                                    <Mic className="h-5 w-5" />
                                )}
                            </Button>

                            {/* Video On/Off */}
                            <Button
                                onClick={toggleVideo}
                                variant={callState.isVideoOff ? "default" : "outline"}
                                size="lg"
                                className={`rounded-full w-12 h-12 ${callState.isVideoOff
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                {callState.isVideoOff ? (
                                    <VideoOff className="h-5 w-5" />
                                ) : (
                                    <Video className="h-5 w-5" />
                                )}
                            </Button>

                            {/* Screen Share */}
                            <Button
                                onClick={callState.isScreenSharing ? stopScreenShare : startScreenShare}
                                variant={callState.isScreenSharing ? "default" : "outline"}
                                size="lg"
                                className={`rounded-full w-12 h-12 ${callState.isScreenSharing
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                {callState.isScreenSharing ? (
                                    <MonitorOff className="h-5 w-5" />
                                ) : (
                                    <Monitor className="h-5 w-5" />
                                )}
                            </Button>

                            {/* Chat */}
                            <Button
                                onClick={() => setShowChat(!showChat)}
                                variant={showChat ? "default" : "outline"}
                                size="lg"
                                className={`rounded-full w-12 h-12 ${showChat
                                    ? 'bg-slate-600 hover:bg-slate-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                <MessageCircle className="h-5 w-5" />
                            </Button>

                            {/* Fullscreen */}
                            <Button
                                onClick={toggleFullscreen}
                                variant="outline"
                                size="lg"
                                className="rounded-full w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700"
                            >
                                {isFullscreen ? (
                                    <Minimize className="h-5 w-5" />
                                ) : (
                                    <Maximize className="h-5 w-5" />
                                )}
                            </Button>

                            {/* End Call */}
                            <Button
                                onClick={endCall}
                                size="lg"
                                className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700 text-white"
                            >
                                <PhoneOff className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Chat Panel */}
                {showChat && callState.isInCall && (
                    <div className="fixed right-4 top-4 bottom-20 w-80 bg-white rounded-lg shadow-xl border flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800">Chat</h3>
                            <Button
                                onClick={() => setShowChat(false)}
                                variant="ghost"
                                size="sm"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.isOwn
                                            ? 'bg-slate-600 text-white'
                                            : 'bg-slate-100 text-slate-800'
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                        <p className={`text-xs mt-1 ${msg.isOwn ? 'text-slate-300' : 'text-slate-500'
                                            }`}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t">
                            <div className="flex space-x-2">
                                <Input
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1"
                                />
                                <Button onClick={handleSendMessage} size="sm">
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}