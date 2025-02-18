import { SummaryForm } from "@/components/summary-form";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-semibold mb-2">Generate New Summary</h1>
      <p className="text-gray-600 mb-6">Enter any article URL to get started with an AI-powered summary.</p>
      <SummaryForm />
    </div>
  );
} 