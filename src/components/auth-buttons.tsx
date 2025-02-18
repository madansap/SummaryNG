"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export function SignInButton() {
  const router = useRouter();
  
  return (
    <Button
      variant="ghost"
      onClick={() => router.push('/sign-in')}
    >
      Sign In
    </Button>
  );
}

export function SignUpButton() {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.push('/sign-up')}
    >
      Get Started
    </Button>
  );
}

export function AuthButtons() {
  return (
    <div className="flex gap-4">
      <SignInButton />
      <SignUpButton />
    </div>
  );
}

export function SignUpCTA() {
  const router = useRouter();
  
  return (
    <Button
      size="lg"
      onClick={() => router.push('/sign-up')}
    >
      Get Started
    </Button>
  );
}
