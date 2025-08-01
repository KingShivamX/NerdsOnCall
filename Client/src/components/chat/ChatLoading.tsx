"use client"

import { Bot, Loader2 } from "lucide-react"

export function ChatLoading() {
    return (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
                <div className="inline-block p-4 rounded-2xl bg-slate-100">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                        <span className="text-slate-600">
                            AI is thinking...
                        </span>
                        <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                            <div
                                className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                                className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
