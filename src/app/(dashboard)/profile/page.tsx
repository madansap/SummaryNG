'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Zap, Users } from "lucide-react";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default function ProfilePage() {
  const [stats, setStats] = useState({
    totalSummaries: 0,
    timeSaved: 0,
    aiEdits: 0,
    sharedWith: 0
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      try {
        const userSummaries = await db
          .select()
          .from(summaries)
          .where(eq(summaries.userId, session.user.id))
          .all();

        const totalSummaries = userSummaries.length;
        const timeSaved = totalSummaries * 0.5; // Assuming 30 mins saved per summary
        
        setStats({
          totalSummaries,
          timeSaved,
          aiEdits: Math.round(totalSummaries * 1.5), // Estimated AI edits
          sharedWith: 3 // This should come from your sharing system
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Profile Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Summaries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSummaries}</div>
            <p className="text-xs text-muted-foreground">
              Your total summaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeSaved}hrs</div>
            <p className="text-xs text-muted-foreground">
              Based on average reading time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Edits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.aiEdits}</div>
            <p className="text-xs text-muted-foreground">
              AI-powered refinements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared With</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sharedWith}</div>
            <p className="text-xs text-muted-foreground">
              Team members
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 