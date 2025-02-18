'use client';

import { formatDate } from '@/utils/formatDate';

export function LocalizedDate({ date }: { date: Date }) {
  return <span>{formatDate(date)}</span>;
} 