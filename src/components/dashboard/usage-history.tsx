interface UsageHistoryProps {
  logs: {
    url: string;
    createdAt: Date;
  }[];
}

export function UsageHistory({ logs }: UsageHistoryProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Summaries</h2>
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div key={index} className="flex justify-between items-center">
            <a 
              href={log.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline truncate max-w-[80%]"
            >
              {log.url}
            </a>
            <span className="text-sm text-muted-foreground">
              {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
} 