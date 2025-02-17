interface UsageStatsProps {
  credits: number;
}

export function UsageStats({ credits }: UsageStatsProps) {
  return (
    <div className="rounded-lg border p-4" data-oid="x5::3b2">
      <h2 className="text-lg font-semibold mb-2" data-oid="3vf6u7k">
        Credits Remaining
      </h2>
      <p className="text-3xl font-bold" data-oid="ozl_o0b">
        {credits}
      </p>
    </div>
  );
}
