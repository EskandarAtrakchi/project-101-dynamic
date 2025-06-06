"use client"

export function EncryptionAnimation() {
  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 animate-spin">
        <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
      <div className="absolute inset-4 animate-pulse">
        <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}
