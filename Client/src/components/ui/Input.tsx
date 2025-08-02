import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex w-full bg-white text-black font-semibold text-base border-3 border-black shadow-[4px_4px_0px_0px_black] px-4 py-3.5 transition-all duration-100 outline-none placeholder:text-gray-500 placeholder:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-black",
                "focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[6px_6px_0px_0px_black] focus:border-blue-500",
                "hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_black]",
                className
            )}
            {...props}
        />
    )
}

export { Input }
