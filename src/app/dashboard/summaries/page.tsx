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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Summaries</h1>
      </div>
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function SummariesPage() {
  const { userId } = auth();
  
  if (!userId) return null;

  const userSummaries = await db
    .select()
    .from(summaries)
    .where(eq(summaries.userId, userId))
    .orderBy(desc(summaries.createdAt))
    .all() || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-6">All Summaries</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          {userSummaries.map((summary) => (
            <Link
              key={summary.id}
              href={`/dashboard/summary/${summary.id}`}
              className="block p-4 rounded-lg border hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium line-clamp-1">{summary.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {summary.url}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(summary.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 