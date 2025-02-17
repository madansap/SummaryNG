"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="border-b" data-oid="gm5au.u">
      <div
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        data-oid="3re836t"
      >
        <Link href="/" className="text-xl font-bold" data-oid="lkyzn0y">
          Article Summarizer
        </Link>
        <UserButton afterSignOutUrl="/" data-oid="8ab8t7d" />
      </div>
    </header>
  );
}
