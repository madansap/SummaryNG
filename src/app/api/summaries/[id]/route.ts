import { db } from '@/lib/db';
import { summaries } from '@/drizzle/schema';
import { auth } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const summary = await db.select()
      .from(summaries)
      .where(eq(summaries.id, params.id))
      .get();

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(summary);
  } catch (error: unknown) {
    console.error('Error fetching summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}

interface UpdateSummaryBody {
  content: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as UpdateSummaryBody;
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Verify the summary belongs to the user
    const existingSummary = await db.select()
      .from(summaries)
      .where(eq(summaries.id, params.id))
      .get();

    if (!existingSummary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    if (existingSummary.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update the summary
    const updatedSummary = await db.update(summaries)
      .set({
        content: body.content,
        updatedAt: new Date(),
      })
      .where(eq(summaries.id, params.id))
      .returning()
      .get();

    return NextResponse.json(updatedSummary);
  } catch (error: unknown) {
    console.error('Error updating summary:', error);
    return NextResponse.json(
      { error: 'Failed to update summary' },
      { status: 500 }
    );
  }
} 