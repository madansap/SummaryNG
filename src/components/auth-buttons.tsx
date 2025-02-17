"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  return (
    <div className="flex gap-4" data-oid="l1_92:-">
      <SignInButton data-oid=".7w_vch">
        <Button variant="ghost" data-oid="9thb:wv">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton data-oid="id48_.o">
        <Button data-oid="0ek.6mt">Get Started</Button>
      </SignUpButton>
    </div>
  );
}

export function SignUpCTA() {
  return (
    <SignUpButton data-oid="yy7e8ev">
      <Button size="lg" data-oid="0zxpkf9">
        Try for Free
      </Button>
    </SignUpButton>
  );
}
