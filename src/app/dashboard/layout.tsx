'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/header';
import { Sidebar } from "@/components/dashboard/sidebar";

interface Summary {
  id: string;
  title: string;
  content: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [summaries, setSummaries] = useState<Summary[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
        return;
      }

      // Fetch summaries
      const { data: summariesData } = await supabase
        .from('summaries')
        .select('*')
        .order('created_at', { ascending: false });

      setSummaries(summariesData || []);
    };

    checkAuth();
  }, [router, supabase]);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      <div className="flex h-screen">
        <Sidebar summaries={summaries} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 