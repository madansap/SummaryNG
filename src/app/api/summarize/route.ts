import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { Groq } from "groq-sdk"

// Create Groq client inside the API route
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

async function fetchContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .ads, .comments, .social-share').remove()

    // Get the main content
    const content = $('article, main, .post-content, .article-content, .entry-content, #content, p').text().trim()

    if (!content) {
      throw new Error('No content found')
    }

    return content
  } catch (error: any) {
    console.error("[FETCH_ERROR]", error)
    throw new Error(error.message)
  }
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

    const content = await fetchContent(url)

    try {
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

      return NextResponse.json({ summary })
    } catch (error: any) {
      console.error("[GROQ_ERROR]", error)
      return NextResponse.json(
        { error: error.message || "Failed to generate summary" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("[SUMMARIZE_ERROR]", error)
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    )
  }
} 