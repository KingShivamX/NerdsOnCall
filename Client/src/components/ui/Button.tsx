import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wide transition-all duration-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border-3 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_black] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_black] focus-visible:outline-3 focus-visible:outline-red-500 focus-visible:outline-offset-2",
    {
        variants: {
            variant: {
                default: "bg-blue-500 text-white hover:bg-blue-500",
                destructive: "bg-red-500 text-white hover:bg-red-500",
                outline: "bg-white text-black hover:bg-orange-200",
                secondary: "bg-green-400 text-black hover:bg-green-400",
                ghost: "bg-transparent text-black hover:bg-orange-200",
                link: "bg-transparent text-black underline underline-offset-4 hover:bg-transparent shadow-none hover:shadow-none border-0 hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0",
                yellow: "bg-yellow-400 text-black hover:bg-yellow-400",
                pink: "bg-pink-400 text-black hover:bg-pink-400",
                purple: "bg-purple-400 text-black hover:bg-purple-400",
                orange: "bg-orange-400 text-black hover:bg-orange-400",
                cyan: "bg-cyan-400 text-black hover:bg-cyan-400",
                lime: "bg-lime-400 text-black hover:bg-lime-400",
            },
            size: {
                default: "px-7 py-3.5",
                sm: "px-5 py-2.5 text-xs",
                lg: "px-8 py-4 text-base",
                icon: "w-12 h-12 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
