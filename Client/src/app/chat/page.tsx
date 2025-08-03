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
        <div className="h-screen flex flex-col bg-orange-100">
            <Navbar />

            {/* Chat Container */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-black border-b-4 border-black px-4 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-cyan-300 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center">
                                <Bot className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <div className="text-white font-black text-xl uppercase tracking-wide">
                                    NerdsOnCall AI Assistant
                                </div>
                                <div className="flex items-center space-x-3 text-sm text-white font-bold">
                                    <div className="w-3 h-3 bg-green-400 border border-black"></div>
                                    <span className="uppercase tracking-wide">
                                        Online
                                    </span>
                                    {user && (
                                        <>
                                            <span>•</span>
                                            <span className="uppercase tracking-wide">
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
                            className="bg-red-400 hover:bg-red-500 text-black border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all font-black uppercase tracking-wide"
                            disabled={messages.length === 0}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Chat
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden bg-yellow-100 border-4 border-black">
                    <div className="h-full max-w-4xl mx-auto flex flex-col">
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                            {messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    message={message}
                                />
                            ))}

                            {isLoading && (
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-black border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-cyan-300" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_black]">
                                            <div className="flex items-center space-x-3">
                                                <Loader2 className="w-5 h-5 animate-spin text-black" />
                                                <span className="text-black text-sm font-bold uppercase tracking-wide">
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
                            <div className="px-6 py-6 border-t-4 border-black bg-pink-100">
                                <p className="text-lg text-black mb-4 font-black uppercase tracking-wide">
                                    Quick Start Prompts:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {quickPrompts.map((prompt, index) => (
                                        <Button
                                            key={index}
                                            onClick={() =>
                                                sendMessage(prompt.prompt)
                                            }
                                            className="justify-start h-auto p-4 text-left bg-white hover:bg-gray-100 border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all"
                                            disabled={isLoading}
                                        >
                                            <prompt.icon className="w-5 h-5 mr-3 text-black flex-shrink-0" />
                                            <span className="text-sm text-black font-bold">
                                                {prompt.text}
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="border-t-4 border-black px-6 bg-green-100">
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
