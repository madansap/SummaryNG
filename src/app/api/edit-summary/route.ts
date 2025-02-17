import { NextResponse } from "next/server"
import { Groq } from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    )
  }

  try {
    const { summary, prompt } = await req.json()
    
    if (!summary || !prompt) {
      return NextResponse.json(
        { error: "Summary and prompt are required" },
        { status: 400 }
      )
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful AI editor. Edit the provided summary based on the user's request while maintaining the exact same format:

# [Title]
[Subtitle]
• [Point]: [Explanation]

Guidelines:
- Keep the exact same markdown format
- Maintain bullet points and structure
- Preserve the professional tone
- Follow the user's editing request
- Keep explanations concise (1-2 sentences)`
        },
        {
          role: "user",
          content: `Here's the current summary:\n\n${summary}\n\nEdit request: ${prompt}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.2,
      max_tokens: 1024,
    })

    const updatedSummary = completion.choices[0]?.message?.content

    if (!updatedSummary) {
      throw new Error('Failed to edit summary')
    }

    return NextResponse.json({ updatedSummary })
  } catch (error: any) {
    console.error("[EDIT_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Failed to edit summary" },
      { status: 500 }
    )
  }
} 