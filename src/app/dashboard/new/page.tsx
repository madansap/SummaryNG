import { SummaryForm } from "@/components/summary-form";

export default function NewSummaryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Create New Summary</h1>
        <p className="text-gray-600 mb-6">Enter any article URL to get started with an AI-powered summary.</p>
        <SummaryForm />
      </div>
    </div>
  );
} 