"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <SignInButton>
        <Button variant="ghost">Sign In</Button>
      </SignInButton>
      <SignUpButton>
        <Button>Get Started</Button>
      </SignUpButton>
    </div>
  )
}

export function SignUpCTA() {
  return (
    <SignUpButton>
      <Button size="lg">Try for Free</Button>
    </SignUpButton>
  )
} 