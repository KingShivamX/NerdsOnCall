"use client"

import { useRef, useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { useChat } from "@/hooks/useChat"
import {
    Bot,
    Trash2,
    Loader2,
    BookOpen,
    Calculator,
    Lightbulb,
    MessageSquare,
} from "lucide-react"
import { toast } from "react-hot-toast"
import "katex/dist/katex.min.css"

export default function ChatPage() {
    const { user } = useAuth()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { messages, isLoading, sendMessage, clearMessages } = useChat({
        userRole: user?.role || "student",
        onError: (error) => toast.error(error),
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleClearChat = () => {
        clearMessages()
        toast.success("Chat cleared")
    }

    const quickPrompts = [
        {
            icon: Calculator,
            text: "Explain quadratic equations",
            prompt: "Can you explain quadratic equations with step-by-step examples and show me the quadratic formula?",
        },
        {
            icon: BookOpen,
            text: "Study tips for exams",
            prompt: "What are some effective study strategies for preparing for exams? Include memory techniques and time management.",
        },
        {
            icon: Lightbulb,
            text: "Physics concepts",
            prompt: "Help me understand Newton's laws of motion with real-world examples and mathematical formulations.",
        },
        {
            icon: MessageSquare,
            text: "Teaching strategies",
            prompt: "What are some effective online teaching strategies for engaging students in virtual classrooms?",
        },
    ]

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Chat Container */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 shadow-sm">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-white font-medium text-base">
                                    NerdsOnCall AI Assistant
                                </h1>
                                <div className="flex items-center space-x-2 text-xs text-white/80">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Online</span>
                                    {user && (
                                        <>
                                            <span>•</span>
                                            <span>
                                                {user.role === "STUDENT"
                                                    ? "Student"
                                                    : "Tutor"}{" "}
                                                Mode
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleClearChat}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 transition-colors"
                            disabled={messages.length === 0}
                        >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden bg-white">
                    <div className="h-full max-w-4xl mx-auto flex flex-col">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                />
                            ))}

                            {isLoading && (
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block p-3 rounded-xl bg-slate-100">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                                                <span className="text-slate-600 text-sm">
                                                    AI is thinking...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Prompts */}
                        {messages.length === 0 && !isLoading && (
                            <div className="px-6 py-4 border-t border-slate-200">
                                <p className="text-sm text-slate-600 mb-3 font-medium">
                                    Quick start prompts:
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickPrompts.map((prompt, index) => (
                                        <Button
                                            key={index}
                                            onClick={() =>
                                                sendMessage(prompt.prompt)
                                            }
                                            variant="ghost"
                                            className="justify-start h-auto p-3 text-left hover:bg-slate-50 transition-colors border border-slate-200 rounded-lg"
                                            disabled={isLoading}
                                        >
                                            <prompt.icon className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                                            <span className="text-sm text-slate-700">
                                                {prompt.text}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="border-t border-slate-200 px-6">
                            <ChatInput
                                onSendMessage={sendMessage}
                                isLoading={isLoading}
                                placeholder="Ask me anything about your studies..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
