import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { summaries } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const summary = await db?.select()
      .from(summaries)
      .where(eq(summaries.id, params.id))
      .where(eq(summaries.userId, session.user.id))
      .get();

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error in GET /api/summaries/[id]:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db?.delete(summaries)
      .where(eq(summaries.id, params.id))
      .where(eq(summaries.userId, session.user.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/summaries/[id]:', error);
    return new NextResponse('Internal Error', { status: 500 });
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
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
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
    const existingSummary = await db?.select()
      .from(summaries)
      .where(eq(summaries.id, params.id))
      .where(eq(summaries.userId, session.user.id))
      .get();

    if (!existingSummary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    // Update the summary
    const updatedSummary = await db?.update(summaries)
      .set({
        content: body.content,
        updatedAt: new Date(),
      })
      .where(eq(summaries.id, params.id))
      .where(eq(summaries.userId, session.user.id))
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