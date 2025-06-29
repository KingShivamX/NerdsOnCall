import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours > 0) {
        return `${hours}h ${mins}m`
    }
    return `${mins}m`
}

export function formatSubject(subject: string): string {
    return subject
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function generateSessionId(): string {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    )
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
}

export function getRelativeTime(date: string | Date): string {
    const now = new Date()
    const then = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ]

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds)
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
        }
    }

    return "Just now"
}

export function isValidSessionTime(
    startTime: string,
    endTime?: string
): boolean {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    return start <= end
}

export function calculateSessionCost(
    hourlyRate: number,
    durationMinutes: number
): number {
    return (hourlyRate * durationMinutes) / 60
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        OPEN: "bg-blue-100 text-blue-800",
        ASSIGNED: "bg-yellow-100 text-yellow-800",
        IN_PROGRESS: "bg-green-100 text-green-800",
        RESOLVED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        PENDING: "bg-yellow-100 text-yellow-800",
        ACTIVE: "bg-green-100 text-green-800",
        COMPLETED: "bg-blue-100 text-blue-800",
        TIMEOUT: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
}

export function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
        LOW: "bg-gray-100 text-gray-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HIGH: "bg-orange-100 text-orange-800",
        URGENT: "bg-red-100 text-red-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
}

export function generateAvatarUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=random&size=200`
}
