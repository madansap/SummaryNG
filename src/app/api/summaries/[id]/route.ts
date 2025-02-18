import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

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

    const { rows } = await sql`
      SELECT * FROM summaries 
      WHERE id = ${params.id} 
      AND user_id = ${session.user.id}
      LIMIT 1
    `;

    const summary = rows[0];

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

    await sql`
      DELETE FROM summaries 
      WHERE id = ${params.id} 
      AND user_id = ${session.user.id}
    `;

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
    const { rows: existingRows } = await sql`
      SELECT * FROM summaries 
      WHERE id = ${params.id} 
      AND user_id = ${session.user.id}
      LIMIT 1
    `;

    const existingSummary = existingRows[0];

    if (!existingSummary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      );
    }

    // Update the summary
    const { rows: updatedRows } = await sql`
      UPDATE summaries 
      SET content = ${body.content}, 
          updated_at = NOW()
      WHERE id = ${params.id} 
      AND user_id = ${session.user.id}
      RETURNING *
    `;

    const updatedSummary = updatedRows[0];

    return NextResponse.json(updatedSummary);
  } catch (error: unknown) {
    console.error('Error updating summary:', error);
    return NextResponse.json(
      { error: 'Failed to update summary' },
      { status: 500 }
    );
  }
} 