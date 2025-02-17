import { auth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/dashboard/sidebar";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  
  if (!userId) return null;

  const userSummaries = await db
    .select()
    .from(summaries)
    .where(eq(summaries.userId, userId))
    .orderBy(desc(summaries.createdAt))
    .all() || [];

  return (
    <div className="flex h-screen">
      <Sidebar summaries={userSummaries} />
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white">
          <div className="h-full px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Article Summarizer</h1>
            <UserButton />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 