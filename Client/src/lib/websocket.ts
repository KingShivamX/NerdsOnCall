// WebSocket service for real-time signaling
export interface SignalingMessage {
    type: 'call-request' | 'call-accept' | 'call-reject' | 'call-end' | 'offer' | 'answer' | 'ice-candidate' | 'chat-message' | 'connection-confirmed' | 'error' | 'connection-test'
    from: number
    to: number
    data?: any
    sessionId?: string
    timestamp?: number
}

export class WebSocketService {
    private ws: WebSocket | null = null
    private userId: number | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 1000
    private messageHandlers: Map<string, (message: SignalingMessage) => void> = new Map()
    private connectionPromise: Promise<void> | null = null

    constructor(userId: number) {
        this.userId = userId
        console.log('🚀 WebSocketService constructor - userId:', userId)
        // Don't connect immediately - wait for handlers to be set up first
        // Connection will be initiated when startConnection() is called
    }

    private ensureConnection() {
        if (!this.connectionPromise) {
            console.log('🔌 Starting WebSocket connection...')
            console.log('🔌 Handlers before connection:', Array.from(this.messageHandlers.keys()))
            this.connectionPromise = this.connect()
        }
        return this.connectionPromise
    }

    private connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Use WebSocket URL - in production this would be wss://
                // Make sure we're using the correct WebSocket endpoint
                const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws'
                console.log('Connecting to WebSocket:', `${wsUrl}?userId=${this.userId}`)

                // Make sure we have a valid user ID
                if (!this.userId) {
                    console.error('Cannot connect to WebSocket: No user ID provided')
                    reject(new Error('No user ID provided'))
                    return
                }

                try {
                    // Create WebSocket with error handling
                    this.ws = new WebSocket(`${wsUrl}?userId=${this.userId}`)
                    console.log('WebSocket instance created successfully')

                    // Add additional logging for connection state
                    console.log('WebSocket initial state:', this.ws.readyState)
                    console.log('WebSocket states: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3')
                } catch (error) {
                    console.error('Failed to create WebSocket instance:', error)
                    reject(error)
                    return
                }

                this.ws.onopen = () => {
                    console.log('WebSocket connected successfully for user ID:', this.userId)
                    this.reconnectAttempts = 0

                    // Send a test message to verify connection
                    try {
                        const testMessage = {
                            type: 'connection-test',
                            from: this.userId!,
                            to: -1, // System
                            data: { message: 'Connection test' },
                            timestamp: Date.now()
                        }
                        this.ws!.send(JSON.stringify(testMessage))
                        console.log('Sent test message to verify connection')
                    } catch (error) {
                        console.error('Failed to send test message:', error)
                    }

                    resolve()
                }

