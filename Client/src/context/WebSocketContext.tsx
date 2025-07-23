"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./AuthContext"

// Define a custom WebSocket interface that mimics the Socket.IO interface for compatibility
interface CustomWebSocket extends WebSocket {
    emit: (event: string, data: any) => void;
    connected: boolean;
    cleanupInterval?: NodeJS.Timeout;
}

interface WebSocketContextType {
    socket: CustomWebSocket | null
    connected: boolean
    subscribeToTutorUpdates: (tutorId: number) => void
    subscribeToStudentUpdates: (studentId: number) => void
    subscribeToSessionUpdates: (sessionId: string) => void
    sendCanvasUpdate: (sessionId: string, canvasData: string) => void
    sendScreenShare: (sessionId: string, screenData: string) => void
    sendWebRTCSignal: (sessionId: string, signalData: any) => void
    unsubscribe: (channel: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
    undefined
)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [socket, setSocket] = useState<CustomWebSocket | null>(null)
    const [connected, setConnected] = useState(false)
    const socketRef = useRef<CustomWebSocket | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectAttemptsRef = useRef(0)
    const maxReconnectAttempts = 5
    const [reconnectTrigger, setReconnectTrigger] = useState(0)

    useEffect(() => {
        // Track if we need to reconnect
        const shouldConnect = !socket && user;
        
        if (shouldConnect) {
            // Connect to WebSocket server using native WebSockets
            // Make sure to use the correct WebSocket endpoint
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
            console.log("Connecting to WebSocket server at:", `${wsUrl}?userId=${user.id}`);
            
            try {
                // Create a WebSocket connection with the correct endpoint
                const ws = new WebSocket(`${wsUrl}?userId=${user.id}`) as CustomWebSocket;
                
                // Add Socket.IO-like emit method for compatibility with existing code
                ws.emit = (event: string, data: any) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        const message = {
                            type: event,
                            from: user.id,
                            data: data,
                            timestamp: Date.now()
                        };
                        ws.send(JSON.stringify(message));
                    } else {
                        console.error("WebSocket not connected. Cannot emit event:", event);
                    }
                };
                
                // Add connected property for compatibility
                ws.connected = false;
                
                ws.onopen = () => {
                    console.log("WebSocket connected successfully");
                    ws.connected = true;
                    setConnected(true);
                    reconnectAttemptsRef.current = 0;
                    
                    // Send a test message to verify connection
                    try {
                        const testMessage = {
                            type: 'connection-test',
                            from: user.id,
                            to: -1, // System
                            data: { message: 'Connection test' },
                            timestamp: Date.now()
                        };
                        ws.send(JSON.stringify(testMessage));
                        console.log('Sent test message to verify connection');
                    } catch (error) {
                        console.error('Failed to send test message:', error);
                    }
                };
                
                ws.onclose = (event) => {
                    console.log("WebSocket disconnected:", event.code, event.reason);
                    ws.connected = false;
                    setConnected(false);
                    
                    // Attempt to reconnect after a delay if not at max attempts
                    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                        reconnectAttemptsRef.current++;
                        const delay = 1000 * Math.pow(2, reconnectAttemptsRef.current - 1); // Exponential backoff
                        
                        console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${delay}ms...`);
                        
                        if (reconnectTimeoutRef.current) {
                            clearTimeout(reconnectTimeoutRef.current);
                        }
                        
                        reconnectTimeoutRef.current = setTimeout(() => {
                            console.log("Reconnecting...");
                            // Trigger reconnection by updating state
                            setSocket(null);
                            setReconnectTrigger(prev => prev + 1);
                        }, delay);
                    } else {
                        console.error("Max reconnection attempts reached");
                    }
                };
                
                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };
                
                // Create a message deduplication cache with a timestamp
                const processedMessages = new Map();
                
                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        
                        // Only deduplicate call-end messages
                        if (message.type === 'call-end') {
                            // Create a simpler message ID for deduplication (without timestamp)
                            const messageId = `${message.type}_${message.from}_${message.to}_${message.sessionId}`;
                            
                            // Check if we've already processed this message recently
                            const lastProcessed = processedMessages.get(messageId);
                            const now = Date.now();
                            
                            if (lastProcessed && (now - lastProcessed < 5000)) {
                                console.log("⚠️ Duplicate call-end message detected within 5 seconds, ignoring:", message);
                                return;
                            }
                            
                            // Update the timestamp for this message
                            processedMessages.set(messageId, now);
                            
                            // Clean up old entries every minute
                            if (!ws.cleanupInterval) {
                                ws.cleanupInterval = setInterval(() => {
                                    const now = Date.now();
                                    // Use Array.from to convert entries to array for compatibility
                                    Array.from(processedMessages.entries()).forEach(([key, timestamp]) => {
                                        if (now - timestamp > 60000) { // 1 minute
                                            processedMessages.delete(key);
                                        }
                                    });
                                }, 60000);
                            }
                        }
                        
                        console.log("WebSocket message received:", message);
                        
                        // Let VideoCallContext handle all call-related messages
                        // No special handling needed here
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                };
                
                socketRef.current = ws;
                setSocket(ws);
                // console.log("Tuzya aai chi katkat");
                return () => {
                    console.log("Cleaning up WebSocket connection");
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                        reconnectTimeoutRef.current = null;
                    }
                    
                    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                        ws.close();
                    }
                    socketRef.current = null;
                    setSocket(null);
                    setConnected(false);
                };
            } catch (error) {
                console.error("Error creating WebSocket connection:", error);
            }
        }
    }, [user, reconnectTrigger]); // Depend on user and reconnectTrigger to handle reconnection

    const subscribeToTutorUpdates = (tutorId: number) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: "subscribe",
                from: user?.id,
                to: -1, // System message
                data: `tutor_${tutorId}`,
                timestamp: Date.now()
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket not connected. Cannot subscribe to tutor updates.");
        }
    }

    const subscribeToStudentUpdates = (studentId: number) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: "subscribe",
                from: user?.id,
                to: -1, // System message
                data: `student_${studentId}`,
                timestamp: Date.now()
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket not connected. Cannot subscribe to student updates.");
        }
    }

    const subscribeToSessionUpdates = (sessionId: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            // Subscribe to all session channels
            const channels = [
                `session_${sessionId}`,
                `session_${sessionId}_canvas`,
                `session_${sessionId}_screen`,
                `session_${sessionId}_webrtc`
            ];
            
            channels.forEach(channel => {
                const message = {
                    type: "subscribe",
                    from: user?.id,
                    to: -1, // System message
                    data: channel,
                    timestamp: Date.now()
                };
                socket.send(JSON.stringify(message));
            });
        } else {
            console.error("WebSocket not connected. Cannot subscribe to session updates.");
        }
    }

    const sendCanvasUpdate = (sessionId: string, canvasData: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: "canvas_update",
                from: user?.id,
                to: -1, // Broadcast
                data: {
                    sessionId,
                    data: canvasData,
                    userId: user?.id,
                },
                timestamp: Date.now()
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket not connected. Cannot send canvas update.");
        }
    }

    const sendScreenShare = (sessionId: string, screenData: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: "screen_share",
                from: user?.id,
                to: -1, // Broadcast
                data: {
                    sessionId,
                    data: screenData,
                    userId: user?.id,
                },
                timestamp: Date.now()
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket not connected. Cannot send screen share.");
        }
    }

    const sendWebRTCSignal = (sessionId: string, signalData: any) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: "webrtc_signal",
                from: user?.id,
                to: -1, // Will be routed by the server
                data: {
                    sessionId,
                    signal: signalData,
                    userId: user?.id,
                },
                timestamp: Date.now()
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket not connected. Cannot send WebRTC signal.");
        }
    }

    const unsubscribe = (channel: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                type: "unsubscribe",
                from: user?.id,
                to: -1, // System message
                data: channel,
                timestamp: Date.now()
            };
            socket.send(JSON.stringify(message));
        } else {
            console.error("WebSocket not connected. Cannot unsubscribe.");
        }
    }

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                connected,
                subscribeToTutorUpdates,
                subscribeToStudentUpdates,
                subscribeToSessionUpdates,
                sendCanvasUpdate,
                sendScreenShare,
                sendWebRTCSignal,
                unsubscribe,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    )
}

export function useWebSocket() {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider")
    }
    return context;
}