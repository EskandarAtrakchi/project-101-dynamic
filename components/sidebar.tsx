"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Wifi, WifiOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: "/", label: "Home" },
  { href: "/equations", label: "Equations" },
  { href: "/calculate", label: "Calculate" },
  { href: "/charts", label: "Charts" },
  { href: "/net-worth", label: "Wallet Net-Worth" },
  { href: "/wallet-generate", label: "Wallet-Generate" },
  { href: "/portfolio", label: "Portfolio" },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const checkConnection = () => {
    toast({
      title: isOnline ? "Online" : "Offline",
      description: isOnline ? "You are connected to the internet" : "You are offline",
      variant: isOnline ? "default" : "destructive",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={onClose}>
              <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start">
                {item.label}
              </Button>
            </Link>
          ))}

          <div className="border-t pt-4">
            <Button variant="outline" onClick={checkConnection} className="w-full justify-start">
              {isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
              Check Connection
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
