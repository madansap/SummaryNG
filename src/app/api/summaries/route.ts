import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { summaries } from "@/drizzle/schema";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { url, content, title } = await req.json();

    const summary = await db?.insert(summaries).values({
      id: nanoid(),
      userId: session.user.id,
      url,
      content,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json(summary?.[0]);
  } catch (error) {
    console.error("[SUMMARIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 