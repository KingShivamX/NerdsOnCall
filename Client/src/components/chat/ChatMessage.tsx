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
            className={`flex items-start space-x-3 ${
                message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
            }`}
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-r from-purple-600 to-blue-600"
                }`}
            >
                {message.role === "user" ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <Bot className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={`flex-1 max-w-3xl ${
                    message.role === "user" ? "text-right" : ""
                }`}
            >
                <div
                    className={`inline-block p-4 rounded-2xl ${
                        message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-800"
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
                                        <h1 className="text-lg font-bold mb-2 text-slate-800">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-base font-bold mb-2 text-slate-800">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-sm font-bold mb-1 text-slate-800">
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
                                        <li className="text-slate-700">
                                            {children}
                                        </li>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="font-semibold text-slate-800">
                                            {children}
                                        </strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="italic text-slate-700">
                                            {children}
                                        </em>
                                    ),
                                    code: ({ children, className }) => {
                                        const isInline =
                                            !className?.includes("language-")
                                        return isInline ? (
                                            <code className="bg-slate-200 px-1 py-0.5 rounded text-xs font-mono text-slate-800">
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-slate-800 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2">
                                                <code>{children}</code>
                                            </pre>
                                        )
                                    },
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 mb-2 bg-blue-50 py-2 rounded-r">
                                            {children}
                                        </blockquote>
                                    ),
                                    table: ({ children }) => (
                                        <div className="overflow-x-auto mb-2">
                                            <table className="min-w-full border border-slate-300 rounded">
                                                {children}
                                            </table>
                                        </div>
                                    ),
                                    th: ({ children }) => (
                                        <th className="border border-slate-300 px-3 py-2 bg-slate-200 font-semibold text-left">
                                            {children}
                                        </th>
                                    ),
                                    td: ({ children }) => (
                                        <td className="border border-slate-300 px-3 py-2">
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
                    className={`flex items-center mt-2 space-x-2 text-xs text-slate-500 ${
                        message.role === "user" ? "justify-end" : ""
                    }`}
                >
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    <Button
                        onClick={copyMessage}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-slate-200"
                    >
                        {copied ? (
                            <Check className="w-3 h-3 text-green-600" />
                        ) : (
                            <Copy className="w-3 h-3" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
