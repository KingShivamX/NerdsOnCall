import { forwardRef } from "react"
import { cn } from "../../lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const avatarVariants = cva(
    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
    {
        variants: {
            size: {
                sm: "h-8 w-8",
                md: "h-10 w-10",
                lg: "h-12 w-12",
                xl: "h-16 w-16",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
)

export interface AvatarProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof avatarVariants> {
    src?: string
    alt?: string
    fallback?: string
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, size, src, alt, fallback, ...props }, ref) => {
        const initials =
            fallback ||
            alt
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() ||
            "?"

        return (
            <div
                ref={ref}
                className={cn(avatarVariants({ size, className }))}
                {...props}
            >
                {src ? (
                    <img
                        className="aspect-square h-full w-full object-cover"
                        src={src}
                        alt={alt}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-medium text-muted-foreground">
                            {initials}
                        </span>
                    </div>
                )}
            </div>
        )
    }
)

Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }
