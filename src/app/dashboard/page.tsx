import { SummaryForm } from "@/components/summary-form";

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Generate New Summary</h1>
        <SummaryForm />
      </div>
    </div>
  );
}
