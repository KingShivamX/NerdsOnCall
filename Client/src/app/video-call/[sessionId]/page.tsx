"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    Monitor,
    MonitorOff,
    Phone,
    PhoneOff,
    MessageSquare,
    PenTool,
    Users,
} from "lucide-react"
import { Responsive, WidthProvider } from "react-grid-layout"
import { Excalidraw } from "@excalidraw/excalidraw"
import * as Y from "yjs"
import { ChatPanel } from "@/components/VideoCall/ChatPanel"
import { IncomingCallNotification } from "@/components/VideoCall/IncomingCallNotification"
import toast from "react-hot-toast"
import { api } from "@/lib/api"
import {
    getUserFriendlyErrorMessage,
    getWebSocketErrorMessage,
} from "@/utils/errorMessages"

// Import CSS for react-grid-layout
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ResponsiveGridLayout = WidthProvider(Responsive)

interface VideoCallPageProps {}

export default function VideoCallPage() {
    const { user } = useAuth()
    const router = useRouter()
    const params = useParams()
    const sessionId = params.sessionId as string

    // Video call states
    const [status, setStatus] = useState<string>("Initializing...")
    const [callStatus, setCallStatus] = useState<string>("Idle")
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [showWhiteboard, setShowWhiteboard] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [otherUserName, setOtherUserName] = useState("")

    // Grid layout states
    const [layouts, setLayouts] = useState({
        lg: [
            { i: "remote-video", x: 0, y: 0, w: 8, h: 8, minW: 4, minH: 4 },
            { i: "local-video", x: 8, y: 0, w: 4, h: 4, minW: 2, minH: 2 },
            { i: "chat", x: 8, y: 4, w: 4, h: 8, minW: 3, minH: 4 },
            { i: "whiteboard", x: 0, y: 8, w: 8, h: 6, minW: 4, minH: 4 },
            { i: "controls", x: 0, y: 14, w: 12, h: 2, minW: 8, minH: 2 },
        ],
        md: [
            { i: "remote-video", x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 },
            { i: "local-video", x: 6, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
            { i: "chat", x: 6, y: 3, w: 4, h: 7, minW: 3, minH: 4 },
            { i: "whiteboard", x: 0, y: 6, w: 6, h: 6, minW: 4, minH: 4 },
            { i: "controls", x: 0, y: 12, w: 10, h: 2, minW: 6, minH: 2 },
        ],
        sm: [
            { i: "remote-video", x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3 },
            { i: "local-video", x: 0, y: 5, w: 3, h: 3, minW: 2, minH: 2 },
            { i: "chat", x: 3, y: 5, w: 3, h: 5, minW: 2, minH: 4 },
            { i: "whiteboard", x: 0, y: 8, w: 6, h: 5, minW: 3, minH: 4 },
            { i: "controls", x: 0, y: 13, w: 6, h: 2, minW: 4, minH: 2 },
        ],
    })

    // Video refs and WebRTC states
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const socketRef = useRef<WebSocket | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const screenStreamRef = useRef<MediaStream | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const isConnectedRef = useRef<boolean>(false)
    const isInCallRef = useRef<boolean>(false)
    const whiteboardSocketRef = useRef<WebSocket | null>(null)

    // Additional states for session management
    const [otherUserId, setOtherUserId] = useState(0)
    const [userRole, setUserRole] = useState<string>("")
    const [waitingForTutor, setWaitingForTutor] = useState(false)
    const [tutorReady, setTutorReady] = useState(false)

    // Yjs document for collaborative whiteboard
    const yjsDocRef = useRef<Y.Doc | null>(null)
    const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)

    // Incoming call state
    const [incomingCall, setIncomingCall] = useState<any>(null)
    const [showIncomingCallModal, setShowIncomingCallModal] = useState(false)

    // Initialize video call and get participant info
    useEffect(() => {
        // Get participant info from URL search params
        const urlParams = new URLSearchParams(window.location.search)
        const tutorIdParam = urlParams.get("tutorId")
        const tutorNameParam = urlParams.get("tutorName")
        const role = urlParams.get("role")
        const waitingParam = urlParams.get("waitingForTutor")

        console.log("🔍 Video call page initialization:")
        console.log(
            "- Auth user:",
            user?.firstName,
            user?.lastName,
            "ID:",
            user?.id,
            "Role:",
            user?.role
        )
        console.log(
            "- URL params - tutorId:",
            tutorIdParam,
            "tutorName:",
            tutorNameParam,
            "role:",
            role
        )

        if (tutorIdParam) {
            setOtherUserId(parseInt(tutorIdParam))
        }

        if (user?.role === "TUTOR") {
            // Extract student ID from session ID format: tutor_X_student_Y_timestamp
            const sessionParts = sessionId.split("_")
            if (sessionParts.length >= 4 && sessionParts[2] === "student") {
                const studentId = parseInt(sessionParts[3])
                setOtherUserId(studentId)
                setOtherUserName("Student")
            }
            setUserRole("tutor")
        } else {
            if (tutorNameParam) {
                setOtherUserName(decodeURIComponent(tutorNameParam))
            } else {
                setOtherUserName("Tutor")
            }
            setUserRole("student")
        }

        // Initialize video call
        initializeVideoCall()

        return () => {
            cleanupConnection()
        }
    }, [sessionId, user])

    // Initialize Yjs document for collaborative whiteboard
    useEffect(() => {
        if (!yjsDocRef.current) {
            yjsDocRef.current = new Y.Doc()
            console.log(
                "🎨 Yjs document initialized for collaborative whiteboard"
            )
        }

        return () => {
            if (yjsDocRef.current) {
                yjsDocRef.current.destroy()
                yjsDocRef.current = null
            }
        }
    }, [])

    // Add cleanup on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            cleanupConnection()
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [])

    const initializeVideoCall = async () => {
        try {
            setStatus("Setting up video call...")
            setCallStatus("Idle") // Ensure call status is Idle during initialization
            await setupLocalStream()
            await connectToSignalingServer()
        } catch (error) {
            console.error("Error initializing video call:", error)
            setStatus("Failed to initialize video call")
            setCallStatus("Idle")
        }
    }

    const setupLocalStream = async () => {
        try {
            setStatus("Accessing camera and microphone...")
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 60 },
                    facingMode: "user",
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            })

            localStreamRef.current = stream

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            setStatus("Ready to call")
            // Ensure call status remains Idle after setup
            if (callStatus !== "Calling..." && callStatus !== "Connected") {
                setCallStatus("Idle")
            }
        } catch (error: any) {
            console.error("Error accessing media devices:", error)
            setStatus(`Media error: ${error.message}`)
        }
    }

    const connectToSignalingServer = async () => {
        try {
            const serverUrl =
                process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
                "ws://localhost:8080"
            const wsUrl = `${serverUrl}/ws/webrtc?userId=${user?.id}&sessionId=${sessionId}`

            socketRef.current = new WebSocket(wsUrl)

            socketRef.current.onopen = () => {
                setStatus("Connected")
                isConnectedRef.current = true

                // Wait a bit to ensure WebSocket is fully ready
                setTimeout(() => {
                    if (
                        socketRef.current &&
                        socketRef.current.readyState === WebSocket.OPEN
                    ) {
                        // Join the session and announce presence
                        socketRef.current.send(
                            JSON.stringify({
                                type: "join",
                                userId: user?.id.toString(),
                                sessionId: sessionId,
                                role: userRole,
                                userName: `${user?.firstName} ${user?.lastName}`,
                                timestamp: Date.now(),
                            })
                        )
                    }
                }, 500)
            }

            socketRef.current.onmessage = handleWebSocketMessage
            socketRef.current.onclose = () => {
                setStatus("Disconnected")
                cleanupConnection()
            }
            socketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error)
                setStatus("Connection error")
            }
        } catch (error: any) {
            setStatus(`Error: ${error.message}`)
        }
    }

    const cleanupConnection = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop())
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((track) => track.stop())
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
        }
        if (socketRef.current) {
            socketRef.current.close()
        }
        if (whiteboardSocketRef.current) {
            whiteboardSocketRef.current.close()
        }
    }

    const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data)
            console.log("📨 Received WebSocket message:", message.type)

            switch (message.type) {
                case "incoming_call":
                    setIncomingCall({
                        callerId: message.from,
                        callerName: message.callerName,
                        sessionId: message.sessionId,
                    })
                    setShowIncomingCallModal(true)
                    break
                case "call_accepted":
                    setCallStatus("Calling...")
                    toast.success("Call accepted!")
                    break
                case "call_declined":
                    setCallStatus("Idle")
                    toast.error("Call declined")
                    break
                case "offer":
                    await handleOffer(message)
                    break
                case "answer":
                    await handleAnswer(message)
                    break
                case "ice-candidate":
                    await handleIceCandidate(message)
                    break
                case "user-disconnect":
                    setCallStatus("Idle")
                    toast("Other user disconnected")
                    break
                default:
                    console.log("Unknown message type:", message.type)
            }
        } catch (error) {
            console.error("Error handling WebSocket message:", error)
        }
    }

    const createPeerConnection = () => {
        const configuration = {
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "stun:stun1.l.google.com:19302" },
            ],
        }

        peerConnectionRef.current = new RTCPeerConnection(configuration)

        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate && socketRef.current) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "ice-candidate",
                        to: otherUserId.toString(),
                        from: user?.id.toString(),
                        sessionId: sessionId,
                        data: event.candidate,
                    })
                )
            }
        }

        peerConnectionRef.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0]
            }
            // Only set to Connected if we're actually in a call
            if (isInCallRef.current) {
                setCallStatus("Connected")
            }
        }

        peerConnectionRef.current.onconnectionstatechange = () => {
            console.log(
                "Connection state:",
                peerConnectionRef.current?.connectionState
            )
        }
    }

    const handleOffer = async (message: any) => {
        try {
            if (!peerConnectionRef.current) {
                createPeerConnection()

                if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach((track) => {
                        if (
                            peerConnectionRef.current &&
                            localStreamRef.current
                        ) {
                            peerConnectionRef.current.addTrack(
                                track,
                                localStreamRef.current
                            )
                        }
                    })
                }
            }

            await peerConnectionRef.current!.setRemoteDescription(
                new RTCSessionDescription(message.data)
            )
            const answer = await peerConnectionRef.current!.createAnswer()
            await peerConnectionRef.current!.setLocalDescription(answer)

            if (socketRef.current) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "answer",
                        to: message.from,
                        from: user?.id.toString(),
                        sessionId: sessionId,
                        data: answer,
                    })
                )
            }
        } catch (error) {
            console.error("Error handling offer:", error)
        }
    }

    const handleAnswer = async (message: any) => {
        try {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(
                    new RTCSessionDescription(message.data)
                )
            }
        } catch (error) {
            console.error("Error handling answer:", error)
        }
    }

    const handleIceCandidate = async (message: any) => {
        try {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(message.data)
                )
            }
        } catch (error) {
            console.error("Error handling ICE candidate:", error)
        }
    }

    // Grid layout handlers
    const onLayoutChange = useCallback((layout: any, layouts: any) => {
        setLayouts(layouts)
    }, [])

    const onBreakpointChange = useCallback((breakpoint: string) => {
        console.log("Breakpoint changed:", breakpoint)
    }, [])

    // Toggle functions
    const toggleWhiteboard = useCallback(() => {
        setShowWhiteboard((prev) => !prev)
        toast(showWhiteboard ? "Whiteboard closed" : "Whiteboard opened")
    }, [showWhiteboard])

    const toggleAudio = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !isAudioEnabled
                setIsAudioEnabled(!isAudioEnabled)
                toast(isAudioEnabled ? "Audio muted" : "Audio unmuted")
            }
        }
    }, [isAudioEnabled])

    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !isVideoEnabled
                setIsVideoEnabled(!isVideoEnabled)
                toast(isVideoEnabled ? "Video disabled" : "Video enabled")
            }
        }
    }, [isVideoEnabled])

    const toggleScreenShare = useCallback(async () => {
        try {
            if (!isScreenSharing) {
                const screenStream =
                    await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: true,
                    })

                screenStreamRef.current = screenStream

                if (peerConnectionRef.current && localStreamRef.current) {
                    const videoTrack = screenStream.getVideoTracks()[0]
                    const sender = peerConnectionRef.current
                        .getSenders()
                        .find((s) => s.track && s.track.kind === "video")

                    if (sender) {
                        await sender.replaceTrack(videoTrack)
                    }
                }

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream
                }

                setIsScreenSharing(true)
                toast.success("Screen sharing started")

                screenStream.getVideoTracks()[0].onended = () => {
                    stopScreenShare()
                }
            } else {
                stopScreenShare()
            }
        } catch (error: any) {
            console.error("Error toggling screen share:", error)
            toast.error("Error with screen sharing")
        }
    }, [isScreenSharing])

    const stopScreenShare = async () => {
        try {
            if (screenStreamRef.current) {
                screenStreamRef.current
                    .getTracks()
                    .forEach((track) => track.stop())
                screenStreamRef.current = null
            }

            if (peerConnectionRef.current && localStreamRef.current) {
                const videoTrack = localStreamRef.current.getVideoTracks()[0]
                const sender = peerConnectionRef.current
                    .getSenders()
                    .find((s) => s.track && s.track.kind === "video")

                if (sender && videoTrack) {
                    await sender.replaceTrack(videoTrack)
                }
            }

            if (localVideoRef.current && localStreamRef.current) {
                localVideoRef.current.srcObject = localStreamRef.current
            }

            setIsScreenSharing(false)
            toast("Screen sharing stopped")
        } catch (error: any) {
            console.error("Error stopping screen share:", error)
            toast.error("Error stopping screen share")
        }
    }

    const startCall = useCallback(async () => {
        try {
            setCallStatus("Calling...")

            // Create session in backend
            try {
                let parameterToPass
                if (user?.role === "STUDENT") {
                    parameterToPass = otherUserId
                } else if (user?.role === "TUTOR") {
                    parameterToPass = otherUserId
                } else {
                    throw new Error("Unknown user role: " + user?.role)
                }

                if (!parameterToPass || parameterToPass === 0) {
                    console.warn(
                        "⚠️ No valid other user ID found, skipping session creation"
                    )
                    return
                }

                const response = await api.post(
                    `/api/sessions/call?tutorId=${parameterToPass}&sessionId=${sessionId}`
                )
                console.log("✅ Session created successfully:", response.data)
            } catch (error: any) {
                console.warn(
                    "Session creation failed, continuing with call:",
                    error.message
                )
            }

            // Start session tracking
            try {
                await api.put(`/api/sessions/call/${sessionId}/start`)
            } catch (error: any) {
                console.warn(
                    "Session start failed, continuing with call:",
                    error.message
                )
            }

            createPeerConnection()

            if (localStreamRef.current && peerConnectionRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    if (peerConnectionRef.current && localStreamRef.current) {
                        peerConnectionRef.current.addTrack(
                            track,
                            localStreamRef.current
                        )
                    }
                })
            }

            // Send incoming call notification to other user
            if (socketRef.current) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "incoming_call",
                        to: otherUserId.toString(),
                        from: user?.id.toString(),
                        callerName: `${user?.firstName} ${user?.lastName}`,
                        callerId: user?.id,
                        sessionId: sessionId,
                        timestamp: Date.now(),
                    })
                )
            }

            // Create and send offer
            const offer = await peerConnectionRef.current!.createOffer()
            await peerConnectionRef.current!.setLocalDescription(offer)

            if (socketRef.current) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "offer",
                        to: otherUserId.toString(),
                        from: user?.id.toString(),
                        sessionId: sessionId,
                        data: offer,
                    })
                )
            }

            isInCallRef.current = true
            toast.success("Call initiated!")
        } catch (error: any) {
            console.error("Error starting call:", error)
            setCallStatus("Idle")
            toast.error("Failed to start call")
        }
    }, [user, otherUserId, sessionId])

    const endCall = useCallback(async () => {
        try {
            setCallStatus("Idle")
            isInCallRef.current = false

            // End the session in the backend to calculate duration and earnings
            try {
                const response = await api.put(
                    `/api/sessions/call/${sessionId}/end`
                )
                console.log("✅ Session ended successfully:", response.data)

                if (
                    response.data.durationMinutes &&
                    response.data.tutorEarnings
                ) {
                    const duration = response.data.durationMinutes
                    const earnings = response.data.tutorEarnings
                    const cost = response.data.cost

                    toast.success(
                        `Session completed! Duration: ${duration} min, ${
                            user?.role === "TUTOR"
                                ? `Earnings: ₹${Math.round(earnings * 83)}`
                                : `Cost: ₹${Math.round(cost * 83)}`
                        }`,
                        { duration: 5000 }
                    )
                } else {
                    toast.success("Session ended successfully!")
                }
            } catch (error) {
                console.warn("Session end failed:", error)
                toast.success("Call ended")
            }

            // Notify other user
            if (socketRef.current) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "user-disconnect",
                        userId: user?.id.toString(),
                        sessionId: sessionId,
                    })
                )
            }

            cleanupConnection()

            // Navigate back after a delay
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000)
        } catch (error: any) {
            console.error("Error ending call:", error)
            toast.error("Error ending call")
        }
    }, [user, sessionId, router])

    const handleAcceptCall = useCallback(() => {
        setShowIncomingCallModal(false)
        setCallStatus("Calling...")

        if (socketRef.current && incomingCall) {
            socketRef.current.send(
                JSON.stringify({
                    type: "call_accepted",
                    to: incomingCall.callerId.toString(),
                    from: user?.id.toString(),
                    sessionId: incomingCall.sessionId,
                })
            )
        }

        toast.success("Call accepted")
    }, [incomingCall, user])

    const handleDeclineCall = useCallback(() => {
        setShowIncomingCallModal(false)

        if (socketRef.current && incomingCall) {
            socketRef.current.send(
                JSON.stringify({
                    type: "call_declined",
                    to: incomingCall.callerId.toString(),
                    from: user?.id.toString(),
                    sessionId: incomingCall.sessionId,
                    declinerName: `${user?.firstName} ${user?.lastName}`,
                })
            )
        }

        setIncomingCall(null)
        toast.error("Call declined")
    }, [incomingCall, user])

    if (!user) {
        return (
            <div className="min-h-screen bg-orange-100 flex items-center justify-center">
                <p className="text-black font-bold uppercase tracking-wide">
                    Please log in to join the video call.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-orange-100 text-black relative overflow-hidden">
            {/* Grid Layout Container */}
            <div className="h-screen p-4 pb-24 overflow-hidden">
                <ResponsiveGridLayout
                    className="layout"
                    layouts={layouts}
                    onLayoutChange={onLayoutChange}
                    onBreakpointChange={onBreakpointChange}
                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                    }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={50}
                    compactType="vertical"
                    preventCollision={false}
                    isDraggable={true}
                    isResizable={true}
                    margin={[8, 8]}
                    containerPadding={[8, 8]}
                >
                    {/* Remote Video Card */}
                    <div
                        key="remote-video"
                        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden"
                    >
                        <div className="h-full flex flex-col">
                            <div className="bg-black text-white p-2 flex items-center justify-between border-b-4 border-black">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span className="font-black uppercase tracking-wide text-sm">
                                        {otherUserName || "Remote User"}
                                    </span>
                                </div>
                                <div
                                    className={`px-2 py-1 text-xs font-black uppercase tracking-wide border-2 border-white ${
                                        callStatus === "Connected"
                                            ? "bg-green-400 text-black"
                                            : "bg-red-400 text-black"
                                    }`}
                                >
                                    {callStatus}
                                </div>
                            </div>
                            <div className="flex-1 relative bg-black overflow-hidden">
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                    style={{ minHeight: "200px" }}
                                />
                                {callStatus !== "Connected" && (
                                    <div className="absolute inset-0 bg-cyan-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-black border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl font-black text-white">
                                                    {otherUserName?.charAt(0) ||
                                                        "U"}
                                                </span>
                                            </div>
                                            <p className="text-lg text-black font-black uppercase tracking-wide">
                                                {callStatus === "Idle"
                                                    ? "Click Start Call to begin"
                                                    : callStatus ===
                                                      "Calling..."
                                                    ? "Connecting..."
                                                    : callStatus === "Connected"
                                                    ? "Call in progress"
                                                    : callStatus}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Local Video Card */}
                    <div
                        key="local-video"
                        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden"
                    >
                        <div className="h-full flex flex-col">
                            <div className="bg-pink-300 text-black p-2 flex items-center justify-between border-b-4 border-black">
                                <div className="flex items-center space-x-2">
                                    <Video className="h-4 w-4" />
                                    <span className="font-black uppercase tracking-wide text-sm">
                                        You ({user?.firstName})
                                    </span>
                                </div>
                                <div
                                    className={`px-2 py-1 text-xs font-black uppercase tracking-wide border-2 border-black ${
                                        isVideoEnabled
                                            ? "bg-green-300 text-black"
                                            : "bg-red-300 text-black"
                                    }`}
                                >
                                    {isVideoEnabled ? "Video On" : "Video Off"}
                                </div>
                            </div>
                            <div className="flex-1 relative bg-black overflow-hidden">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                    style={{ minHeight: "150px" }}
                                />
                                {!isVideoEnabled && (
                                    <div className="absolute inset-0 bg-pink-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-black border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center mx-auto mb-4">
                                                <span className="text-2xl font-black text-white">
                                                    {user?.firstName?.charAt(
                                                        0
                                                    ) || "Y"}
                                                </span>
                                            </div>
                                            <p className="text-lg text-black font-black uppercase tracking-wide">
                                                Video Disabled
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Whiteboard Card */}
                    <div
                        key="whiteboard"
                        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden"
                    >
                        <div className="h-full flex flex-col">
                            <div className="bg-green-300 text-black p-2 flex items-center justify-between border-b-4 border-black">
                                <div className="flex items-center space-x-2">
                                    <PenTool className="h-4 w-4" />
                                    <span className="font-black uppercase tracking-wide text-sm">
                                        Collaborative Whiteboard
                                    </span>
                                </div>
                                <Button
                                    onClick={toggleWhiteboard}
                                    className={`px-2 py-1 text-xs border-2 border-black font-black uppercase tracking-wide ${
                                        showWhiteboard
                                            ? "bg-red-300 hover:bg-red-400 text-black"
                                            : "bg-blue-300 hover:bg-blue-400 text-black"
                                    }`}
                                >
                                    {showWhiteboard ? "Close" : "Open"}
                                </Button>
                            </div>
                            <div className="flex-1 relative">
                                {showWhiteboard ? (
                                    <Excalidraw
                                        ref={(api) => setExcalidrawAPI(api)}
                                        theme="light"
                                        initialData={{
                                            elements: [],
                                            appState: {
                                                viewBackgroundColor: "#ffffff",
                                                currentItemFontFamily: 1,
                                            },
                                        }}
                                        UIOptions={{
                                            canvasActions: {
                                                loadScene: false,
                                                export: false,
                                                saveToActiveFile: false,
                                                toggleTheme: false,
                                            },
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-green-100">
                                        <div className="text-center">
                                            <PenTool className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                                            <p className="text-black font-black uppercase tracking-wide">
                                                Click "Open" to start whiteboard
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat Card */}
                    <div
                        key="chat"
                        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden"
                    >
                        <div className="h-full flex flex-col">
                            <div className="bg-yellow-300 text-black p-2 flex items-center justify-between border-b-4 border-black">
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="font-black uppercase tracking-wide text-sm">
                                        Chat
                                    </span>
                                </div>
                                <Button
                                    onClick={() => setShowChat(!showChat)}
                                    className={`px-2 py-1 text-xs border-2 border-black font-black uppercase tracking-wide ${
                                        showChat
                                            ? "bg-red-300 hover:bg-red-400 text-black"
                                            : "bg-blue-300 hover:bg-blue-400 text-black"
                                    }`}
                                >
                                    {showChat ? "Close" : "Open"}
                                </Button>
                            </div>
                            <div className="flex-1">
                                {showChat ? (
                                    <ChatPanel
                                        sessionId={sessionId}
                                        user={user}
                                        socket={socketRef.current}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-yellow-100">
                                        <div className="text-center">
                                            <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                                            <p className="text-black font-black uppercase tracking-wide">
                                                Click "Open" to start chat
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controls Card */}
                    <div
                        key="controls"
                        className="bg-black border-4 border-black shadow-[8px_8px_0px_0px_black] overflow-hidden"
                    >
                        <div className="h-full flex items-center justify-center">
                            <div className="flex items-center space-x-4">
                                {/* Audio Toggle */}
                                <Button
                                    onClick={toggleAudio}
                                    className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                                        isAudioEnabled
                                            ? "bg-green-400 hover:bg-green-500 text-black"
                                            : "bg-red-400 hover:bg-red-500 text-black"
                                    }`}
                                >
                                    {isAudioEnabled ? (
                                        <Mic className="h-5 w-5" />
                                    ) : (
                                        <MicOff className="h-5 w-5" />
                                    )}
                                </Button>

                                {/* Video Toggle */}
                                <Button
                                    onClick={toggleVideo}
                                    className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                                        isVideoEnabled
                                            ? "bg-green-400 hover:bg-green-500 text-black"
                                            : "bg-red-400 hover:bg-red-500 text-black"
                                    }`}
                                >
                                    {isVideoEnabled ? (
                                        <Video className="h-5 w-5" />
                                    ) : (
                                        <VideoOff className="h-5 w-5" />
                                    )}
                                </Button>

                                {/* Screen Share Toggle */}
                                <Button
                                    onClick={toggleScreenShare}
                                    className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                                        isScreenSharing
                                            ? "bg-blue-400 hover:bg-blue-500 text-black"
                                            : "bg-gray-400 hover:bg-gray-500 text-black"
                                    }`}
                                >
                                    {isScreenSharing ? (
                                        <MonitorOff className="h-5 w-5" />
                                    ) : (
                                        <Monitor className="h-5 w-5" />
                                    )}
                                </Button>

                                {/* Whiteboard Toggle */}
                                <Button
                                    onClick={toggleWhiteboard}
                                    className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                                        showWhiteboard
                                            ? "bg-green-400 hover:bg-green-500 text-black"
                                            : "bg-gray-400 hover:bg-gray-500 text-black"
                                    }`}
                                >
                                    <PenTool className="h-5 w-5" />
                                </Button>

                                {/* Chat Toggle */}
                                <Button
                                    onClick={() => setShowChat(!showChat)}
                                    className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                                        showChat
                                            ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                                            : "bg-gray-400 hover:bg-gray-500 text-black"
                                    }`}
                                >
                                    <MessageSquare className="h-5 w-5" />
                                </Button>

                                {/* Start/End Call */}
                                {callStatus === "Idle" ? (
                                    <Button
                                        onClick={startCall}
                                        className="p-3 bg-green-500 hover:bg-green-600 text-white border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={endCall}
                                        className="p-3 bg-red-500 hover:bg-red-600 text-white border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black"
                                    >
                                        <PhoneOff className="h-5 w-5" />
                                    </Button>
                                )}

                                {/* Call Status */}
                                <div className="ml-4 px-4 py-2 bg-white text-black border-3 border-white shadow-[4px_4px_0px_0px_white] font-black uppercase tracking-wide">
                                    {status}
                                </div>
                            </div>
                        </div>
                    </div>
                </ResponsiveGridLayout>
            </div>

            {/* Fixed Bottom Controls Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-black border-t-4 border-black shadow-[0px_-8px_0px_0px_black] z-50">
                <div className="flex items-center justify-center p-4 space-x-4">
                    {/* Audio Toggle */}
                    <Button
                        onClick={toggleAudio}
                        className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                            isAudioEnabled
                                ? "bg-green-400 hover:bg-green-500 text-black"
                                : "bg-red-400 hover:bg-red-500 text-black"
                        }`}
                    >
                        {isAudioEnabled ? (
                            <Mic className="h-5 w-5" />
                        ) : (
                            <MicOff className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Video Toggle */}
                    <Button
                        onClick={toggleVideo}
                        className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                            isVideoEnabled
                                ? "bg-green-400 hover:bg-green-500 text-black"
                                : "bg-red-400 hover:bg-red-500 text-black"
                        }`}
                    >
                        {isVideoEnabled ? (
                            <Video className="h-5 w-5" />
                        ) : (
                            <VideoOff className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Screen Share Toggle */}
                    <Button
                        onClick={toggleScreenShare}
                        className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                            isScreenSharing
                                ? "bg-blue-400 hover:bg-blue-500 text-black"
                                : "bg-gray-400 hover:bg-gray-500 text-black"
                        }`}
                    >
                        {isScreenSharing ? (
                            <MonitorOff className="h-5 w-5" />
                        ) : (
                            <Monitor className="h-5 w-5" />
                        )}
                    </Button>

                    {/* Whiteboard Toggle */}
                    <Button
                        onClick={toggleWhiteboard}
                        className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                            showWhiteboard
                                ? "bg-green-400 hover:bg-green-500 text-black"
                                : "bg-gray-400 hover:bg-gray-500 text-black"
                        }`}
                    >
                        <PenTool className="h-5 w-5" />
                    </Button>

                    {/* Chat Toggle */}
                    <Button
                        onClick={() => setShowChat(!showChat)}
                        className={`p-3 border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black ${
                            showChat
                                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                                : "bg-gray-400 hover:bg-gray-500 text-black"
                        }`}
                    >
                        <MessageSquare className="h-5 w-5" />
                    </Button>

                    {/* Start/End Call */}
                    {callStatus === "Idle" ? (
                        <Button
                            onClick={startCall}
                            className="p-4 bg-green-500 hover:bg-green-600 text-white border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black text-lg"
                            title="Start Call"
                        >
                            <Phone className="h-6 w-6" />
                        </Button>
                    ) : (
                        <Button
                            onClick={endCall}
                            className="p-4 bg-red-500 hover:bg-red-600 text-white border-3 border-white shadow-[4px_4px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_white] transition-all font-black text-lg"
                            title="End Call"
                        >
                            <PhoneOff className="h-6 w-6" />
                        </Button>
                    )}

                    {/* Call Status */}
                    <div className="ml-4 px-4 py-2 bg-white text-black border-3 border-white shadow-[4px_4px_0px_0px_white] font-black uppercase tracking-wide">
                        {callStatus === "Idle" ? "Ready to Call" : callStatus} (
                        {callStatus})
                    </div>
                </div>
            </div>

            {/* Incoming Call Notification */}
            {incomingCall && (
                <IncomingCallNotification
                    isOpen={showIncomingCallModal}
                    onAccept={handleAcceptCall}
                    onDecline={handleDeclineCall}
                    callerName={incomingCall.callerName}
                    callerId={incomingCall.callerId}
                    sessionId={incomingCall.sessionId}
                    callerRole="TUTOR"
                />
            )}
        </div>
    )
}
