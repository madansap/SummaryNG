"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Button } from "./ui/button";

export function Nav() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="border-b" data-oid="k0t:dgl">
      <nav
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        data-oid="m7r95ga"
      >
        <Link href="/" className="text-xl font-bold" data-oid="d55-c9o">
          Article Summarizer
        </Link>
        {user && (
          <div className="flex items-center gap-4" data-oid="96jlq5z">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:text-primary"
              data-oid="dwjtkv-"
            >
              Dashboard
            </Link>
            <Button variant="ghost" onClick={handleSignOut} data-oid="p5sreqg">
              Sign Out
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
