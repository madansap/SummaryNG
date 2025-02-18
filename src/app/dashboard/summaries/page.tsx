'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SummaryList } from "@/components/summary-list";

interface Summary {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
}

export default function SummariesPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchSummaries = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
        return;
      }

      const { data } = await supabase
        .from('summaries')
        .select('*')
        .order('updated_at', { ascending: false });

      setSummaries(data || []);
    };

    fetchSummaries();
  }, [router, supabase]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-6">All Summaries</h1>
        <SummaryList summaries={summaries} />
      </div>
    </div>
  );
} 