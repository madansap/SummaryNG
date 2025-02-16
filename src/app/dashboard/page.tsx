import Link from "next/link"
import { SummaryForm } from "@/components/summary-form"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Article Summarizer
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold">Generate Summary</h1>
          <SummaryForm />
        </div>
      </main>
    </div>
  )
} 