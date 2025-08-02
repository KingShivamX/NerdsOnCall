import React from 'react'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        {/* Three bouncing dots */}
        <div className="flex items-center justify-center space-x-1 w-full h-full">
          <div 
            className="w-2 h-2 bg-black border border-black animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '1000ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-black border border-black animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '1000ms' }}
          ></div>
          <div 
            className="w-2 h-2 bg-black border border-black animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '1000ms' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

// Alternative pulsing loader
export const PulseLoader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-black border-2 border-black animate-pulse"></div>
        <div 
          className="absolute inset-1 bg-white animate-pulse"
          style={{ animationDelay: '500ms' }}
        ></div>
      </div>
    </div>
  )
}

// Neubrutalism style loader with moving blocks
export const BlockLoader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          <div 
            className="bg-cyan-300 border-2 border-black animate-pulse"
            style={{ animationDelay: '0ms', animationDuration: '800ms' }}
          ></div>
          <div 
            className="bg-pink-300 border-2 border-black animate-pulse"
            style={{ animationDelay: '200ms', animationDuration: '800ms' }}
          ></div>
          <div 
            className="bg-yellow-300 border-2 border-black animate-pulse"
            style={{ animationDelay: '400ms', animationDuration: '800ms' }}
          ></div>
          <div 
            className="bg-green-300 border-2 border-black animate-pulse"
            style={{ animationDelay: '600ms', animationDuration: '800ms' }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default Loader
