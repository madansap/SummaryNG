import { auth } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Zap, Users } from "lucide-react";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
  const { userId } = auth();
  
  if (!userId) return null;

  const userSummaries = await db
    .select()
    .from(summaries)
    .where(eq(summaries.userId, userId))
    .all();

  const totalSummaries = userSummaries.length;
  const timeSaved = totalSummaries * 0.5; // Assuming 30 mins saved per summary
  const aiEdits = 15; // This should come from your database
  const sharedWith = 3; // This should come from your database

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
            <div className="text-2xl font-bold">{totalSummaries}</div>
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
            <div className="text-2xl font-bold">{timeSaved}hrs</div>
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
            <div className="text-2xl font-bold">{aiEdits}</div>
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
            <div className="text-2xl font-bold">{sharedWith}</div>
            <p className="text-xs text-muted-foreground">
              Team members
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 