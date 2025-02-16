interface UsageStatsProps {
  credits: number;
}

export function UsageStats({ credits }: UsageStatsProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-2">Credits Remaining</h2>
      <p className="text-3xl font-bold">{credits}</p>
    </div>
  )
} 