"use client"

import { useRef, useEffect, useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/Button"
import { Pencil, Eraser, Trash2, Palette, Users } from "lucide-react"

interface CanvasProps {
    sessionId: string
    user?: any
    socket?: WebSocket | null // Fallback socket if dedicated connection fails
    onCanvasUpdate?: (data: string) => void
}

interface DrawingEvent {
    type: "start" | "draw" | "end" | "clear"
    x?: number
    y?: number
    color?: string
    lineWidth?: number
    tool?: string
    userId?: string
    timestamp?: number
}

const CanvasComponent = ({
    sessionId,
    user,
    socket,
    onCanvasUpdate,
}: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#000000")
    const [lineWidth, setLineWidth] = useState(2)
    const [tool, setTool] = useState<"pen" | "eraser">("pen")
    const [isConnected, setIsConnected] = useState(false)
    const [connectionType, setConnectionType] = useState<
        "canvas" | "fallback" | "none"
    >("none")

    const lastPointRef = useRef<{ x: number; y: number } | null>(null)
    const isReceivingUpdateRef = useRef(false)
    const canvasSocketRef = useRef<WebSocket | null>(null)

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height

            // Fill with white background
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    // Handle remote drawing events from other users
    const handleRemoteDrawingEvent = useCallback((event: DrawingEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        isReceivingUpdateRef.current = true

        // Process drawing event silently for better performance

        switch (event.type) {
            case "start":
                lastPointRef.current = { x: event.x!, y: event.y! }
                break
            case "draw":
                if (
                    lastPointRef.current &&
                    event.x !== undefined &&
                    event.y !== undefined
                ) {
                    ctx.beginPath()
                    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
                    ctx.lineTo(event.x, event.y)
                    ctx.strokeStyle = event.color || "#000000"
                    ctx.lineWidth = event.lineWidth || 2
                    ctx.lineCap = "round"
                    ctx.globalCompositeOperation =
                        event.tool === "eraser"
                            ? "destination-out"
                            : "source-over"
                    ctx.stroke()
                    lastPointRef.current = { x: event.x, y: event.y }
                }
                break
            case "end":
                lastPointRef.current = null
                break
            case "clear":
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                break
        }

        setTimeout(() => {
            isReceivingUpdateRef.current = false
        }, 10)
    }, [])

    // Initialize canvas WebSocket connection
    useEffect(() => {
        if (!user?.id || !sessionId) return

        // Always start with the main socket if available
        if (socket?.readyState === WebSocket.OPEN) {
            setIsConnected(true)
            setConnectionType("fallback")
        } else {
            setIsConnected(false)
            setConnectionType("none")
        }

        // Optionally try to create a dedicated connection (but don't fail if it doesn't work)
        const serverUrl =
            process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws") ||
            "ws://localhost:8080"
        const wsUrl = `${serverUrl}/ws/session?userId=${user.id}&sessionId=${sessionId}`

        // Only try dedicated connection if we have a proper server URL
        if (process.env.NEXT_PUBLIC_API_URL) {
            try {
                canvasSocketRef.current = new WebSocket(wsUrl)
            } catch (error) {
                // Silently fall back to main socket
                return
            }
        } else {
            // No API URL configured, use main WebSocket only
            return
        }

        canvasSocketRef.current.onopen = () => {
            setIsConnected(true)
            setConnectionType("canvas")

            // Subscribe to the session
            if (canvasSocketRef.current) {
                canvasSocketRef.current.send(
                    JSON.stringify({
                        type: "subscribe",
                        sessionId: sessionId,
                        userId: user.id,
                    })
                )
            }
        }

        const handleCanvasMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data)

                if (
                    message.type === "drawing_event" &&
                    message.sessionId === sessionId &&
                    message.userId !== user?.id
                ) {
                    handleRemoteDrawingEvent(message.data)
                }
            } catch (error) {
                console.error("Error parsing drawing message:", error)
            }
        }

        canvasSocketRef.current.onmessage = handleCanvasMessage

        canvasSocketRef.current.onclose = (event) => {
            // Silently switch to fallback socket if available
            if (socket?.readyState === WebSocket.OPEN) {
                setIsConnected(true)
                setConnectionType("fallback")
            } else {
                setIsConnected(false)
                setConnectionType("none")
            }
        }

        canvasSocketRef.current.onerror = (error) => {
            // Silently fall back to main socket - no error logging needed
            if (socket?.readyState === WebSocket.OPEN) {
                setIsConnected(true)
                setConnectionType("fallback")
            } else {
                setIsConnected(false)
                setConnectionType("none")
            }
        }

        // Also listen on the main socket as fallback
        if (socket) {
            socket.addEventListener("message", handleCanvasMessage)
        }

        return () => {
            if (canvasSocketRef.current) {
                canvasSocketRef.current.close()
            }
            if (socket) {
                socket.removeEventListener("message", handleCanvasMessage)
            }
        }
    }, [user?.id, sessionId, socket])

    // Update connection status when main socket changes
    useEffect(() => {
        if (canvasSocketRef.current?.readyState === WebSocket.OPEN) {
            setIsConnected(true)
            setConnectionType("canvas")
        } else if (socket?.readyState === WebSocket.OPEN) {
            setIsConnected(true)
            setConnectionType("fallback")
        } else {
            setIsConnected(false)
            setConnectionType("none")
        }
    }, [socket])

    const sendDrawingEvent = useCallback(
        (event: DrawingEvent) => {
            // Try dedicated canvas socket first, then fallback to main socket
            const activeSocket =
                canvasSocketRef.current?.readyState === WebSocket.OPEN
                    ? canvasSocketRef.current
                    : socket?.readyState === WebSocket.OPEN
                    ? socket
                    : null

            if (!activeSocket) {
                console.warn(
                    "No active WebSocket connection for drawing events"
                )
                return
            }

            const message = {
                type: "drawing_event",
                sessionId: sessionId,
                userId: user?.id,
                data: event,
                timestamp: Date.now(),
            }

            try {
                activeSocket.send(JSON.stringify(message))
                // Reduced logging for better performance
            } catch (error) {
                console.warn("Failed to send drawing event")
            }
        },
        [sessionId, user?.id, socket]
    )

    const getEventCoordinates = (
        e:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()

        if ("touches" in e) {
            // Touch event
            const touch = e.touches[0] || e.changedTouches[0]
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            }
        } else {
            // Mouse event
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            }
        }
    }

    const startDrawing = (
        e:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (isReceivingUpdateRef.current) return
        e.preventDefault()
        e.stopPropagation() // Prevent event bubbling to grid layout

        const canvas = canvasRef.current
        if (!canvas) return

        const { x, y } = getEventCoordinates(e)

        setIsDrawing(true)
        lastPointRef.current = { x, y }

        const drawingEvent: DrawingEvent = {
            type: "start",
            x,
            y,
            color,
            lineWidth,
            tool,
            userId: user?.id,
            timestamp: Date.now(),
        }
        sendDrawingEvent(drawingEvent)
    }

    const draw = (
        e:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing || isReceivingUpdateRef.current) return
        e.preventDefault()
        e.stopPropagation() // Prevent event bubbling to grid layout

        const canvas = canvasRef.current
        if (!canvas) return

        const { x, y } = getEventCoordinates(e)

        const ctx = canvas.getContext("2d")
        if (!ctx || !lastPointRef.current) return

        ctx.beginPath()
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
        ctx.lineTo(x, y)
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.lineCap = "round"
        ctx.globalCompositeOperation =
            tool === "eraser" ? "destination-out" : "source-over"
        ctx.stroke()

        const drawingEvent: DrawingEvent = {
            type: "draw",
            x,
            y,
            color,
            lineWidth,
            tool,
            userId: user?.id,
            timestamp: Date.now(),
        }
        sendDrawingEvent(drawingEvent)

        lastPointRef.current = { x, y }
    }

    const stopDrawing = (
        e?:
            | React.MouseEvent<HTMLCanvasElement>
            | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing || isReceivingUpdateRef.current) return
        if (e) {
            e.preventDefault()
            e.stopPropagation() // Prevent event bubbling to grid layout
        }

        setIsDrawing(false)
        lastPointRef.current = null

        const drawingEvent: DrawingEvent = {
            type: "end",
            userId: user?.id,
            timestamp: Date.now(),
        }
        sendDrawingEvent(drawingEvent)
    }

    const clearCanvas = () => {
        if (isReceivingUpdateRef.current) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const drawingEvent: DrawingEvent = {
            type: "clear",
            userId: user?.id,
            timestamp: Date.now(),
        }
        sendDrawingEvent(drawingEvent)
    }

    const colors = [
        "#000000",
        "#FFFFFF",
        "#FF0000",
        "#00FF00",
        "#0000FF",
        "#FFFF00",
        "#FF00FF",
        "#00FFFF",
        "#FFA500",
        "#800080",
        "#008000",
        "#000080",
        "#808080",
        "#FFB6C1",
        "#98FB98",
        "#87CEEB",
    ]

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    {/* Drawing Tools */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("pen")}
                                className={`h-8 w-8 p-0 rounded ${
                                    tool === "pen"
                                        ? "bg-blue-500 text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("eraser")}
                                className={`h-8 w-8 p-0 rounded ${
                                    tool === "eraser"
                                        ? "bg-red-500 text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                <Eraser className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Line Width */}
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Size:</span>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={lineWidth}
                                onChange={(e) =>
                                    setLineWidth(Number(e.target.value))
                                }
                                className="w-20"
                            />
                            <span className="text-sm text-gray-600 w-8">
                                {lineWidth}px
                            </span>
                        </div>
                    </div>

                    {/* Clear Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearCanvas}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                </div>

                {/* Color Palette */}
                <div className="mt-3 flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-gray-600" />
                    <div className="flex items-center space-x-1">
                        {colors.map((c) => (
                            <button
                                key={c}
                                className={`w-6 h-6 rounded border-2 transition-all ${
                                    color === c
                                        ? "border-gray-800 scale-110"
                                        : "border-gray-300 hover:scale-105"
                                }`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-6 h-6 rounded border-2 border-gray-300 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {/* Status */}
                <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                    />
                    {isConnected
                        ? connectionType === "canvas"
                            ? "Connected"
                            : "Connected (Fallback)"
                        : "Disconnected"}
                    {isConnected && (
                        <div className="flex items-center gap-1 ml-2">
                            <Users className="w-3 h-3" />
                            <span>Live</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Export memoized component for better performance
export const Canvas = memo(CanvasComponent)
