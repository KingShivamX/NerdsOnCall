"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Send, Loader2 } from "lucide-react"

interface ChatInputProps {
    onSendMessage: (message: string) => void
    isLoading: boolean
    placeholder?: string
}

export function ChatInput({
    onSendMessage,
    isLoading,
    placeholder = "Ask me anything...",
}: ChatInputProps) {
    const [input, setInput] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        onSendMessage(input.trim())
        setInput("")
        inputRef.current?.focus()
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as any)
        }
    }

    return (
        <div className="py-4">
            <form onSubmit={handleSubmit} className="flex space-x-3 mb-2">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                    disabled={isLoading}
                    maxLength={1000}
                />
                <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-4 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </Button>
            </form>

            <div className="flex items-center justify-between text-xs">
                <p className="text-slate-500">
                    AI responses may contain errors. Always verify important
                    information.
                </p>
                <p className="text-slate-400 font-mono">{input.length}/1000</p>
            </div>
        </div>
    )
}
