import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Zap, BarChart } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) return null;

  const userSummaries = await db
    .select()
    .from(summaries)
    .where(eq(summaries.userId, userId))
    .all();

  const totalSummaries = userSummaries.length;
  const timeSaved = totalSummaries * 15; // Assuming 15 minutes saved per summary
  const recentSummaries = userSummaries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Link 
          href="/dashboard/new"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create New Summary
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Summaries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSummaries}</div>
            <p className="text-xs text-muted-foreground">
              Articles summarized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeSaved} min</div>
            <p className="text-xs text-muted-foreground">
              Total reading time saved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Edits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalSummaries * 1.5)}</div>
            <p className="text-xs text-muted-foreground">
              AI-powered refinements
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Length</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 min</div>
            <p className="text-xs text-muted-foreground">
              Average reading time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Summaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSummaries.map(summary => (
                <Link 
                  key={summary.id}
                  href={`/dashboard/summary/${summary.id}`}
                  className="block p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium line-clamp-1">{summary.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created {formatDistanceToNow(new Date(summary.createdAt))} ago
                  </p>
                </Link>
              ))}
              {recentSummaries.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No summaries yet. Create your first one!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Effective Summaries</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Use AI editing to refine and customize your summaries for different purposes.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Sharing & Collaboration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Download summaries as images to easily share them with your team.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-medium">Stay Organized</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep track of your summaries and access them anytime from the All Summaries section.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
