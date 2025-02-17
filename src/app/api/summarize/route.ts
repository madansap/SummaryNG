import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { groq } from "@/lib/groq"

async function fetchContent(url: string) {
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)
  
  // Remove unnecessary elements
  $('script, style, nav, footer, iframe, noscript').remove()
  
  // Get the title
  const title = $('title').text() || $('h1').first().text()
  
  // Get the main content
  const content = $('article, main, .content, .post, .article')
    .text()
    .replace(/\s+/g, ' ')
    .trim()

  return { content, title }
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    )
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      )
    }

    const { content, title } = await fetchContent(url)

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Create a clear, professional summary following this exact format:

# [Keep the original title]

[Brief description of the core message]

• [Concise heading]: [Brief explanation in 8-10 words maximum]

• [Concise heading]: [Brief explanation in 8-10 words maximum]

• [Concise heading]: [Brief explanation in 8-10 words maximum]

• [Concise heading]: [Brief explanation in 8-10 words maximum]

• [Concise heading]: [Brief explanation in 8-10 words maximum]

Guidelines:
- Keep the original title unchanged
- Subtitle should be clear and concise without any prefix
- Make headings brief and impactful
- Keep explanations very concise (1-2 sentences maximum)
- Use proper sentence case and punctuation
- Maintain consistent formatting`
        },
        {
          role: "user",
          content: content.slice(0, 15000)
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.2,
      max_tokens: 1024,
    })

    const summary = completion.choices[0]?.message?.content

    if (!summary) {
      throw new Error('Failed to generate summary')
    }

    return NextResponse.json({ summary, title })
  } catch (error: any) {
    console.error("[GROQ_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate summary" },
      { status: 500 }
    )
  }
} 