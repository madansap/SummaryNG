"use client"

import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Article Summarizer
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
} 