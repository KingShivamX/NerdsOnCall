"use client"

import { Bot } from "lucide-react"
import { BlockLoader } from "@/components/ui/Loader"

export function ChatLoading() {
    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-cyan-300 border-3 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center">
                <Bot className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1">
                <div className="inline-block p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_black]">
                    <div className="flex items-center space-x-3">
                        <BlockLoader size="sm" />
                        <span className="text-black font-bold uppercase tracking-wide">
                            AI is thinking...
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
