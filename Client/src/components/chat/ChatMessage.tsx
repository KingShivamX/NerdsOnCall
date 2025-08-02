"use client"

import { useState } from "react"
import { Bot, User, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { toast } from "react-hot-toast"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import type { ChatMessage as ChatMessageType } from "@/hooks/useChat"

interface ChatMessageProps {
    message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
    const [copied, setCopied] = useState(false)

    const copyMessage = async () => {
        try {
            await navigator.clipboard.writeText(message.content)
            setCopied(true)
            toast.success("Message copied to clipboard")
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            toast.error("Failed to copy message")
        }
    }

    return (
        <div
            className={`flex items-start space-x-4 ${
                message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
            }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-12 h-12 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center ${
                    message.role === "user" ? "bg-pink-300" : "bg-cyan-300"
                }`}
            >
                {message.role === "user" ? (
                    <User className="w-6 h-6 text-black" />
                ) : (
                    <Bot className="w-6 h-6 text-black" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={`flex-1 max-w-3xl ${
                    message.role === "user" ? "text-right" : ""
                }`}
            >
                <div
                    className={`inline-block p-4 border-3 border-black shadow-[4px_4px_0px_0px_black] ${
                        message.role === "user"
                            ? "bg-pink-200 text-black"
                            : "bg-white text-black"
                    }`}
                >
                    {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    p: ({ children }) => (
                                        <p className="mb-2 last:mb-0">
                                            {children}
                                        </p>
                                    ),
                                    h1: ({ children }) => (
                                        <h1 className="text-lg font-black mb-2 text-black uppercase tracking-wide">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-base font-black mb-2 text-black uppercase tracking-wide">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-sm font-black mb-1 text-black uppercase tracking-wide">
                                            {children}
                                        </h3>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-2 space-y-1">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-2 space-y-1">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-black font-bold">
                                            {children}
                                        </li>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-black text-black">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-black font-bold">
                                            {children}
                                        </em>
                                    ),
                                    code: ({ children, className }) => {
                                        const isInline =
                                            !className?.includes("language-")
                                        return isInline ? (
                                            <code className="bg-yellow-300 px-2 py-1 border border-black text-xs font-mono text-black font-bold">
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-black text-white p-4 border-3 border-black shadow-[4px_4px_0px_0px_black] text-xs font-mono overflow-x-auto mb-2">
                                                <code>{children}</code>
                                            </pre>
                                        )
                                    },
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-black pl-4 italic text-black mb-2 bg-cyan-200 py-2 border-r border-t border-b font-bold">
                                            {children}
                                        </blockquote>
                                    ),
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto mb-2">
                                            <table className="min-w-full border-3 border-black shadow-[4px_4px_0px_0px_black]">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    th: ({ children }) => (
                                        <th className="border border-black px-3 py-2 bg-yellow-300 font-black text-left uppercase tracking-wide">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="border border-black px-3 py-2 font-bold">
                                            {children}
                                        </td>
                                    ),
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                </div>

                {/* Message Actions */}
                <div
                    className={`flex items-center mt-3 space-x-3 text-xs text-black font-bold ${
                        message.role === "user" ? "justify-end" : ""
                    }`}
                >
                    <span className="uppercase tracking-wide">
                        {message.timestamp.toLocaleTimeString()}
                    </span>
                    <Button
                        onClick={copyMessage}
                        className="h-6 w-6 p-0 bg-green-300 hover:bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_black] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_black] transition-all"
                    >
                        {copied ? (
                            <Check className="w-3 h-3 text-black" />
                        ) : (
                            <Copy className="w-3 h-3 text-black" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
