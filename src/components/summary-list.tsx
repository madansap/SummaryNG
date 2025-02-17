import { Summary } from "@/drizzle/schema";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface SummaryListProps {
  summaries: Summary[];
}

export function SummaryList({ summaries }: SummaryListProps) {
  if (summaries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No summaries yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {summaries.map((summary) => (
        <Link
          key={summary.id}
          href={`/dashboard/summary/${summary.id}`}
          className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="font-semibold text-lg mb-2 line-clamp-2">{summary.title}</h2>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {summary.url}
          </p>
          <div className="text-xs text-muted-foreground">
            Updated {formatDistanceToNow(new Date(summary.updatedAt))} ago
          </div>
        </Link>
      ))}
    </div>
  );
} 