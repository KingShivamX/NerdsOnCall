import { Crown, Sparkles } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center hero-background">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto rounded-full royal-gradient flex items-center justify-center animate-pulse">
                        <Crown className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8">
                        <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
                    </div>

                    {/* Orbiting circles */}
                    <div className="absolute inset-0 animate-spin">
                        <div className="w-32 h-32 border-4 border-transparent border-t-purple-400 rounded-full"></div>
                    </div>
                    <div
                        className="absolute inset-2 animate-spin"
                        style={{
                            animationDirection: "reverse",
                            animationDuration: "2s",
                        }}
                    >
                        <div className="w-28 h-28 border-4 border-transparent border-r-yellow-400 rounded-full"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold royal-text mb-2">
                    Loading Your Premium Experience
                </h2>
                <p className="text-gray-600 mb-8">
                    Preparing the royal treatment for your learning journey...
                </p>

                {/* Loading Bar */}
                <div className="w-64 mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full royal-gradient rounded-full animate-pulse shimmer"></div>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
                <div
                    className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "2s" }}
                ></div>
                <div
                    className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-yellow-400 rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "3s" }}
                ></div>
            </div>
        </div>
    )
}
