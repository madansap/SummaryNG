'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import { Sidebar } from "@/components/dashboard/sidebar";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  const userSummaries = await db
    .select()
    .from(summaries)
    .where(eq(summaries.userId, supabase.auth.getUser().data.user.id))
    .orderBy(desc(summaries.createdAt))
    .all() || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <div className="flex h-screen">
        <Sidebar summaries={userSummaries} />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 