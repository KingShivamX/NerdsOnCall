"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { BlockLoader } from "@/components/ui/Loader"
import { Send } from "lucide-react"

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
        <div className="py-6">
            <form onSubmit={handleSubmit} className="flex space-x-4 mb-4">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 border-3 border-black shadow-[4px_4px_0px_0px_black] h-12 px-4 font-bold text-black placeholder:text-gray-600 focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_black] transition-all"
                    disabled={isLoading}
                    maxLength={1000}
                />
                <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="px-6 h-12 bg-cyan-300 hover:bg-cyan-400 text-black border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] transition-all font-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <BlockLoader size="sm" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </Button>
            </form>

            <div className="flex items-center justify-between text-xs">
                <p className="text-black font-bold uppercase tracking-wide">
                    AI responses may contain errors. Always verify important
                    information.
                </p>
                <p className="text-black font-black font-mono bg-yellow-300 px-2 py-1 border border-black">
                    {input.length}/1000
                </p>
            </div>
        </div>
    )
}
