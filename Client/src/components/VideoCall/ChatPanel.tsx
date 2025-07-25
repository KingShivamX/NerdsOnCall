"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send, X } from "lucide-react"

interface Message {
    id: string
    userId: number
    userName: string
    message: string
    timestamp: Date
    type: "text" | "system"
}

interface ChatPanelProps {
    sessionId: string
    isOpen: boolean
    onClose: () => void
    socket?: WebSocket | null
}

export function ChatPanel({
    sessionId,
    isOpen,
    onClose,
    socket,
}: ChatPanelProps) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (socket) {
            const handleMessage = (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data)
                    if (data.type === "chat_message") {
                        const message: Message = {
                            id: data.id || Date.now().toString(),
                            userId: data.userId,
                            userName: data.userName,
                            message: data.message,
                            timestamp: new Date(data.timestamp),
                            type: "text",
                        }
                        setMessages((prev) => [...prev, message])
                    } else if (data.type === "user_typing") {
                        setIsTyping(data.userId !== user?.id)
                        setTimeout(() => setIsTyping(false), 3000)
                    }
                } catch (error) {
                    console.error("Error parsing chat message:", error)
                }
            }

            socket.addEventListener("message", handleMessage)
            return () => socket.removeEventListener("message", handleMessage)
        }
    }, [socket, user?.id])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const sendMessage = () => {
        if (!newMessage.trim() || !socket || !user) return

        const message = {
            type: "chat_message",
            sessionId,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            message: newMessage.trim(),
            timestamp: new Date().toISOString(),
            id: Date.now().toString(),
        }

        socket.send(JSON.stringify(message))
        setNewMessage("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const handleTyping = () => {
        if (socket && user) {
            socket.send(
                JSON.stringify({
                    type: "user_typing",
                    sessionId,
                    userId: user.id,
                    userName: `${user.firstName} ${user.lastName}`,
                })
            )
        }
    }

    if (!isOpen) return null

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Chat</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-8">
                        <p>No messages yet.</p>
                        <p>Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.userId === user?.id
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                    message.userId === user?.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {message.userId !== user?.id && (
                                    <div className="text-xs font-medium mb-1 opacity-75">
                                        {message.userName}
                                    </div>
                                )}
                                <div className="text-sm">{message.message}</div>
                                <div
                                    className={`text-xs mt-1 opacity-75 ${
                                        message.userId === user?.id
                                            ? "text-blue-100"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-2">
                    <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value)
                            handleTyping()
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
