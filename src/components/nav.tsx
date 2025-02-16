"use client"

import Link from "next/link"
import { UserButton, useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Nav() {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Article Summarizer
        </Link>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
} 