"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Music } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"

interface NavbarProps {
  onMenuClick: () => void
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

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="https://cliply.co/wp-content/uploads/2021/02/372102230_BITCOIN_400px.gif"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-bold text-xl hidden sm:block">Crypto Dashboard</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={pathname === item.href ? "default" : "ghost"} size="sm" className="text-sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/chilling">
              <Button variant="outline" size="sm">
                <Music className="h-4 w-4 mr-2" />
                Chilling
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
