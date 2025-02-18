'use client';

import { SummaryView } from '@/components/SummaryView';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Summary {
  id: string;
  title: string;
  content: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export default function SummaryPage() {
  const params = useParams();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch summary data using the ID from params
    const fetchSummary = async () => {
      try {
        const response = await fetch(`/api/summaries/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!summary) {
    return <div className="p-6">Summary not found</div>;
  }

  return <SummaryView summary={summary} />;
} 