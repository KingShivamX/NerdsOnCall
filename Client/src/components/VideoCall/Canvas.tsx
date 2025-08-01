"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/Button"
import {
    Pencil,
    Eraser,
    Square,
    Circle,
    Type,
    Trash2,
    Undo,
    Redo,
    Palette,
    Users,
} from "lucide-react"

interface CanvasProps {
    sessionId: string
    user?: any
    onCanvasUpdate?: (canvasData: string) => void
    socket?: WebSocket | null
}

interface DrawingEvent {
    type: 'start' | 'draw' | 'end' | 'clear' | 'undo' | 'redo'
    x?: number
    y?: number
    tool?: string
    color?: string
    lineWidth?: number
    canvasData?: string
    userId?: string
    timestamp?: number
}

export function Canvas({
    sessionId,
    user,
    onCanvasUpdate,
    socket,
}: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [tool, setTool] = useState<
        "pen" | "eraser" | "rectangle" | "circle" | "text"
    >("pen")
    const [color, setColor] = useState("#000000")
    const [lineWidth, setLineWidth] = useState(3)
    const [history, setHistory] = useState<string[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [connectedUsers, setConnectedUsers] = useState<string[]>([])
    const [socketConnected, setSocketConnected] = useState(false)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastDrawEventRef = useRef<DrawingEvent | null>(null)
    const isReceivingUpdateRef = useRef(false)

    // Initialize canvas and set up real-time synchronization
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size to full container
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width
            canvas.height = rect.height

            // Set default styles
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth

            // Fill with white background
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Save initial state
        saveToHistory()

        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    // Monitor socket connection state
    useEffect(() => {
        const checkSocketConnection = () => {
            if (socket) {
                setSocketConnected(socket.readyState === WebSocket.OPEN)
            } else {
                setSocketConnected(false)
            }
        }

        // Check immediately
        checkSocketConnection()

        // Check periodically
        const interval = setInterval(checkSocketConnection, 1000)

        return () => clearInterval(interval)
    }, [socket])

    // Set up real-time whiteboard synchronization
    useEffect(() => {
        const handleWhiteboardUpdate = (event: CustomEvent) => {
            const message = event.detail
            console.log("🎨 Whiteboard event received:", message.type, message)

            if (message.type === "canvas_update" && message.userId !== user?.id) {
                console.log("🎨 Receiving canvas update from:", message.userId)
                applyRemoteDrawingEvent(message.data)
            } else if (message.type === "subscribed") {
                console.log("✅ Canvas component: Subscription confirmed")
                setSocketConnected(true)
            } else if (message.type === "connection_established") {
                console.log("✅ Canvas component: Connection established")
            }
        }

        // Listen for whiteboard updates from other users
        window.addEventListener('whiteboardUpdate', handleWhiteboardUpdate as EventListener)

        return () => {
            window.removeEventListener('whiteboardUpdate', handleWhiteboardUpdate as EventListener)
        }
    }, [user?.id])

    // Send drawing events to other users
    const sendDrawingEvent = useCallback((drawingEvent: DrawingEvent) => {
        console.log("🎨 Attempting to send drawing event:", drawingEvent.type, {
            socketExists: !!socket,
            socketState: socket?.readyState,
            socketStateText: socket?.readyState === 0 ? 'CONNECTING' :
                           socket?.readyState === 1 ? 'OPEN' :
                           socket?.readyState === 2 ? 'CLOSING' :
                           socket?.readyState === 3 ? 'CLOSED' : 'UNKNOWN',
            isReceiving: isReceivingUpdateRef.current,
            userId: user?.id,
            sessionId: sessionId
        })

        if (socket && socket.readyState === WebSocket.OPEN && !isReceivingUpdateRef.current) {
            const message = {
                type: "canvas_update",
                sessionId: sessionId,
                userId: user?.id,
                data: drawingEvent,
                timestamp: Date.now()
            }

            console.log("📤 Sending canvas update:", drawingEvent.type, message)
            try {
                socket.send(JSON.stringify(message))
                console.log("✅ Canvas update sent successfully")
            } catch (error) {
                console.error("❌ Error sending canvas update:", error)
            }
        } else {
            console.warn("❌ Cannot send drawing event - socket not ready", {
                socketExists: !!socket,
                socketState: socket?.readyState,
                isReceiving: isReceivingUpdateRef.current,
                reason: !socket ? 'No socket' :
                       socket.readyState !== WebSocket.OPEN ? 'Socket not open' :
                       isReceivingUpdateRef.current ? 'Currently receiving update' : 'Unknown'
            })
        }
    }, [socket, sessionId, user?.id])

    // Apply drawing events received from other users
    const applyRemoteDrawingEvent = useCallback((drawingEvent: DrawingEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        isReceivingUpdateRef.current = true

        try {
            switch (drawingEvent.type) {
                case 'start':
                    // Set up for remote drawing
                    ctx.strokeStyle = drawingEvent.color || "#000000"
                    ctx.lineWidth = drawingEvent.lineWidth || 3
                    ctx.globalCompositeOperation =
                        drawingEvent.tool === "eraser" ? "destination-out" : "source-over"
                    ctx.beginPath()
                    if (drawingEvent.x !== undefined && drawingEvent.y !== undefined) {
                        ctx.moveTo(drawingEvent.x, drawingEvent.y)
                    }
                    break

                case 'draw':
                    if (drawingEvent.x !== undefined && drawingEvent.y !== undefined) {
                        ctx.lineTo(drawingEvent.x, drawingEvent.y)
                        ctx.stroke()
                    }
                    break

                case 'end':
                    // Finalize the drawing
                    ctx.closePath()
                    break

                case 'clear':
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.fillStyle = "white"
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    break

                case 'undo':
                case 'redo':
                    if (drawingEvent.canvasData) {
                        const img = new Image()
                        img.onload = () => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height)
                            ctx.drawImage(img, 0, 0)
                        }
                        img.src = drawingEvent.canvasData
                    }
                    break
            }
        } catch (error) {
            console.error("Error applying remote drawing event:", error)
        } finally {
            isReceivingUpdateRef.current = false
        }
    }, [])

    useEffect(() => {
        // Listen for canvas updates from other users
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data)
                    if (
                        data.type === "canvas_update" &&
                        data.sessionId === sessionId &&
                        data.data
                    ) {
                        // Apply remote canvas update
                        const canvas = canvasRef.current
                        if (canvas) {
                            const ctx = canvas.getContext("2d")
                            if (ctx) {
                                const img = new Image()
                                img.onload = () => {
                                    ctx.clearRect(
                                        0,
                                        0,
                                        canvas.width,
                                        canvas.height
                                    )
                                    ctx.drawImage(img, 0, 0)
                                }
                                img.src = data.data
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error parsing canvas message:", error)
                }
            }

            socket.addEventListener("message", handleMessage)
            return () => socket.removeEventListener("message", handleMessage)
        }
    }, [socket, sessionId])

    const saveToHistory = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        try {
            const dataURL = canvas.toDataURL()
            const newHistory = history.slice(0, historyIndex + 1)
            newHistory.push(dataURL)
            setHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)

            // Broadcast to other users (with error handling)
            if (
                socket &&
                socket.readyState === WebSocket.OPEN &&
                onCanvasUpdate
            ) {
                try {
                    onCanvasUpdate(dataURL)
                    socket.send(
                        JSON.stringify({
                            type: "canvas_update",
                            sessionId,
                            userId: user?.id,
                            data: dataURL,
                            timestamp: Date.now(),
                        })
                    )
                } catch (socketError) {
                    console.warn("Failed to send canvas update:", socketError)
                }
            }
        } catch (error) {
            console.error("Error saving canvas history:", error)
        }
    }

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (isReceivingUpdateRef.current) return

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        setIsDrawing(true)

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth

        if (tool === "pen" || tool === "eraser") {
            ctx.globalCompositeOperation =
                tool === "eraser" ? "destination-out" : "source-over"
            ctx.beginPath()
            ctx.moveTo(x, y)

            // Send start drawing event to other users
            const drawingEvent: DrawingEvent = {
                type: 'start',
                x,
                y,
                tool,
                color,
                lineWidth,
                userId: user?.id,
                timestamp: Date.now()
            }
            sendDrawingEvent(drawingEvent)
            lastDrawEventRef.current = drawingEvent
        }
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isDrawing || isReceivingUpdateRef.current) return

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        if (tool === "pen" || tool === "eraser") {
            ctx.lineTo(x, y)
            ctx.stroke()

            // Send draw event to other users (throttled)
            const now = Date.now()
            if (!lastDrawEventRef.current || now - lastDrawEventRef.current.timestamp! > 16) { // ~60fps
                const drawingEvent: DrawingEvent = {
                    type: 'draw',
                    x,
                    y,
                    tool,
                    color,
                    lineWidth,
                    userId: user?.id,
                    timestamp: now
                }
                sendDrawingEvent(drawingEvent)
                lastDrawEventRef.current = drawingEvent
            }
        }
    }

    const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement>) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        if (!isDrawing || isReceivingUpdateRef.current) return
        setIsDrawing(false)

        // Send end drawing event to other users
        const drawingEvent: DrawingEvent = {
            type: 'end',
            userId: user?.id,
            timestamp: Date.now()
        }
        sendDrawingEvent(drawingEvent)

        // Debounce the save to prevent too frequent updates
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveToHistory()
        }, 300) // Wait 300ms before saving
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

        // Send clear event to other users
        const drawingEvent: DrawingEvent = {
            type: 'clear',
            userId: user?.id,
            timestamp: Date.now()
        }
        sendDrawingEvent(drawingEvent)

        saveToHistory()
    }

    const undo = () => {
        if (isReceivingUpdateRef.current || historyIndex <= 0) return

        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        const canvasData = history[newIndex]
        restoreFromHistory(canvasData)

        // Send undo event to other users
        const drawingEvent: DrawingEvent = {
            type: 'undo',
            canvasData,
            userId: user?.id,
            timestamp: Date.now()
        }
        sendDrawingEvent(drawingEvent)
    }

    const redo = () => {
        if (isReceivingUpdateRef.current || historyIndex >= history.length - 1) return

        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        const canvasData = history[newIndex]
        restoreFromHistory(canvasData)

        // Send redo event to other users
        const drawingEvent: DrawingEvent = {
            type: 'redo',
            canvasData,
            userId: user?.id,
            timestamp: Date.now()
        }
        sendDrawingEvent(drawingEvent)
    }

    const restoreFromHistory = (dataURL: string) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = new Image()
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
        }
        img.src = dataURL
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
            {/* Modern Toolbar */}
            <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-lg">
                <div className="flex items-center justify-between p-4">
                    {/* Left - Drawing Tools */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white rounded-xl p-1 shadow-md border border-gray-200">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("pen")}
                                className={`h-10 w-10 p-0 rounded-lg transition-all transform hover:scale-105 ${
                                    tool === "pen"
                                        ? "bg-blue-500 text-white shadow-lg hover:bg-blue-600 animate-pulse"
                                        : "hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                                }`}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("eraser")}
                                className={`h-10 w-10 p-0 rounded-lg transition-all transform hover:scale-105 ${
                                    tool === "eraser"
                                        ? "bg-red-500 text-white shadow-lg hover:bg-red-600 animate-pulse"
                                        : "hover:bg-red-50 text-gray-600 hover:text-red-600"
                                }`}
                            >
                                <Eraser className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center bg-white rounded-xl p-1 shadow-md border border-gray-200">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("rectangle")}
                                className={`h-10 w-10 p-0 rounded-lg transition-all transform hover:scale-105 ${
                                    tool === "rectangle"
                                        ? "bg-green-500 text-white shadow-lg hover:bg-green-600 animate-pulse"
                                        : "hover:bg-green-50 text-gray-600 hover:text-green-600"
                                }`}
                            >
                                <Square className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("circle")}
                                className={`h-10 w-10 p-0 rounded-lg transition-all ${
                                    tool === "circle"
                                        ? "bg-green-500 text-white shadow-md hover:bg-green-600"
                                        : "hover:bg-gray-200 text-gray-600"
                                }`}
                            >
                                <Circle className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTool("text")}
                                className={`h-10 w-10 p-0 rounded-lg transition-all ${
                                    tool === "text"
                                        ? "bg-purple-500 text-white shadow-md hover:bg-purple-600"
                                        : "hover:bg-gray-200 text-gray-600"
                                }`}
                            >
                                <Type className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Center - Brush Size */}
                    <div className="flex items-center space-x-4 bg-gray-50 rounded-xl px-6 py-3 border border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                            Brush Size:
                        </span>
                        <div className="flex items-center space-x-3">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={lineWidth}
                                onChange={(e) =>
                                    setLineWidth(Number(e.target.value))
                                }
                                className="w-32 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                                        (lineWidth / 20) * 100
                                    }%, #d1d5db ${
                                        (lineWidth / 20) * 100
                                    }%, #d1d5db 100%)`,
                                }}
                            />
                            <div className="bg-white border border-gray-300 rounded-lg px-3 py-1 min-w-[50px] text-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {lineWidth}px
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right - History Controls */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={undo}
                                disabled={historyIndex <= 0}
                                className="h-10 w-10 p-0 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={redo}
                                disabled={historyIndex >= history.length - 1}
                                className="h-10 w-10 p-0 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearCanvas}
                            className="h-10 px-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    </div>
                </div>

                {/* Color Palette */}
                <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                            <Palette className="h-4 w-4 text-gray-600 mr-2" />
                            <span className="text-sm font-medium text-gray-700 mr-4">
                                Colors:
                            </span>
                            <div className="flex items-center space-x-2">
                                {colors.map((c) => (
                                    <button
                                        key={c}
                                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 shadow-sm ${
                                            color === c
                                                ? "border-gray-800 shadow-lg scale-110 ring-2 ring-blue-200"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                        title={c}
                                    />
                                ))}
                                <div className="ml-2 pl-2 border-l border-gray-300">
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(e) =>
                                            setColor(e.target.value)
                                        }
                                        className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-all"
                                        title="Custom color"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative bg-white">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />

                {/* Canvas overlay info */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${
                            socketConnected
                                ? 'bg-green-500 animate-pulse'
                                : 'bg-orange-500 animate-pulse'
                        }`}></div>
                        <span>
                            {socketConnected
                                ? 'Live Whiteboard - Changes sync in real-time'
                                : 'Whiteboard - Connecting...'}
                        </span>
                        {socketConnected && (
                            <div className="flex items-center space-x-1 ml-2">
                                <Users className="w-3 h-3" />
                                <span className="text-xs">2</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Debug info - Remove in production */}
                <div className="absolute top-4 right-4 bg-black/80 text-white text-xs rounded px-2 py-1 font-mono max-w-xs">
                    <div>Socket: {socket ? '✅ exists' : '❌ null'}</div>
                    <div>State: {socket?.readyState ?? 'N/A'} ({
                        socket?.readyState === 0 ? 'CONNECTING' :
                        socket?.readyState === 1 ? 'OPEN' :
                        socket?.readyState === 2 ? 'CLOSING' :
                        socket?.readyState === 3 ? 'CLOSED' : 'UNKNOWN'
                    })</div>
                    <div>Connected: {socketConnected ? '✅ Yes' : '❌ No'}</div>
                    <div>User: {user?.id ?? 'N/A'}</div>
                    <div>Session: {sessionId}</div>
                    <div>Drawing: {isDrawing ? '✏️ Yes' : '⏸️ No'}</div>
                    <div>Receiving: {isReceivingUpdateRef.current ? '📥 Yes' : '📤 No'}</div>
                </div>
            </div>
        </div>
    )
}
