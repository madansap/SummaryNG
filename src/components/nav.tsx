"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Nav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  return (
    <header className="border-b" data-oid="k0t:dgl">
      <nav
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        data-oid="m7r95ga"
      >
        <Link href="/" className="text-xl font-bold" data-oid="d55-c9o">
          Article Summarizer
        </Link>
        {isSignedIn ? (
          <div className="flex items-center gap-4" data-oid="96jlq5z">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/dashboard"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
              data-oid="dwjtkv-"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" data-oid="p5sreqg" />
          </div>
        ) : (
          <div className="flex gap-4" data-oid="-be1yng">
            <Link href="/sign-in" data-oid=".os8te7">
              <Button variant="ghost" data-oid="2gmd34p">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" data-oid="rz.s5qh">
              <Button data-oid="39xaib9">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
