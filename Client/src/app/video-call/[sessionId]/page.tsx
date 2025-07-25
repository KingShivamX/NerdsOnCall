"use client"

import { useState, useEffect, useRef } from "react"
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
    Maximize2,
    Minimize2,
} from "lucide-react"
import { Canvas } from "@/components/VideoCall/Canvas"
import { ChatPanel } from "@/components/VideoCall/ChatPanel"
import { IncomingCallNotification } from "@/components/VideoCall/IncomingCallNotification"
import toast from "react-hot-toast"
import { api } from "@/lib/api"

interface VideoCallPageProps { }

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
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [whiteboardSocket, setWhiteboardSocket] = useState<WebSocket | null>(null)

    // Incoming call states
    const [incomingCall, setIncomingCall] = useState<{
        callerId: number | string
        callerName: string
        sessionId: string
    } | null>(null)
    const [showIncomingCallModal, setShowIncomingCallModal] = useState(false)

    // Refs
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const socketRef = useRef<WebSocket | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const screenStreamRef = useRef<MediaStream | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const isConnectedRef = useRef<boolean>(false)
    const isInCallRef = useRef<boolean>(false)
    const whiteboardSocketRef = useRef<WebSocket | null>(null)

    // Get participant info from URL params
    const [otherUserName, setOtherUserName] = useState("User")
    const [otherUserId, setOtherUserId] = useState(0)
    const [userRole, setUserRole] = useState<string>("")
    const [waitingForTutor, setWaitingForTutor] = useState(false)
    const [tutorReady, setTutorReady] = useState(false)

    useEffect(() => {
        // Get participant info from URL search params
        const urlParams = new URLSearchParams(window.location.search)
        const role = urlParams.get("role")
        const waitingParam = urlParams.get("waitingForTutor")
        const notifyStudentParam = urlParams.get("notifyStudent")

        console.log("🔍 Video call page initialization:")
        console.log("- Auth user:", user?.firstName, user?.lastName, "Role:", user?.role)
        console.log("- URL role param:", role)
        console.log("- Session ID:", sessionId)

        // Extract tutor and student IDs from sessionId if it follows the pattern
        let extractedTutorId: number | null = null
        let extractedStudentId: number | null = null

        const sessionIdMatch = sessionId.match(/tutor_(\d+)_student_(\d+)_\d+/)
        if (sessionIdMatch) {
            extractedTutorId = parseInt(sessionIdMatch[1])
            extractedStudentId = parseInt(sessionIdMatch[2])
            console.log("📋 Extracted from sessionId - Tutor ID:", extractedTutorId, "Student ID:", extractedStudentId)
        }

        if (waitingParam === "true") {
            setWaitingForTutor(true)
        }
        
        if (role === "tutor" || user?.role === "TUTOR") {
            // Tutor view - get student info
            const studentIdParam = urlParams.get("studentId")
            const studentNameParam = urlParams.get("studentName")
            const doubtIdParam = urlParams.get("doubtId")

            // Use URL param if available, otherwise use extracted ID
            const studentIdToUse = studentIdParam ? parseInt(studentIdParam) : extractedStudentId
            if (studentIdToUse) {
                setOtherUserId(studentIdToUse)
                console.log("👨‍🏫 Tutor - other user (student) ID:", studentIdToUse)
            }

            if (studentNameParam) {
                setOtherUserName(decodeURIComponent(studentNameParam))
            } else {
                setOtherUserName("Student") // Default name
            }
            setUserRole("tutor")
            setTutorReady(true) // Tutor is ready when they join

            // If tutor should notify student, we'll do it after WebSocket connects
            if (notifyStudentParam === "true" && doubtIdParam) {
                // Store the doubt ID for later notification
                sessionStorage.setItem('notifyStudentDoubtId', doubtIdParam)
            }
        } else {
            // Student view - get tutor info
            const tutorIdParam = urlParams.get("tutorId")
            const tutorNameParam = urlParams.get("tutorName")

            // Use URL param if available, otherwise use extracted ID
            const tutorIdToUse = tutorIdParam ? parseInt(tutorIdParam) : extractedTutorId
            if (tutorIdToUse) {
                setOtherUserId(tutorIdToUse)
                console.log("👨‍🎓 Student - other user (tutor) ID:", tutorIdToUse)
            }

            if (tutorNameParam) {
                setOtherUserName(decodeURIComponent(tutorNameParam))
            } else {
                setOtherUserName("Tutor") // Default name
            }
            setUserRole("student")
        }

        // Initialize video call
        initializeVideoCall()

        // Initialize whiteboard socket - Use the correct endpoint for canvas updates
        const initializeWhiteboardSocket = () => {
            try {
                const serverUrl =
                    process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
                    "ws://localhost:8080"
                const wsUrl = `${serverUrl}/ws/session?userId=${user?.id}&sessionId=${sessionId}`

                console.log("🎨 Connecting to whiteboard socket:", wsUrl)
                const newSocket = new WebSocket(wsUrl)
                whiteboardSocketRef.current = newSocket

                newSocket.onopen = () => {
                    console.log("🎨 Whiteboard socket connected to /ws/session")
                    setWhiteboardSocket(newSocket) // Update state when connected

                    // Wait a moment to ensure connection is fully established
                    setTimeout(() => {
                        if (newSocket.readyState === WebSocket.OPEN && user?.id && sessionId) {
                            const subscribeMessage = {
                                type: "subscribe",
                                userId: user.id,
                                sessionId: sessionId,
                            }
                            console.log("📤 Sending subscribe message:", subscribeMessage)
                            try {
                                newSocket.send(JSON.stringify(subscribeMessage))
                                console.log("✅ Subscribe message sent successfully")
                            } catch (error) {
                                console.error("❌ Error sending subscribe message:", error)
                            }
                        } else {
                            console.warn("⚠️ WebSocket not ready for subscription")
                        }
                    }, 100) // Wait 100ms for connection to stabilize
                }

                newSocket.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data)
                        console.log("📨 Whiteboard message received:", message.type, message)

                        // Forward ALL messages to Canvas component for processing
                        window.dispatchEvent(new CustomEvent('whiteboardUpdate', {
                            detail: message
                        }))

                        // Handle video call page specific messages
                        if (message.type === "whiteboard_enabled") {
                            // Auto-enable whiteboard when other user enables it
                            if (!showWhiteboard) {
                                setShowWhiteboard(true)
                                toast.success(`${message.userName || 'Other user'} enabled the whiteboard`)
                            }
                        } else if (message.type === "subscribed") {
                            console.log("✅ Successfully subscribed to whiteboard session")
                        } else if (message.type === "connection_established") {
                            console.log("✅ Whiteboard connection established")
                        }
                    } catch (error) {
                        console.error("Error parsing whiteboard message:", error)
                    }
                }

                newSocket.onerror = (err) => {
                    console.error("❌ Whiteboard socket error:", err)
                    setWhiteboardSocket(null)
                }

                newSocket.onclose = (event) => {
                    console.log("🔌 Whiteboard socket closed:", event.code, event.reason)
                    setWhiteboardSocket(null)
                    whiteboardSocketRef.current = null

                    // Attempt to reconnect after a delay if not intentionally closed
                    if (event.code !== 1000 && user?.id && sessionId) {
                        console.log("🔄 Attempting to reconnect whiteboard socket in 3 seconds...")
                        setTimeout(() => {
                            if (!whiteboardSocketRef.current || whiteboardSocketRef.current.readyState === WebSocket.CLOSED) {
                                initializeWhiteboardSocket()
                            }
                        }, 3000)
                    }
                }
            } catch (error) {
                console.error("❌ Error initializing whiteboard socket:", error)
            }
        }

        // Initialize the whiteboard socket
        initializeWhiteboardSocket()

        return () => {
            console.log("Component unmounting, cleaning up...")
            cleanupConnection()
            // Unsubscribe from whiteboard session before closing socket
            if (
                whiteboardSocketRef.current &&
                whiteboardSocketRef.current.readyState === WebSocket.OPEN &&
                user?.id &&
                sessionId
            ) {
                whiteboardSocketRef.current.send(
                    JSON.stringify({
                        type: "unsubscribe",
                        userId: user.id,
                        sessionId: sessionId,
                    })
                )
            }
            if (
                whiteboardSocketRef.current &&
                whiteboardSocketRef.current.readyState === WebSocket.OPEN
            ) {
                whiteboardSocketRef.current.close()
            }
            whiteboardSocketRef.current = null
        }
    }, [sessionId])

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

    // Removed auto-connect - users now manually start calls

    const initializeVideoCall = async () => {
        try {
            setStatus("Setting up video call...")
            await setupLocalStream()
            await connectToSignalingServer()
        } catch (error) {
            console.error("Error initializing video call:", error)
            setStatus("Failed to initialize video call")
        }
    }

    const setupLocalStream = async () => {
        try {
            setStatus("Accessing camera and microphone...")
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })

            localStreamRef.current = stream

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            setStatus("Ready to call")
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

            socketRef.current.onopen = async () => {
                setStatus("Connected")
                isConnectedRef.current = true

                // Create session in backend - both students and tutors can now create sessions
                try {
                    console.log("🔄 Creating session:", sessionId)
                    console.log("Auth user role:", user?.role, "URL role:", userRole, "User ID:", user?.id, "Other user ID:", otherUserId)

                    let parameterToPass;
                    let parameterDescription;

                    if (user?.role === "STUDENT") {
                        // Student creating session - pass tutor ID
                        parameterToPass = otherUserId;
                        parameterDescription = "tutor ID";
                        console.log("👨‍🎓 Student creating session with tutor ID:", parameterToPass)
                    } else if (user?.role === "TUTOR") {
                        // Tutor creating session - pass student ID
                        parameterToPass = otherUserId;
                        parameterDescription = "student ID";
                        console.log("👨‍🏫 Tutor creating session with student ID:", parameterToPass)
                    } else {
                        console.warn("⚠️ Unknown user role:", user?.role)
                        return
                    }

                    if (!parameterToPass || parameterToPass === 0) {
                        console.warn("⚠️ No valid other user ID found, skipping session creation")
                        console.warn("Debug info - sessionId:", sessionId, "userRole:", user?.role, "otherUserId:", otherUserId)
                        return
                    }

                    console.log(`📤 API call: POST /api/sessions/call?tutorId=${parameterToPass}&sessionId=${sessionId}`)
                    console.log(`📝 Parameter explanation: tutorId=${parameterToPass} (${parameterDescription})`)

                    const response = await api.post(`/api/sessions/call?tutorId=${parameterToPass}&sessionId=${sessionId}`)
                    console.log("✅ Session created successfully:", response.data)
                } catch (error: any) {
                    console.error("❌ Error creating session:", error)
                    console.error("Error status:", error.response?.status)
                    console.error("Error details:", error.response?.data)
                    console.error("Full error response:", error.response)

                    // Show user-friendly error message
                    if (error.response?.status === 400) {
                        toast.error(`Session creation failed: ${error.response?.data || 'Bad request'}`)
                    } else {
                        toast.error("Failed to create session - continuing anyway")
                    }
                }

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
                                timestamp: Date.now()
                            })
                        )
                        
                        // If tutor is joining, notify the student that tutor is ready
                        if (userRole === "tutor") {
                            // Wait a bit more for the join to be processed
                            setTimeout(() => {
                                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                                    socketRef.current.send(
                                        JSON.stringify({
                                            type: "tutor_joined",
                                            to: otherUserId.toString(),
                                            from: user?.id.toString(),
                                            sessionId: sessionId,
                                            tutorName: `${user?.firstName} ${user?.lastName}`,
                                            timestamp: Date.now()
                                        })
                                    )
                                    
                                    // Check if we need to notify student that tutor is waiting for call
                                    const notifyDoubtId = sessionStorage.getItem('notifyStudentDoubtId')
                                    if (notifyDoubtId) {
                                        console.log("Sending tutor_waiting_for_call notification to student")
                                        socketRef.current.send(
                                            JSON.stringify({
                                                type: "tutor_waiting_for_call",
                                                to: otherUserId.toString(),
                                                from: user?.id.toString(),
                                                doubtId: parseInt(notifyDoubtId),
                                                sessionId: sessionId,
                                                tutorName: `${user?.firstName} ${user?.lastName}`,
                                                timestamp: Date.now()
                                            })
                                        )
                                        // Clear the flag
                                        sessionStorage.removeItem('notifyStudentDoubtId')
                                        toast.success("Student has been notified! Waiting for them to join...")
                                    }
                                }
                            }, 1000)
                        }
                    }
                }, 100)
            }

            socketRef.current.onmessage = handleWebSocketMessage
            socketRef.current.onclose = () => {
                setStatus("Disconnected")
                // Notify other user that this user is leaving
                if (isInCallRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(
                        JSON.stringify({
                            type: "user-disconnect",
                            userId: user?.id.toString(),
                            sessionId: sessionId,
                        })
                    )
                }
                cleanupConnection()
            }
            socketRef.current.onerror = (error) => {
                console.error("WebSocket error:", error)
                setStatus("Connection error")
            }
        } catch (error: any) {
            console.error("Error connecting to signaling server:", error)
            setStatus(`Error: ${error.message}`)
        }
    }

    const handleWebSocketMessage = async (event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data)
            console.log("Received message:", message.type, message)

            switch (message.type) {
                case "offer":
                    await handleOffer(message)
                    break
                case "answer":
                    await handleAnswer(message)
                    break
                case "ice-candidate":
                    await handleIceCandidate(message)
                    break
                case "user-joined":
                    console.log(`User ${message.userId} joined`)
                    break
                case "tutor_joined":
                    if (userRole === "student") {
                        console.log("Tutor has joined the session")
                        setTutorReady(true)
                        setWaitingForTutor(false)
                        toast.success(`${message.tutorName} has joined! You can now start the call.`)
                    }
                    break
                case "user-left":
                    console.log(`User ${message.userId} left`)
                    if (isInCallRef.current) {
                        endCall()
                    }
                    break
                case "user-disconnect":
                    console.log(`User ${message.userId} disconnected`)
                    if (isInCallRef.current) {
                        toast.error("Other user disconnected")

                        // End the session in the backend when other user disconnects
                        try {
                            console.log("🔚 Ending session due to user disconnect:", sessionId)
                            const response = await api.put(`/api/sessions/call/${sessionId}/end`)
                            console.log("✅ Session ended due to disconnect:", response.data)

                            if (response.data.durationMinutes && response.data.tutorEarnings) {
                                const duration = response.data.durationMinutes
                                const earnings = response.data.tutorEarnings
                                const cost = response.data.cost

                                toast.success(
                                    `Session completed! Duration: ${duration} min, ${user?.role === 'TUTOR' ? `Earnings: $${earnings}` : `Cost: $${cost}`}`,
                                    { duration: 5000 }
                                )
                            }
                        } catch (error) {
                            console.error("❌ Error ending session on disconnect:", error)
                        }

                        // Clean up the call state
                        setCallStatus("Disconnected")
                        if (peerConnectionRef.current) {
                            peerConnectionRef.current.close()
                            peerConnectionRef.current = null
                        }
                        isInCallRef.current = false

                        // Reload page after disconnect for students to clear WebSocket errors
                        if (user?.role === "STUDENT") {
                            toast.loading("Returning to browse tutors...")
                            setTimeout(() => {
                                window.location.href = "/browse-tutors"
                            }, 2000)
                        } else {
                            // For tutors, just go back and reload
                            setTimeout(() => {
                                router.back()
                                setTimeout(() => window.location.reload(), 500)
                            }, 1500)
                        }
                    }
                    break
                case "incoming_call":
                    // Handle incoming call from either party
                    if (message.to === user?.id.toString()) {
                        console.log("Received incoming call from:", message.callerName)
                        
                        // Show incoming call notification popup
                        setIncomingCall({
                            callerId: message.from,
                            callerName: message.callerName,
                            sessionId: message.sessionId
                        })
                        setShowIncomingCallModal(true)
                        
                        toast.success(`📞 Incoming call from ${message.callerName}`)
                    }
                    break
                case "call_accepted":
                    if (message.to === user?.id.toString()) {
                        console.log("Call accepted by:", message.accepterName)
                        toast.success(`${message.accepterName} accepted your call!`)
                        setCallStatus("Call accepted, connecting...")
                    }
                    break
                case "call_declined":
                    if (message.to === user?.id.toString()) {
                        console.log("Call declined by:", message.declinerName)
                        toast.error(`${message.declinerName} declined your call`)
                        setCallStatus("Call declined")
                        // Reset call state
                        if (peerConnectionRef.current) {
                            peerConnectionRef.current.close()
                            peerConnectionRef.current = null
                        }
                        isInCallRef.current = false
                    }
                    break
                case "error":
                    console.error("WebSocket error:", message.message)
                    if (message.message && message.message.includes("Recipient offline")) {
                        toast.error("Other user is not connected yet. Please wait...")
                    } else if (message.message && message.message.includes("Unknown message type")) {
                        console.warn("Server doesn't recognize this message type:", message)
                    } else {
                        toast.error(`Connection error: ${message.message || 'Unknown error'}`)
                    }
                    break
                case "canvas_update":
                case "subscribe":
                case "unsubscribe":
                    // These are handled by the Canvas component, ignore here
                    break
                default:
                    // Log unknown message types but don't show error to user
                    console.warn("Unknown WebSocket message type:", message.type, message)
                    break
            }
        } catch (error: any) {
            console.error("Error parsing WebSocket message:", error)
            toast.error("Failed to process incoming message")
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
            console.log("Received remote track", event.streams[0])
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0]
                console.log(
                    "Set remoteVideoRef.current.srcObject",
                    remoteVideoRef.current.srcObject
                )
            }
            setCallStatus("Connected")
        }

        peerConnectionRef.current.onconnectionstatechange = () => {
            if (peerConnectionRef.current) {
                console.log(
                    "Connection state:",
                    peerConnectionRef.current.connectionState
                )

                // Only end call on failed state after multiple attempts
                if (peerConnectionRef.current.connectionState === "failed") {
                    console.log(
                        "Connection failed, but not ending call automatically"
                    )
                    // Don't auto-end call, let user decide
                    toast.error(
                        "Connection issues detected. You may need to refresh if problems persist."
                    )
                }

                // Update call status based on connection state
                if (peerConnectionRef.current.connectionState === "connected") {
                    setCallStatus("Connected")
                } else if (
                    peerConnectionRef.current.connectionState === "connecting"
                ) {
                    setCallStatus("Connecting...")
                } else if (
                    peerConnectionRef.current.connectionState === "disconnected"
                ) {
                    setCallStatus("Reconnecting...")
                }
            }
        }
    }

    const startCall = async () => {
        if (!isConnectedRef.current) return

        try {
            setCallStatus("Calling...")

            // Start the session in the backend to track start time
            try {
                console.log("🚀 Starting session in backend:", sessionId)
                const response = await api.put(`/api/sessions/call/${sessionId}/start`)
                console.log("✅ Session started successfully:", response.data)
                toast.success("Session started - timer is now running!")
            } catch (error: any) {
                console.error("❌ Error starting session:", error)
                console.error("Error status:", error.response?.status)
                console.error("Error details:", error.response?.data)
                console.error("Full error response:", error.response)

                // If session doesn't exist, try to create it first
                if (error.response?.status === 400) {
                    try {
                        console.log("🔄 Session not found, creating it first...")

                        let parameterToPass;
                        if (user?.role === "STUDENT") {
                            parameterToPass = otherUserId; // Student passes tutor ID
                            console.log("👨‍🎓 Student creating session with tutor ID:", parameterToPass)
                        } else if (user?.role === "TUTOR") {
                            parameterToPass = otherUserId; // Tutor passes student ID
                            console.log("👨‍🏫 Tutor creating session with student ID:", parameterToPass)
                        } else {
                            throw new Error("Unknown user role: " + user?.role)
                        }

                        console.log("Creating session with parameter:", parameterToPass, "sessionId:", sessionId)

                        const createResponse = await api.post(`/api/sessions/call?tutorId=${parameterToPass}&sessionId=${sessionId}`)
                        console.log("✅ Session created:", createResponse.data)

                        // Now try to start it again
                        const retryResponse = await api.put(`/api/sessions/call/${sessionId}/start`)
                        console.log("✅ Session created and started successfully:", retryResponse.data)
                        toast.success("Session started - timer is now running!")
                    } catch (retryError: any) {
                        console.error("❌ Failed to create and start session:", retryError)
                        console.error("Retry error details:", retryError.response?.data)
                        toast.error(`Session tracking failed: ${retryError.response?.data || retryError.message}`)
                    }
                } else {
                    toast.error(`Session tracking failed: ${error.response?.data || error.message}`)
                }
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

            // Send incoming call notification to other user with retry mechanism
            if (socketRef.current) {
                console.log("Sending call to user:", otherUserId)
                
                let attempts = 0
                const maxAttempts = 3
                
                const sendCallMessage = () => {
                    if (!socketRef.current || attempts >= maxAttempts) return
                    
                    attempts++
                    console.log(`Sending call attempt ${attempts}/${maxAttempts} to user:`, otherUserId)
                    
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

                // Send initial call
                sendCallMessage()
                
                // Set up retry logic for recipient offline errors
                const handleCallResponse = (event: MessageEvent) => {
                    try {
                        const response = JSON.parse(event.data)
                        if (response.type === "error" && response.message && response.message.includes("Recipient offline")) {
                            if (attempts < maxAttempts) {
                                toast(`Other user not ready, retrying... (${attempts}/${maxAttempts})`)
                                setTimeout(sendCallMessage, 2000)
                            } else {
                                toast.error("Other user is not available. Please try again later.")
                                socketRef.current?.removeEventListener("message", handleCallResponse)
                                setCallStatus("Failed to connect")
                            }
                        } else if (response.type === "call_accepted" || response.type === "call_declined") {
                            // Call was responded to, stop retrying
                            socketRef.current?.removeEventListener("message", handleCallResponse)
                        }
                    } catch (e) {
                        // Ignore parsing errors for this handler
                    }
                }
                
                socketRef.current.addEventListener("message", handleCallResponse)
                
                // Clean up event listener after 30 seconds
                setTimeout(() => {
                    socketRef.current?.removeEventListener("message", handleCallResponse)
                }, 30000)
                
                toast.success(`Calling ${otherUserName}...`)
            }

            if (peerConnectionRef.current) {
                const offer = await peerConnectionRef.current.createOffer()
                await peerConnectionRef.current.setLocalDescription(offer)

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
            }

            isInCallRef.current = true
        } catch (error: any) {
            console.error("Error starting call:", error)
            setCallStatus(`Error: ${error.message}`)
        }
    }

    const endCall = async () => {
        // Send disconnect message to other user before ending call
        if (isInCallRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify({
                    type: "user-disconnect",
                    userId: user?.id.toString(),
                    sessionId: sessionId,
                })
            )
        }

        if (isInCallRef.current) {
            setCallStatus("Idle")

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
                peerConnectionRef.current = null
            }

            if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                const stream = remoteVideoRef.current.srcObject as MediaStream
                stream.getTracks().forEach((track) => track.stop())
                remoteVideoRef.current.srcObject = null
            }

            isInCallRef.current = false

            // End the session in the backend to calculate duration and earnings
            try {
                console.log("🔚 Ending session in backend:", sessionId)
                const response = await api.put(`/api/sessions/call/${sessionId}/end`)
                console.log("✅ Session ended successfully:", response.data)

                if (response.data.durationMinutes && response.data.tutorEarnings) {
                    const duration = response.data.durationMinutes
                    const earnings = response.data.tutorEarnings
                    const cost = response.data.cost

                    toast.success(
                        `Session completed! Duration: ${duration} min, ${user?.role === 'TUTOR' ? `Earnings: $${earnings}` : `Cost: $${cost}`}`,
                        { duration: 5000 }
                    )
                } else {
                    toast.success("Session ended successfully!")
                }
            } catch (error) {
                console.error("❌ Error ending session:", error)
                toast.error("Session ended but failed to save duration. Please contact support.")
            }
        }

        // Show end call message and reload page for students to clear WebSocket errors
        if (user?.role === "STUDENT") {
            toast.success("Call ended. Returning to browse tutors...")
            setTimeout(() => {
                window.location.href = "/browse-tutors"
            }, 1500)
        } else {
            // For tutors, navigate back to previous page
        router.back()

        // Refresh page for tutors after call ends
            setTimeout(() => {
                window.location.reload()
            }, 500)
        }
    }

    const cleanupConnection = () => {
        if (isInCallRef.current) {
            endCall()
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop())
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = null
            }
            localStreamRef.current = null
        }

        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((track) => track.stop())
            screenStreamRef.current = null
        }

        if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
        ) {
            socketRef.current.close()
        }

        socketRef.current = null
        isConnectedRef.current = false
        setIsScreenSharing(false)
    }

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsAudioEnabled(audioTrack.enabled)
            }
        }
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsVideoEnabled(videoTrack.enabled)
            }
        }
    }

    const toggleScreenShare = async () => {
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
            console.error("Screen sharing error:", error)
        }
    }

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
            toast("Screen sharing stopped", { icon: "ℹ️" })
        } catch (error: any) {
            console.error("Error stopping screen share:", error)
            toast.error("Error stopping screen share")
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

            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(
                    new RTCSessionDescription(message.data)
                )

                const answer = await peerConnectionRef.current.createAnswer()
                await peerConnectionRef.current.setLocalDescription(answer)

                if (socketRef.current) {
                    socketRef.current.send(
                        JSON.stringify({
                            type: "answer",
                            to: message.from,
                            from: user?.id.toString(),
                            sessionId: message.sessionId,
                            data: answer,
                        })
                    )
                }
            }

            isInCallRef.current = true
            setCallStatus("Connected")
        } catch (error: any) {
            console.error("Error handling offer:", error)
            setCallStatus(`Error: ${error.message}`)
        }
    }

    const handleAnswer = async (message: any) => {
        try {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(
                    new RTCSessionDescription(message.data)
                )
            }
            setCallStatus("Connected")
        } catch (error: any) {
            console.error("Error handling answer:", error)
            setCallStatus(`Error: ${error.message}`)
        }
    }

    const handleIceCandidate = async (message: any) => {
        try {
            if (message.data && peerConnectionRef.current) {
                await peerConnectionRef.current.addIceCandidate(
                    new RTCIceCandidate(message.data)
                )
            }
        } catch (error: any) {
            console.error("Error handling ICE candidate:", error)
        }
    }

    const handleIncomingCall = async (message: any) => {
        try {
            console.log("Handling incoming call from:", message.callerName)
            // Since both parties are already in the video call interface, auto-accept
            setCallStatus("Incoming call...")
            
            // Create peer connection if not exists
            if (!peerConnectionRef.current) {
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
            }
            
            isInCallRef.current = true
            setCallStatus("Connected")
            toast.success(`Call connected with ${message.callerName}`)
        } catch (error: any) {
            console.error("Error handling incoming call:", error)
            setCallStatus(`Error: ${error.message}`)
        }
    }

    const handleAcceptCall = async () => {
        if (!incomingCall) return
        
        try {
            console.log("Accepting call from:", incomingCall.callerName)
            setShowIncomingCallModal(false)
            
            // Send acceptance message back to caller
            if (socketRef.current) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "call_accepted",
                        to: incomingCall.callerId.toString(),
                        from: user?.id.toString(),
                        sessionId: incomingCall.sessionId,
                        accepterName: `${user?.firstName} ${user?.lastName}`
                    })
                )
            }
            
            // Set up the call
            await handleIncomingCall({
                callerName: incomingCall.callerName,
                from: incomingCall.callerId
            })
            
            setIncomingCall(null)
        } catch (error: any) {
            console.error("Error accepting call:", error)
            toast.error("Failed to accept call")
        }
    }

    const handleDeclineCall = () => {
        if (!incomingCall) return
        
        console.log("Declining call from:", incomingCall.callerName)
        setShowIncomingCallModal(false)
        
        // Send decline message back to caller
        if (socketRef.current) {
            socketRef.current.send(
                JSON.stringify({
                    type: "call_declined",
                    to: incomingCall.callerId.toString(),
                    from: user?.id.toString(),
                    sessionId: incomingCall.sessionId,
                    declinerName: `${user?.firstName} ${user?.lastName}`
                })
            )
        }
        
        toast.error(`Call declined from ${incomingCall.callerName}`)
        setIncomingCall(null)
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white">
                    Please log in to join the video call.
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 relative overflow-hidden">
            {/* Main Video Area */}
            <div className="flex h-screen">
                {/* Left Side - Main Video */}
                <div className="flex-1 relative">
                    {/* Remote Video (Tutor) - Full size when not using whiteboard */}
                    {!showWhiteboard && (
                        <div className="w-full h-full relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-contain rounded-2xl bg-black"
                                style={{ aspectRatio: "16/9" }}
                            />
                            {callStatus !== "Connected" && (
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-2xl">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <span className="text-3xl font-semibold text-white">
                                                {otherUserName.charAt(0)}
                                            </span>
                                        </div>
                                        <p className="text-lg text-gray-700 font-medium">
                                            {callStatus === "Idle"
                                                ? "Waiting to connect..."
                                                : callStatus}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded backdrop-blur-sm">
                                {otherUserName}
                            </div>
                        </div>
                    )}

                    {/* Whiteboard */}
                    {showWhiteboard && (
                        <div className="w-full h-full bg-white relative">
                            <Canvas
                                sessionId={sessionId}
                                user={user}
                                socket={whiteboardSocket}
                                onCanvasUpdate={(data) => {
                                    // Handle canvas updates safely
                                    try {
                                        console.log(
                                            "Canvas updated successfully"
                                        )
                                    } catch (error) {
                                        console.error(
                                            "Canvas update error:",
                                            error
                                        )
                                    }
                                }}
                            />

                            {/* Remote Video - Small overlay when whiteboard is active */}
                            <div className="absolute top-4 left-4 w-64 h-48 bg-white rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 z-10">
                                <video
                                    ref={remoteVideoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-contain bg-black"
                                    style={{ aspectRatio: "16/9" }}
                                />
                                {remoteVideoRef.current &&
                                    !remoteVideoRef.current.srcObject && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
                                            <svg
                                                className="animate-spin h-8 w-8 text-gray-400 mb-2"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8z"
                                                ></path>
                                            </svg>
                                            <span className="text-gray-600">
                                                Waiting for tutor video...
                                            </span>
                                        </div>
                                    )}
                                {callStatus !== "Connected" && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center rounded-xl">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                                                <span className="text-lg font-semibold text-white">
                                                    {otherUserName.charAt(0)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 font-medium">
                                                {callStatus === "Idle"
                                                    ? "Waiting..."
                                                    : callStatus}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                    {otherUserName}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Local Video (Student) - Small overlay */}
                    <div
                        className={`absolute w-64 h-48 bg-white rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 z-20 ${showWhiteboard ? "top-4 right-4" : "top-6 right-6"
                            }`}
                    >
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-contain bg-black"
                            style={{ aspectRatio: "16/9" }}
                        />
                        {!isVideoEnabled && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-center text-gray-600">
                                    <VideoOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm opacity-75">
                                        Video is off
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                            You {!isAudioEnabled && "(Muted)"}
                        </div>
                    </div>
                </div>

                {/* Right Side - Chat Panel */}
                {showChat && (
                    <ChatPanel
                        sessionId={sessionId}
                        isOpen={showChat}
                        onClose={() => setShowChat(false)}
                        socket={socketRef.current}
                    />
                )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-2xl">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                    {/* Left Controls */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Audio Toggle */}
                        <Button
                            variant={
                                isAudioEnabled ? "secondary" : "destructive"
                            }
                            size="lg"
                            onClick={toggleAudio}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${isAudioEnabled
                                ? "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                                : "bg-red-500 hover:bg-red-600 text-white shadow-red-300 animate-pulse"
                                }`}
                        >
                            {isAudioEnabled ? (
                                <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                                <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />
                            )}
                        </Button>

                        {/* Video Toggle */}
                        <Button
                            variant={
                                isVideoEnabled ? "secondary" : "destructive"
                            }
                            size="lg"
                            onClick={toggleVideo}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${isVideoEnabled
                                ? "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                                : "bg-red-500 hover:bg-red-600 text-white shadow-red-300 animate-pulse"
                                }`}
                        >
                            {isVideoEnabled ? (
                                <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                                <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />
                            )}
                        </Button>

                        {/* Screen Share Toggle */}
                        <Button
                            variant={isScreenSharing ? "default" : "secondary"}
                            size="lg"
                            onClick={toggleScreenShare}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${isScreenSharing
                                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-300 animate-pulse"
                                : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                                }`}
                        >
                            {isScreenSharing ? (
                                <MonitorOff className="h-5 w-5 sm:h-6 sm:w-6" />
                            ) : (
                                <Monitor className="h-5 w-5 sm:h-6 sm:w-6" />
                            )}
                        </Button>

                        {/* Whiteboard Toggle */}
                        <Button
                            variant={showWhiteboard ? "default" : "secondary"}
                            size="lg"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()

                                try {
                                    const newState = !showWhiteboard
                                    setShowWhiteboard(newState)

                                    // Notify other users when whiteboard is enabled
                                    if (newState && whiteboardSocket &&
                                        whiteboardSocket.readyState === WebSocket.OPEN) {
                                        try {
                                            whiteboardSocket.send(
                                                JSON.stringify({
                                                    type: "whiteboard_enabled",
                                                    sessionId: sessionId,
                                                    userId: user?.id,
                                                    userName: `${user?.firstName} ${user?.lastName}`,
                                                    enabled: true
                                                })
                                            )
                                            toast.success(
                                                "🎨 Whiteboard opened - Draw and collaborate!"
                                            )
                                            console.log("🎨 Whiteboard enabled, notified other users")
                                        } catch (error) {
                                            console.error("❌ Error notifying whiteboard enabled:", error)
                                            toast.success("🎨 Whiteboard opened")
                                        }
                                    } else if (!newState) {
                                        // Optionally notify when disabled
                                        if (whiteboardSocket &&
                                            whiteboardSocket.readyState === WebSocket.OPEN) {
                                            try {
                                                whiteboardSocket.send(
                                                    JSON.stringify({
                                                        type: "whiteboard_disabled",
                                                        sessionId: sessionId,
                                                        userId: user?.id,
                                                        userName: `${user?.firstName} ${user?.lastName}`,
                                                        enabled: false
                                                    })
                                                )
                                            } catch (error) {
                                                console.error("❌ Error notifying whiteboard disabled:", error)
                                            }
                                        }
                                        toast("Whiteboard closed")
                                        console.log("🎨 Whiteboard disabled")
                                    } else if (newState && !whiteboardSocket) {
                                        toast.success("🎨 Whiteboard opened (connecting...)")
                                        console.log("🎨 Whiteboard enabled but socket not ready")
                                    }
                                } catch (error) {
                                    console.error(
                                        "Error toggling whiteboard:",
                                        error
                                    )
                                    toast.error("Failed to toggle whiteboard")
                                }
                            }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${showWhiteboard
                                ? "bg-green-500 hover:bg-green-600 text-white shadow-green-300 animate-pulse"
                                : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-green-400"
                                }`}
                        >
                            <PenTool className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                    </div>

                    {/* Center - Call Controls */}
                    <div className="flex flex-col items-center justify-center flex-1">
                        {/* Status Messages */}
                        {waitingForTutor && userRole === "student" && !tutorReady && (
                                <div className="mb-4 text-blue-700 bg-blue-100 border border-blue-300 rounded px-4 py-2 text-center animate-pulse">
                                🎓 Waiting for {otherUserName} to join...
                                    <br />
                                Your tutor will start the call when ready.
                                </div>
                            )}
                        {userRole === "tutor" && callStatus === "Idle" && (
                            <div className="mb-4 text-green-700 bg-green-100 border border-green-300 rounded px-4 py-2 text-center">
                                👨‍🏫 Waiting for {otherUserName} to join
                                <br />
                                Student will see "Join Now" button when you're ready.
                            </div>
                        )}
                        
                        {callStatus === "Idle" ? (
                            <Button
                                onClick={startCall}
                                disabled={
                                    !isConnectedRef.current ||
                                    (status !== "Ready to call" && status !== "Connected") ||
                                    (userRole === "student" && waitingForTutor && !tutorReady)
                                }
                                className={`px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${
                                    userRole === "student" && waitingForTutor && !tutorReady
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white animate-pulse"
                                }`}
                                size="lg"
                            >
                                <Phone className="h-6 w-6 mr-3" />
                                {userRole === "student" && waitingForTutor && !tutorReady
                                    ? "⏳ Waiting for tutor..."
                                    : !isConnectedRef.current
                                    ? "⏳ Connecting..."
                                    : status === "Ready to call" || status === "Connected"
                                        ? "🚀 Start Call"
                                        : "⏳ Connecting..."}
                            </Button>
                        ) : (
                            <Button
                                onClick={endCall}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 animate-pulse"
                                size="lg"
                            >
                                <PhoneOff className="h-6 w-6 mr-3" />
                                📞 End Call
                            </Button>
                        )}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-3">
                        {/* Chat Toggle */}
                        <Button
                            variant={showChat ? "default" : "secondary"}
                            size="lg"
                            onClick={() => {
                                setShowChat(!showChat)
                                if (!showChat) {
                                    toast("💬 Chat opened")
                                } else {
                                    toast("💬 Chat closed")
                                }
                            }}
                            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${showChat
                                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-300 animate-pulse"
                                : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                                }`}
                        >
                            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="px-6 pb-3">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <div
                                className={`w-2 h-2 rounded-full ${callStatus === "Connected"
                                    ? "bg-green-500 animate-pulse"
                                    : callStatus === "Calling..."
                                        ? "bg-yellow-500 animate-pulse"
                                        : "bg-gray-400"
                                    }`}
                            />
                            <span className="font-medium">{callStatus}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span>{status}</span>
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
                    callerRole={userRole === "student" ? "TUTOR" : "STUDENT"}
                />
            )}
        </div>
    )
}
