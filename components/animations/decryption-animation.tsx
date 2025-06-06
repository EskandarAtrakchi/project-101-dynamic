"use client"

export function DecryptionAnimation() {
  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 border-2 border-primary rounded-full animate-ping"
            style={{
              animationDelay: `${i * 0.5}s`,
              animationDuration: "2s",
            }}
          ></div>
        ))}
      </div>
      <div className="absolute inset-8 bg-primary/10 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
