import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { SummaryForm } from "@/components/summary-form";
import { SummaryList } from "@/components/summary-list";
import { db } from "@/lib/db";
import { summaries } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = auth();
  
  if (!userId) {
    return null; // Handled by middleware
  }

  const userSummaries = await db
    .select()
    .from(summaries)
    .where(eq(summaries.userId, userId))
    .orderBy(summaries.createdAt);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Article Summarizer
          </Link>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Your Summaries</h1>
            <Button asChild>
              <Link href="/dashboard/new">New Summary</Link>
            </Button>
          </div>
          <SummaryList summaries={userSummaries} />
        </div>
      </main>
    </div>
  );
}
