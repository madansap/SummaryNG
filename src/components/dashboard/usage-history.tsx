interface UsageHistoryProps {
  logs: {
    url: string;
    createdAt: Date;
  }[];
}

export function UsageHistory({ logs }: UsageHistoryProps) {
  return (
    <div className="rounded-lg border p-4" data-oid="ckira05">
      <h2 className="text-lg font-semibold mb-4" data-oid="b7k.po-">
        Recent Summaries
      </h2>
      <div className="space-y-4" data-oid="ysopc32">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex justify-between items-center"
            data-oid="grcw7.q"
          >
            <a
              href={log.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline truncate max-w-[80%]"
              data-oid="uagge9n"
            >
              {log.url}
            </a>
            <span className="text-sm text-muted-foreground" data-oid="v9ir0tf">
              {new Date(log.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
