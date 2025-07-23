"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useAuth } from "./AuthContext"
import { WebRTCManager } from "@/lib/webrtc"
import { WebSocketService, SignalingMessage } from "@/lib/websocket"

// (window as any).iceIntervalId = (window as any).iceIntervalId || null;

export interface CallState {
    isInCall: boolean
    isIncomingCall: boolean
    isOutgoingCall: boolean
    callerId?: number
    callerName?: string
    calleeId?: number
    calleeName?: string
    sessionId?: string
    localStream?: MediaStream
    remoteStream?: MediaStream
    connectionState?: RTCPeerConnectionState
    isScreenSharing: boolean
    isMuted: boolean
    isVideoOff: boolean
}

interface VideoCallContextType {
    callState: CallState
    webrtc: WebRTCManager | null
    websocket: WebSocketService | null
    initiateCall: (tutorId: number, tutorName: string) => Promise<void>
    acceptCall: () => Promise<void>
    rejectCall: () => void
    endCall: () => void
    toggleMute: () => void
    toggleVideo: () => void
    startScreenShare: () => Promise<void>
    stopScreenShare: () => Promise<void>
    sendChatMessage: (message: string) => void
    chatMessages: ChatMessage[]
    resetCallState: () => void
    // Expose setCallState for direct call state updates
    setCallState: React.Dispatch<React.SetStateAction<CallState>>
}

export interface ChatMessage {
    id: string
    from: number
    message: string
    timestamp: number
    isOwn: boolean
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined)

export const useVideoCall = () => {
    const context = useContext(VideoCallContext)
    if (context === undefined) {
        throw new Error("useVideoCall must be used within a VideoCallProvider")
    }
    return context
}

