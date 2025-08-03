import { Subscription } from "@/types"

/**
 * Check if a subscription is currently valid (active and not expired)
 */
export function isSubscriptionValid(
    subscription: Subscription | null
): boolean {
    if (!subscription) {
        return false
    }

    // Check if status is active
    if (subscription.status !== "ACTIVE") {
        return false
    }

    // Check if subscription has not expired
    const now = new Date()
    const endDate = new Date(subscription.endDate)
    const startDate = new Date(subscription.startDate)

    return now >= startDate && now <= endDate
}

/**
 * Check if a subscription is expired
 */
export function isSubscriptionExpired(
    subscription: Subscription | null
): boolean {
    if (!subscription) {
        return false
    }

    const now = new Date()
    const endDate = new Date(subscription.endDate)

    return now > endDate
}

/**
 * Get subscription status display text
 */
export function getSubscriptionStatusText(
    subscription: Subscription | null
): string {
    if (!subscription) {
        return "No Active Plan"
    }

    if (isSubscriptionExpired(subscription)) {
        return "Expired"
    }

    if (subscription.status === "ACTIVE" && isSubscriptionValid(subscription)) {
        return "Active"
    }

    return subscription.status
}

/**
 * Get subscription status variant for badges
 */
export function getSubscriptionStatusVariant(
    subscription: Subscription | null
): "default" | "secondary" | "destructive" {
    if (!subscription) {
        return "destructive"
    }

    if (isSubscriptionExpired(subscription)) {
        return "destructive"
    }

    if (subscription.status === "ACTIVE" && isSubscriptionValid(subscription)) {
        return "secondary"
    }

    return "destructive"
}

/**
 * Get days remaining in subscription
 */
export function getDaysRemaining(subscription: Subscription | null): number {
    if (!subscription || !isSubscriptionValid(subscription)) {
        return 0
    }

    const now = new Date()
    const endDate = new Date(subscription.endDate)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
}

/**
 * Format subscription display text with plan name and status
 */
export function formatSubscriptionDisplay(
    subscription: Subscription | null
): string {
    if (!subscription) {
        return "No Active Plan"
    }

    // Check if subscription is valid and has proper dates
    if (!subscription.endDate) {
        return "Invalid Subscription"
    }

    // Calculate days remaining with proper validation
    const endDate = new Date(subscription.endDate)
    const currentDate = new Date()
    const timeDiff = endDate.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))

    // Hard-coded format: just show days remaining
    if (daysRemaining > 0) {
        return `${daysRemaining} days left`
    } else if (daysRemaining === 0) {
        return "Expires today"
    } else {
        return "Expired"
    }
}