                this.ws.onmessage = (event) => {
                    try {
                        const message: SignalingMessage = JSON.parse(event.data)
                        this.handleMessage(message)
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error)
                    }
                }

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected')
                    this.attemptReconnect()
                }

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error)
                    reject(error)
                }
            } catch (error) {
                console.error('Error connecting to WebSocket:', error)
                reject(error)
            }
        })
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
            console.log('🔄 Handlers before reconnect:', Array.from(this.messageHandlers.keys()))

            setTimeout(() => {
                // Reset connection promise to allow new connection
                this.connectionPromise = null
                this.connect()
            }, this.reconnectDelay * this.reconnectAttempts)
        } else {
            console.error('Max reconnection attempts reached')
        }
    }

    private handleMessage(message: SignalingMessage) {
        console.log('🔄 Received signaling message:', message.type, 'from:', message.from)

        // Handle system messages
        if (message.type === 'connection-confirmed') {
            console.log('WebSocket connection confirmed by server')
            return
        }

        if (message.type === 'error') {
            console.error('WebSocket error from server:', message.data)
            return
        }

        const handler = this.messageHandlers.get(message.type)

        if (handler) {
            console.log('✅ Executing handler for message type:', message.type)
            try {
                handler(message)
                console.log('✅ Handler executed successfully for:', message.type)
            } catch (error) {
                console.error('❌ Error executing handler for', message.type, ':', error)
            }
        } else {
            console.warn('❌ No handler found for message type:', message.type)
            console.warn('Available handlers:', Array.from(this.messageHandlers.keys()))
        }
    }

    // Send signaling messages
    sendCallRequest(toUserId: number, sessionId: string, callerName?: string) {
        console.log(`Sending call request from ${this.userId} to ${toUserId}`)
        this.sendMessage({
            type: 'call-request',
            from: this.userId!,
            to: toUserId,
            data: { callerName },
            sessionId,
            timestamp: Date.now()
        })
    }

    sendCallAccept(toUserId: number, sessionId: string) {
        this.sendMessage({
            type: 'call-accept',
            from: this.userId!,
            to: toUserId,
            sessionId,
            timestamp: Date.now()
        })
    }

    sendCallReject(toUserId: number, sessionId: string) {
        this.sendMessage({
            type: 'call-reject',
            from: this.userId!,
            to: toUserId,
            sessionId,
            timestamp: Date.now()
        })
    }

    // Track the last call-end message sent to prevent duplicates
    private lastCallEndSent: Record<string, number> = {};
    private callEndInProgress: Record<string, boolean> = {};

    // Send a single call-end message - simplified to prevent duplicates
    sendCallEnd(toUserId: number, sessionId: string) {
        // Create a unique key for this call end message
        const callEndKey = `${toUserId}_${sessionId}`;
        const now = Date.now();
        
        // Check if we're already in the process of ending this call or sent recently
        if (this.callEndInProgress[callEndKey] || 
            (this.lastCallEndSent[callEndKey] && (now - this.lastCallEndSent[callEndKey] < 5000))) {
            console.log('⚠️ Call end already in progress or sent recently, ignoring duplicate request');
            return;
        }
        
        // Mark this call as being ended and update timestamp
        this.callEndInProgress[callEndKey] = true;
        this.lastCallEndSent[callEndKey] = now;
        
        // Create the message
        const message = {
            type: 'call-end',
            from: this.userId!,
            to: toUserId,
            sessionId,
            timestamp: now
        };
        
        // Send it directly to avoid any potential duplication
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
                console.log('🔚 Sending ONE call-end message to:', toUserId);
                this.ws.send(JSON.stringify(message));
                console.log('✅ Call end message sent successfully');
            } catch (error) {
                console.error('❌ Error sending call end message:', error);
            }
        } else {
            console.error('❌ WebSocket not connected, cannot send call-end message');
        }
        
        // Clean up after 10 seconds
        setTimeout(() => {
            delete this.lastCallEndSent[callEndKey];
            delete this.callEndInProgress[callEndKey];
        }, 10000);
    }

    sendOffer(toUserId: number, offer: RTCSessionDescriptionInit, sessionId: string) {
        this.sendMessage({
            type: 'offer',
            from: this.userId!,
            to: toUserId,
            data: offer,
            sessionId,
            timestamp: Date.now()
        })
    }

    sendAnswer(toUserId: number, answer: RTCSessionDescriptionInit, sessionId: string) {
        this.sendMessage({
            type: 'answer',
            from: this.userId!,
            to: toUserId,
            data: answer,
            sessionId,
            timestamp: Date.now()
        })
    }

    sendIceCandidate(toUserId: number, candidate: RTCIceCandidateInit, sessionId: string) {
        console.log('🧊 WebSocket: Sending ICE candidate to user', toUserId, 'session:', sessionId)
        console.log('🧊 WebSocket: ICE candidate data:', {
            candidate: candidate.candidate,
            sdpMLineIndex: candidate.sdpMLineIndex,
            sdpMid: candidate.sdpMid
        })

        this.sendMessage({
            type: 'ice-candidate',
            from: this.userId!,
            to: toUserId,
            data: candidate,
            sessionId,
            timestamp: Date.now()
        })

        console.log('🧊 WebSocket: ICE candidate message sent successfully')
    }

    sendChatMessage(toUserId: number, message: string, sessionId: string) {
        this.sendMessage({
            type: 'chat-message',
            from: this.userId!,
            to: toUserId,
            data: { message },
            sessionId,
            timestamp: Date.now()
        })
    }

    private sendMessage(message: SignalingMessage) {
        console.log('Attempting to send message:', message)
        console.log('WebSocket state:', this.ws?.readyState)

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // Special handling for call-end messages to prevent duplicates
            if (message.type === 'call-end') {
                console.log('🔚 Sending call-end message to:', message.to);
            }
            
            console.log('Sending WebSocket message:', JSON.stringify(message))
            this.ws.send(JSON.stringify(message))
        } else {
            console.error('WebSocket not connected. ReadyState:', this.ws?.readyState)
            console.error('WebSocket states: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3')
        }
    }

    // Event handlers
    onCallRequest(handler: (message: SignalingMessage) => void) {
        console.log('🔧 Registering call-request handler in WebSocket service')
        this.messageHandlers.set('call-request', handler)
        console.log('📋 Current message handlers after registration:', Array.from(this.messageHandlers.keys()))
        console.log('🔧 Handler function:', handler.toString().substring(0, 100) + '...')
        // Don't connect immediately - wait for all handlers to be registered
    }

    onCallAccept(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('call-accept', handler)
    }

    onCallReject(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('call-reject', handler)
    }

    onCallEnd(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('call-end', handler)
    }

    onOffer(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('offer', handler)
    }

    onAnswer(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('answer', handler)
    }

    onIceCandidate(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('ice-candidate', handler)
    }

    onChatMessage(handler: (message: SignalingMessage) => void) {
        this.messageHandlers.set('chat-message', handler)
    }

    // Method to start connection after all handlers are registered
    startConnection() {
        console.log('🚀 Starting WebSocket connection with all handlers registered')
        console.log('📋 Registered handlers:', Array.from(this.messageHandlers.keys()))
        console.log('📋 Handler count:', this.messageHandlers.size)

        // Verify call-request handler is registered
        const callRequestHandler = this.messageHandlers.get('call-request')
        console.log('🔍 Call-request handler exists:', !!callRequestHandler)
        if (callRequestHandler) {
            console.log('🔍 Call-request handler preview:', callRequestHandler.toString().substring(0, 150) + '...')
        }

        this.ensureConnection()
    }

    // Cleanup
    disconnect(clearHandlers: boolean = false) {
        console.log('🔌 Disconnecting WebSocket, clearHandlers:', clearHandlers)
        console.log('🔌 Current handlers before disconnect:', Array.from(this.messageHandlers.keys()))

        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
        this.connectionPromise = null

        // Only clear handlers if explicitly requested (for complete cleanup)
        if (clearHandlers) {
            console.log('🧹 Clearing message handlers')
            this.messageHandlers.clear()
        } else {
            console.log('🔧 Keeping message handlers for reconnection')
        }
    }

    // Status
    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN
    }
}