interface VideoCallProviderProps {
    children: ReactNode
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({ children }) => {
    const { user } = useAuth()
    const [webrtc, setWebrtc] = useState<WebRTCManager | null>(null)
    const [websocket, setWebsocket] = useState<WebSocketService | null>(null)
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

    // Add a ref to track if we're in the process of ending a call
    const isEndingCallRef = React.useRef<boolean>(false)

    // Add a ref to track processed call-end messages to prevent duplicates
    const processedCallEndMessagesRef = React.useRef<Set<string>>(new Set())

    const [callState, setCallState] = useState<CallState>({
        isInCall: false,
        isIncomingCall: false,
        isOutgoingCall: false,
        isScreenSharing: false,
        isMuted: false,
        isVideoOff: false
    })

    // Call requests are handled by the WebSocket service directly

    // Initialize WebSocket when user is available
    useEffect(() => {
        console.log('VideoCallContext useEffect - user:', user, 'websocket:', websocket)
        console.log('VideoCallContext useEffect - user.id:', user?.id)

        if (user && !websocket && user.id) {
            console.log('Initializing WebSocket with user ID:', user.id, 'user role:', user.role)
            const ws = new WebSocketService(user.id)

            // Set up ALL WebSocket event handlers BEFORE connection
            console.log('🔧 Setting up ALL WebSocket event handlers BEFORE connection...')

            console.log('🔧 Registering onCallRequest handler...')
            const callRequestHandler = (message: SignalingMessage) => {
                console.log('🔔 INCOMING CALL REQUEST RECEIVED!')
                console.log('📞 From:', message.from, 'Name:', message.data?.callerName)
                console.log('📞 To:', message.to, 'Session:', message.sessionId)
                console.log('📞 Current user ID:', user?.id)
                console.log('📞 Message data:', message.data)
                console.log('📞 Full message:', message)

                // No alert needed - VideoCallModal will handle the UI

                // Update state with a timeout to ensure it's processed
                setTimeout(() => {
                    // Simple state update
                    setCallState(prevState => ({
                        ...prevState,
                        isInCall: false,
                        isIncomingCall: true,
                        isOutgoingCall: false,
                        callerId: message.from,
                        callerName: message.data?.callerName || `User ${message.from}`,
                        calleeId: undefined,
                        calleeName: undefined,
                        sessionId: message.sessionId,
                        localStream: undefined,
                        remoteStream: undefined,
                        connectionState: undefined,
                        isScreenSharing: false,
                        isMuted: false,
                        isVideoOff: false
                    }))

                    console.log('✅ Call state updated for incoming call')
                    console.log('✅ New call state:', {
                        isIncomingCall: true,
                        callerId: message.from,
                        callerName: message.data?.callerName || `User ${message.from}`,
                        sessionId: message.sessionId
                    })
                }, 100)
            }

            console.log('🔧 Call request handler created:', callRequestHandler.toString().substring(0, 100) + '...')
            ws.onCallRequest(callRequestHandler)

            ws.onCallAccept(async (message: SignalingMessage) => {
                console.log('🎯 CALL ACCEPTED BY TUTOR! Student (caller) creating offer...')

                // Student is the caller, so they create the offer after tutor accepts
                // Store the message for later processing
                handleCallAcceptedMessage(message, ws)
            })

            ws.onCallReject((message: SignalingMessage) => {
                console.log('Call rejected:', message)
                setCallState(prev => ({
                    ...prev,
                    isOutgoingCall: false,
                    calleeId: undefined,
                    calleeName: undefined,
                    sessionId: undefined
                }))
            })

            ws.onCallEnd((message: SignalingMessage) => {
                console.log('🔚 Call ended message received:', message);

                // IMMEDIATELY reset call state regardless of anything else
                // This ensures the call UI disappears immediately

                // Clean up WebRTC connection
                if (webrtc) {
                    console.log('🔚 Cleaning up WebRTC connection');
                    webrtc.cleanup();
                    setWebrtc(null);
                }

                // Reset call state completely - FORCE IMMEDIATE UPDATE
                setCallState({
                    isInCall: false,
                    isIncomingCall: false,
                    isOutgoingCall: false,
                    callerId: undefined,
                    callerName: undefined,
                    calleeId: undefined,
                    calleeName: undefined,
                    sessionId: undefined,
                    localStream: undefined,
                    remoteStream: undefined,
                    connectionState: undefined,
                    isScreenSharing: false,
                    isMuted: false,
                    isVideoOff: false
                });

                // Clear chat messages
                setChatMessages([]);

                // Clear any global variables
                (window as any).incomingCallMessage = null;
                (window as any).hasIncomingCall = false;
                (window as any).lastIncomingCallTime = null;

                console.log('✅ Call state reset successfully after call-end message');
            })

            ws.onOffer((message: SignalingMessage) => {
                console.log('Received offer:', message)
                handleOffer(message)
            })

            ws.onAnswer((message: SignalingMessage) => {
                console.log('Received answer:', message)
                handleAnswer(message)
            })

            ws.onIceCandidate((message: SignalingMessage) => {
                console.log('🧊 RECEIVED ICE candidate from peer:', message.from)
                console.log('🧊 ICE candidate data:', message.data)

                // Handle ICE candidate immediately with current webrtc instance
                handleIceCandidate(message)
            })

            ws.onChatMessage((message: SignalingMessage) => {
                console.log('Received chat message:', message)
                handleChatMessage(message)
            })

            // Set the WebSocket instance in state FIRST
            setWebsocket(ws)
            console.log('✅ WebSocket instance set in state with handlers configured')

            // NOW start the WebSocket connection AFTER all handlers are registered
            console.log('🚀 All handlers registered, starting WebSocket connection...')
            console.log('📋 Final handler check before connection:', Array.from(ws['messageHandlers'].keys()))

            // Start connection immediately after handlers are registered
            console.log('🔌 Actually starting connection now...')
            ws.startConnection()

            return () => {
                console.log('🔌 Cleaning up WebSocket connection')
                ws.disconnect(true) // Clear handlers on component unmount
            }
        }
    }, [user?.id]) // Only depend on user.id, not websocket instance

    // Create a ref to store the latest ICE candidate sender
    const iceCandidateSenderRef = React.useRef<((candidate: RTCIceCandidateInit) => void) | null>(null)

    // Update the ICE candidate sender whenever websocket or callState changes
    React.useEffect(() => {
        iceCandidateSenderRef.current = (candidate: RTCIceCandidateInit) => {
            console.log('🧊 Attempting to send ICE candidate...')
            console.log('🧊 Candidate details:', candidate)

            // Store the candidate for later sending
            pendingOutgoingIceCandidatesRef.current.push(candidate)
            console.log('🧊 Added to pending candidates queue. Total:', pendingOutgoingIceCandidatesRef.current.length)

            // Try to send immediately
            const currentWebsocket = websocket
            if (currentWebsocket && currentWebsocket.isConnected()) {
                // Get the latest call state values
                const targetId = callState.callerId || callState.calleeId
                const sessionId = callState.sessionId

                console.log('🧊 Current call state for sending ICE candidate:', {
                    callerId: callState.callerId,
                    calleeId: callState.calleeId,
                    sessionId: callState.sessionId,
                    isInCall: callState.isInCall
                })

                if (targetId && sessionId) {
                    console.log('🧊 Sending ICE candidate to:', targetId, 'session:', sessionId)
                    try {
                        currentWebsocket.sendIceCandidate(targetId, candidate, sessionId)
                        console.log('🧊 ICE candidate sent successfully')

                        // Remove from pending queue if sent successfully
                        pendingOutgoingIceCandidatesRef.current =
                            pendingOutgoingIceCandidatesRef.current.filter(c => c !== candidate)
                    } catch (error) {
                        console.error('🧊 Error sending ICE candidate:', error)
                    }
                } else {
                    console.log('🧊 Not ready to send ICE candidate:', {
                        targetId: !!targetId,
                        sessionId: !!sessionId,
                        inCall: callState.isInCall,
                        websocketConnected: currentWebsocket.isConnected()
                    })

                    // Try to send all pending candidates
                    setTimeout(trySendPendingIceCandidates, 500)
                }
            } else {
                console.log('🧊 WebSocket not ready for ICE candidate:', {
                    websocketExists: !!currentWebsocket,
                    websocketConnected: currentWebsocket?.isConnected()
                })
            }
        }

        // Try to send any pending candidates whenever call state changes
        if (pendingOutgoingIceCandidatesRef.current.length > 0) {
            console.log('🧊 Call state changed, trying to send pending ICE candidates...')
            setTimeout(trySendPendingIceCandidates, 100)
        }
    }, [websocket, callState.callerId, callState.calleeId, callState.sessionId, callState.isInCall])

    // Store pending ICE candidates until we can send them
    const pendingOutgoingIceCandidatesRef = React.useRef<RTCIceCandidateInit[]>([])

    // Global ICE candidate sender function
    const sendIceCandidateToRemote = (candidate: RTCIceCandidateInit) => {
        if (iceCandidateSenderRef.current) {
            // Try to send immediately
            iceCandidateSenderRef.current(candidate)

            // Also store for later sending if needed
            pendingOutgoingIceCandidatesRef.current.push(candidate)
            console.log('🧊 Stored ICE candidate for later sending if needed. Total:',
                pendingOutgoingIceCandidatesRef.current.length)

            // Try to send all pending candidates
            trySendPendingIceCandidates()
        }
    }

    // Try to send all pending outgoing ICE candidates
    const trySendPendingIceCandidates = () => {
        if (!websocket || !websocket.isConnected()) {
            console.log('🧊 WebSocket not ready for sending pending ICE candidates')
            return
        }

        // Get current call state values directly from state
        let targetId: number | undefined;
        let sessionId: string | undefined;

        // Use a state getter to ensure we have the latest values
        setCallState(current => {
            targetId = current.callerId || current.calleeId;
            sessionId = current.sessionId;

            // Log the current call state for debugging
            console.log('🧊 Current call state for ICE candidates:', {
                isInCall: current.isInCall,
                callerId: current.callerId,
                calleeId: current.calleeId,
                sessionId: current.sessionId
            });

            return current; // Don't modify state
        });

        // Force a check for any pending candidates every 2 seconds
        // This helps ensure ICE candidates are sent even if state updates are delayed
        // if (!window.iceIntervalId) {
        //     window.iceIntervalId = setInterval(() => {
        //         if (pendingOutgoingIceCandidatesRef.current.length > 0) {
        //             console.log('🧊 Periodic check for pending ICE candidates...');
        //             trySendPendingIceCandidates();
        //         }
        //     }, 2000);

        //     // Clear interval when component unmounts
        //     window.addEventListener('beforeunload', () => {
        //         if (window.iceIntervalId) {
        //             clearInterval(window.iceIntervalId);
        //         }
        //     });
        // }

        if (targetId && sessionId) {
            console.log('🧊 Attempting to send all pending ICE candidates to:', targetId);

            const candidates = [...pendingOutgoingIceCandidatesRef.current];
            pendingOutgoingIceCandidatesRef.current = [];

            candidates.forEach(candidate => {
                try {
                    if (websocket) {
                        websocket.sendIceCandidate(targetId!, candidate, sessionId!);
                        console.log('🧊 Pending ICE candidate sent successfully');
                    } else {
                        // Put back in the queue if websocket is null
                        pendingOutgoingIceCandidatesRef.current.push(candidate);
                        console.error('🧊 WebSocket is null, cannot send ICE candidate');
                    }
                } catch (error) {
                    console.error('🧊 Error sending pending ICE candidate:', error);
                    // Put back in the queue
                    pendingOutgoingIceCandidatesRef.current.push(candidate);
                }
            });

            console.log('🧊 Processed all pending ICE candidates. Remaining:',
                pendingOutgoingIceCandidatesRef.current.length);
        } else {
            console.log('🧊 Cannot send ICE candidates - missing targetId or sessionId');
        }
    }

    // Handle call accepted message
    const handleCallAcceptedMessage = (message: SignalingMessage, ws: WebSocketService) => {
        console.log('🎯 Processing call accepted message...')
        console.log('🎯 Message details:', message)

        // Create a more robust offer creation process
        const createAndSendOffer = async () => {
            try {
                // Get current WebRTC instance or create a new one
                let rtc = webrtc
                if (!rtc) {
                    console.log('🎯 Initializing WebRTC for offer creation...')
                    rtc = await initializeWebRTC()
                    if (!rtc) {
                        console.error('🎯 Failed to initialize WebRTC')
                        return
                    }
                }

                // Ensure we have media
                if (!rtc.getLocalStream()) {
                    console.log('🎯 Getting user media before creating offer...')
                    await rtc.getUserMedia()
                }

                // Create and send offer
                console.log('🎯 Student (caller) creating offer...')
                const offer = await rtc.createOffer()
                console.log('🎯 Offer created:', offer.type)

                // Send offer to tutor
                console.log('🎯 Sending offer to tutor:', message.from)
                ws.sendOffer(message.from, offer, message.sessionId!)
                console.log('🎯 Offer sent successfully')

                // Update connection state for UI feedback
                setCallState(prev => ({
                    ...prev,
                    connectionState: 'connecting'
                }))
            } catch (error) {
                console.error('🎯 Error in createAndSendOffer:', error)
            }
        }

        // Start the offer creation process with a small delay to ensure state is settled
        setTimeout(createAndSendOffer, 500)
    }

    // Initialize WebRTC
    const initializeWebRTC = async () => {
        if (!webrtc) {
            console.log('🎯 Creating new WebRTC instance...')
            const rtc = new WebRTCManager()

            // Set up WebRTC event handlers BEFORE setting state
            rtc.onRemoteStream((stream: MediaStream) => {
                console.log('🎥 Remote stream received')
                setCallState(prev => ({
                    ...prev,
                    remoteStream: stream
                }))
            })

            rtc.onConnectionStateChange((state: RTCPeerConnectionState) => {
                console.log('🔗 Connection state changed:', state)
                setCallState(prev => ({
                    ...prev,
                    connectionState: state
                }))

                if (state === 'connected') {
                    console.log('🎉 WebRTC connection established!')
                } else if (state === 'failed' || state === 'disconnected') {
                    console.error('🔗 WebRTC connection failed or disconnected:', state)
                }
            })

            rtc.onDataChannelMessage((message: string) => {
                console.log('💬 Data channel message:', message)
                // Handle chat messages through data channel
            })

            // Set up ICE candidate handling - use the global function
            rtc.onIceCandidate((candidate: RTCIceCandidateInit) => {
                console.log('🧊 New ICE candidate generated:', candidate)
                sendIceCandidateToRemote(candidate)
            })

            // Set state and return the instance
            setWebrtc(rtc)
            console.log('🎯 WebRTC instance created and configured')

            // Process any pending ICE candidates
            await processPendingIceCandidates(rtc)

            return rtc
        }
        console.log('🎯 Using existing WebRTC instance')
        return webrtc
    }



    // Initiate call (student calls tutor)
    const initiateCall = async (tutorId: number, tutorName: string) => {
        console.log('=== INITIATING CALL ===')
        console.log('WebSocket available:', !!websocket)
        console.log('WebSocket connected:', websocket?.isConnected())
        console.log('User available:', !!user)
        console.log('User ID:', user?.id)
        console.log('Target tutor ID:', tutorId)
        console.log('Target tutor name:', tutorName)

        if (!websocket || !user) {
            console.error('Cannot initiate call: WebSocket or user not available')
            console.error('WebSocket:', websocket)
            console.error('User:', user)
            return
        }

        if (!websocket || !websocket.isConnected()) {
            console.error('Cannot initiate call: WebSocket not connected')
            return
        }

        const sessionId = `session_${user.id}_${tutorId}_${Date.now()}`
        console.log(`Initiating call from ${user.id} to tutor ${tutorId} with session ${sessionId}`)

        // IMMEDIATELY transition student to video call interface
        console.log('🎯 Student immediately transitioning to video call interface...')

        // Update call state with all necessary information for ICE candidates
        const newCallState = {
            isInCall: true,
            isOutgoingCall: false,
            isIncomingCall: false,
            calleeId: tutorId,
            calleeName: tutorName,
            sessionId
        };

        setCallState(prev => ({
            ...prev,
            ...newCallState
        }))

        // Force immediate update of call state for ICE candidates
        console.log('🎯 Updated call state for ICE candidates:', newCallState)

        // Initialize WebRTC and get user media immediately
        try {
            console.log('🎯 Student initializing WebRTC and getting media...')
            const rtc = await initializeWebRTC()
            if (rtc) {
                const localStream = await rtc.getUserMedia()
                setCallState(prev => ({
                    ...prev,
                    localStream
                }))
                console.log('🎯 Student local stream obtained - waiting for tutor to accept')
            }
        } catch (error) {
            console.error('🎯 Error setting up WebRTC for student:', error)
        }

        // Send call request with caller name
        const callerName = `${user.firstName} ${user.lastName}`
        console.log('Sending call request with caller name:', callerName)
        console.log('Call request details:', {
            from: user.id,
            to: tutorId,
            sessionId,
            callerName
        })

        try {
            if (websocket) {
                websocket.sendCallRequest(tutorId, sessionId, callerName)
                console.log('=== CALL REQUEST SENT SUCCESSFULLY ===')
            } else {
                console.error('=== ERROR: WebSocket is null, cannot send call request ===')
            }
        } catch (error) {
            console.error('=== ERROR SENDING CALL REQUEST ===', error)
        }
    }

    // Accept incoming call
    const acceptCall = async () => {
        console.log('🎯 ACCEPT CALL CLICKED!')
        if (!websocket || !callState.callerId || !callState.sessionId) return

        // IMMEDIATELY transition to video call interface
        console.log('🎯 Transitioning to video call interface...')
        setCallState(prev => ({
            ...prev,
            isInCall: true,
            isIncomingCall: false,
            isOutgoingCall: false
        }))

        // Send call accept message
        if (websocket) {
            websocket.sendCallAccept(callState.callerId, callState.sessionId)
            console.log('🎯 Call accept message sent')
        }

        // Initialize WebRTC in background
        try {
            const rtc = await initializeWebRTC()
            if (rtc) {
                console.log('🎯 Getting user media...')
                const localStream = await rtc.getUserMedia()
                setCallState(prev => ({
                    ...prev,
                    localStream
                }))
                console.log('🎯 Local stream obtained')
            }
        } catch (error) {
            console.error('Error setting up WebRTC:', error)
        }
    }

    // Reject incoming call
    const rejectCall = () => {
        console.log('🚫 Rejecting incoming call')
        console.log('🚫 Current call state:', {
            callerId: callState.callerId,
            sessionId: callState.sessionId,
            isIncomingCall: callState.isIncomingCall
        })

        if (!websocket || !callState.callerId || !callState.sessionId) {
            console.log('🚫 Cannot send reject message - missing websocket, callerId, or sessionId')
            // Still reset local state
            resetCallState()
            return
        }

        try {
            if (websocket) {
                console.log('🚫 Sending call reject message to:', callState.callerId)
                websocket.sendCallReject(callState.callerId, callState.sessionId)
                console.log('🚫 Call reject message sent successfully')
            }
        } catch (error) {
            console.error('🚫 Error sending call reject message:', error)
        }

        // Reset call state completely
        resetCallState()
        console.log('✅ Call rejected and state reset')
    }

    // End call - simplified to prevent multiple call-end messages
    const endCall = () => {
        // Prevent duplicate end call operations
        if (isEndingCallRef.current) {
            console.log('🔚 End call already in progress, ignoring duplicate call');
            return;
        }

        // Check if we're actually in a call state that needs ending
        if (!callState.isInCall && !callState.isIncomingCall && !callState.isOutgoingCall) {
            console.log('🔚 No active call to end, ignoring');
            return;
        }

        // Set flag to prevent duplicate processing
        isEndingCallRef.current = true;

        console.log('🔚 End call initiated by user');

        // Store the session ID and target ID before resetting state
        const currentSessionId = callState.sessionId;
        const targetId = callState.callerId || callState.calleeId;

        // IMMEDIATELY reset local call state first to prevent UI issues
        // Clean up WebRTC connection
        if (webrtc) {
            console.log('🔚 Cleaning up WebRTC connection');
            webrtc.cleanup();
            setWebrtc(null);
        }

        // Reset call state completely - FORCE IMMEDIATE UPDATE
        setCallState({
            isInCall: false,
            isIncomingCall: false,
            isOutgoingCall: false,
            callerId: undefined,
            callerName: undefined,
            calleeId: undefined,
            calleeName: undefined,
            sessionId: undefined,
            localStream: undefined,
            remoteStream: undefined,
            connectionState: undefined,
            isScreenSharing: false,
            isMuted: false,
            isVideoOff: false
        });

        // Clear chat messages
        setChatMessages([]);

        // Clear any global variables
        (window as any).incomingCallMessage = null;
        (window as any).hasIncomingCall = false;
        (window as any).lastIncomingCallTime = null;

        // Send the call end message to the other user only once
        if (websocket && currentSessionId && targetId) {
            try {
                console.log('🔚 Sending call end message to:', targetId);
                // Send only one message
                if (websocket) {
                    websocket.sendCallEnd(targetId, currentSessionId);
                }
            } catch (error) {
                console.error('🔚 Error sending call end message:', error);
            }
        }

        // Reset the flag after a delay
        setTimeout(() => {
            isEndingCallRef.current = false;
        }, 2000);
    }



    // Handle offer
    const handleOffer = async (message: SignalingMessage) => {
        console.log('🎯 Handling offer from student...')
        console.log('🎯 WebSocket available:', !!websocket)
        console.log('🎯 WebSocket connected:', websocket?.isConnected())

        // We don't need the WebSocket to be connected to handle an offer
        // The offer is already received, so we can process it regardless of WebSocket state
        // We'll only need the WebSocket when sending the answer back

        // Store the message for later processing if WebSocket is not available
        let offerProcessed = false

        try {
            // Get or initialize WebRTC instance (for tutor side)
            let rtc = webrtc
            if (!rtc) {
                console.log('🎯 Initializing WebRTC for tutor to handle offer...')
                rtc = await initializeWebRTC()
                if (!rtc) {
                    console.error('🎯 Failed to initialize WebRTC for offer handling')
                    return
                }
                // Update the global webrtc state
                setWebrtc(rtc)
            }

            console.log('🎯 Setting remote description (offer)...')
            await rtc.setRemoteDescription(message.data)

            console.log('🎯 Getting user media for tutor...')
            const localStream = await rtc.getUserMedia()
            setCallState(prev => ({
                ...prev,
                localStream
            }))

            console.log('🎯 Creating answer...')
            const answer = await rtc.createAnswer()

            console.log('🎯 Sending answer to student...')
            if (websocket) {
                websocket.sendAnswer(message.from, answer, message.sessionId!)
                console.log('🎯 Answer sent successfully')
            } else {
                console.error('🎯 WebSocket is null, cannot send answer')
            }
        } catch (error) {
            console.error('🎯 Error handling offer:', error)
            console.error('🎯 Offer data:', message.data)
        }
    }

    // Handle answer
    const handleAnswer = async (message: SignalingMessage) => {
        console.log('� Receivedi answer from tutor:', message.from)
        console.log('🎯 Answer data:', message.data)

        if (!webrtc) {
            console.error('🎯 WebRTC instance not available for handling answer')

            // Try to initialize WebRTC if not already done
            try {
                console.log('🎯 Attempting to initialize WebRTC for answer...')
                const rtc = await initializeWebRTC()
                if (rtc) {
                    console.log('🎯 Setting remote description from answer...')
                    await rtc.setRemoteDescription(message.data)
                    console.log('🎯 Remote description set successfully')
                }
            } catch (error) {
                console.error('� Error initinalizing WebRTC for answer:', error)
            }
            return
        }

        try {
            console.log('🎯 Setting remote description from answer...')
            await webrtc.setRemoteDescription(message.data)
            console.log('🎯 Remote description set successfully')

            // Update connection state for UI feedback
            setCallState(prev => ({
                ...prev,
                connectionState: 'connecting'
            }))
        } catch (error) {
            console.error('🎯 Error handling answer:', error)
            console.error('🎯 Answer data that failed:', message.data)
        }
    }

    // Store pending ICE candidates when WebRTC is not ready
    const pendingIceCandidatesRef = React.useRef<SignalingMessage[]>([])

    // Handle ICE candidate
    const handleIceCandidate = async (message: SignalingMessage) => {
        console.log('🧊 ===== RECEIVED ICE CANDIDATE FROM PEER =====')
        console.log('🧊 WebRTC instance available:', !!webrtc)
        console.log('🧊 From user:', message.from)
        console.log('🧊 Session ID:', message.sessionId)
        console.log('🧊 ICE candidate data:', message.data ? {
            candidate: message.data.candidate?.substring(0, 50) + '...',
            sdpMid: message.data.sdpMid,
            sdpMLineIndex: message.data.sdpMLineIndex
        } : 'No data')

        // If WebRTC instance is not available, buffer the candidate
        if (!webrtc) {
            console.log('🧊 WebRTC not initialized, buffering ICE candidate...')
            pendingIceCandidatesRef.current.push(message)
            console.log('🧊 Total pending ICE candidates:', pendingIceCandidatesRef.current.length)

            // Try to initialize WebRTC if not already done
            try {
                console.log('🧊 Attempting to initialize WebRTC for ICE candidate...')
                const rtc = await initializeWebRTC()
                if (rtc) {
                    console.log('🧊 WebRTC initialized successfully, processing pending candidates')
                    await processPendingIceCandidates(rtc)
                }
            } catch (error) {
                console.error('🧊 Error initializing WebRTC for ICE candidate:', error)
            }
            return
        }

        try {
            // Check if this is a valid ICE candidate
            if (!message.data || !message.data.candidate) {
                console.log('🧊 Empty or invalid ICE candidate received, ignoring')
                return
            }

            console.log('🧊 Adding ICE candidate to peer connection...')
            console.log('🧊 Current connection state:', webrtc.getConnectionState())

            await webrtc.addIceCandidate(message.data)
            console.log('🧊 ICE candidate added successfully!')

            // Check connection state after adding candidate
            const connectionState = webrtc.getConnectionState()
            console.log('🧊 Connection state after adding candidate:', connectionState)

            if (connectionState === 'connected') {
                console.log('🎉 WebRTC connection is established!')
            } else if (connectionState === 'connecting') {
                console.log('🧊 WebRTC connection is in progress...')
            }
        } catch (error) {
            console.error('🧊 Error adding ICE candidate:', error)
            console.error('🧊 ICE candidate that failed:', message.data)

            // If adding fails, it might be because remote description isn't set yet
            // Buffer the candidate for later processing
            console.log('🧊 Buffering failed ICE candidate for later retry...')
            pendingIceCandidatesRef.current.push(message)
        }
    }

    // Process pending ICE candidates when WebRTC becomes available
    const processPendingIceCandidates = async (rtc: WebRTCManager) => {
        if (pendingIceCandidatesRef.current.length > 0) {
            console.log('🧊 Processing', pendingIceCandidatesRef.current.length, 'pending ICE candidates...')

            for (const message of pendingIceCandidatesRef.current) {
                try {
                    await rtc.addIceCandidate(message.data)
                    console.log('🧊 Pending ICE candidate added successfully')
                } catch (error) {
                    console.error('🧊 Error adding pending ICE candidate:', error)
                }
            }

            // Clear pending candidates
            pendingIceCandidatesRef.current = []
            console.log('🧊 All pending ICE candidates processed')
        }
    }

    // Handle chat message
    const handleChatMessage = (message: SignalingMessage) => {
        const chatMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random()}`,
            from: message.from,
            message: message.data.message,
            timestamp: message.timestamp || Date.now(),
            isOwn: message.from === user?.id
        }

        setChatMessages(prev => [...prev, chatMessage])
    }

    // Handle call end
    const handleCallEnd = () => {
        console.log('🔚 Handling call end - cleaning up call state')

        // Clean up WebRTC connection
        if (webrtc) {
            console.log('🔚 Cleaning up WebRTC connection')
            webrtc.cleanup()
            setWebrtc(null)
        }

        // Reset call state completely - FORCE IMMEDIATE UPDATE
        setCallState({
            isInCall: false,
            isIncomingCall: false,
            isOutgoingCall: false,
            callerId: undefined,
            callerName: undefined,
            calleeId: undefined,
            calleeName: undefined,
            sessionId: undefined,
            localStream: undefined,
            remoteStream: undefined,
            connectionState: undefined,
            isScreenSharing: false,
            isMuted: false,
            isVideoOff: false
        })

        // Clear chat messages
        setChatMessages([])

        // Dispatch a custom event to notify other components that the call has ended
        try {
            const callEndEvent = new CustomEvent('call-end');
            window.dispatchEvent(callEndEvent);
            console.log('🔚 Dispatched call-end event');
        } catch (error) {
            console.error('🔚 Error dispatching call-end event:', error);
        }

        // Clear any global variables that might be used by other components
        (window as any).incomingCallMessage = null;
        (window as any).hasIncomingCall = false;
        (window as any).lastIncomingCallTime = null;

        console.log('✅ Call state reset successfully')
    }

    // Handle call end without dispatching events (to prevent infinite loops)
    const handleCallEndWithoutEvents = () => {
        console.log('🔚 Handling call end WITHOUT events - cleaning up call state')

        // Clean up WebRTC connection
        if (webrtc) {
            console.log('🔚 Cleaning up WebRTC connection')
            webrtc.cleanup()
            setWebrtc(null)
        }

        // Reset call state completely - FORCE IMMEDIATE UPDATE
        setCallState({
            isInCall: false,
            isIncomingCall: false,
            isOutgoingCall: false,
            callerId: undefined,
            callerName: undefined,
            calleeId: undefined,
            calleeName: undefined,
            sessionId: undefined,
            localStream: undefined,
            remoteStream: undefined,
            connectionState: undefined,
            isScreenSharing: false,
            isMuted: false,
            isVideoOff: false
        })

        // Clear chat messages
        setChatMessages([]);

            // Clear any global variables that might be used by other components
        (window as any).incomingCallMessage = null;
        (window as any).hasIncomingCall = false;
        (window as any).lastIncomingCallTime = null;

        console.log('✅ Call state reset successfully WITHOUT events')
    }

    // Toggle mute
    const toggleMute = () => {
        if (callState.localStream) {
            const audioTrack = callState.localStream.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setCallState(prev => ({
                    ...prev,
                    isMuted: !audioTrack.enabled
                }))
            }
        }
    }

    // Toggle video
    const toggleVideo = () => {
        if (callState.localStream) {
            const videoTrack = callState.localStream.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setCallState(prev => ({
                    ...prev,
                    isVideoOff: !videoTrack.enabled
                }))
            }
        }
    }

    // Start screen share
    const startScreenShare = async () => {
        if (!webrtc) return

        try {
            await webrtc.getDisplayMedia()
            setCallState(prev => ({
                ...prev,
                isScreenSharing: true
            }))
        } catch (error) {
            console.error('Error starting screen share:', error)
        }
    }

    // Stop screen share
    const stopScreenShare = async () => {
        if (!webrtc) return

        try {
            await webrtc.stopScreenShare()
            setCallState(prev => ({
                ...prev,
                isScreenSharing: false
            }))
        } catch (error) {
            console.error('Error stopping screen share:', error)
        }
    }

    // Send chat message
    const sendChatMessage = (message: string) => {
        if (!websocket || !callState.sessionId) return

        const targetId = callState.callerId || callState.calleeId
        if (targetId) {
            websocket.sendChatMessage(targetId, message, callState.sessionId)

            // Add to local chat
            const chatMessage: ChatMessage = {
                id: `msg_${Date.now()}_${Math.random()}`,
                from: user!.id,
                message,
                timestamp: Date.now(),
                isOwn: true
            }
            setChatMessages(prev => [...prev, chatMessage])
        }
    }

    // Reset call state (useful for debugging)
    const resetCallState = () => {
        console.log('🔄 Manually resetting call state')
        setCallState({
            isInCall: false,
            isIncomingCall: false,
            isOutgoingCall: false,
            callerId: undefined,
            callerName: undefined,
            calleeId: undefined,
            calleeName: undefined,
            sessionId: undefined,
            localStream: undefined,
            remoteStream: undefined,
            connectionState: undefined,
            isScreenSharing: false,
            isMuted: false,
            isVideoOff: false
        })
        console.log('✅ Call state manually reset')
    }

    const value: VideoCallContextType = {
        callState,
        webrtc,
        websocket,
        initiateCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleVideo,
        startScreenShare,
        stopScreenShare,
        sendChatMessage,
        chatMessages,
        resetCallState,
        // Expose setCallState for direct call state updates
        setCallState
    }

    return (
        <VideoCallContext.Provider value={value}>
            {children}
        </VideoCallContext.Provider>
    )
}