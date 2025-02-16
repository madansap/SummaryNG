import { NextResponse } from "next/server"
import * as cheerio from "cheerio"
import { groq } from "@/lib/groq"

async function fetchContent(url: string): Promise<string> {
  const response = await fetch(url)
  const html = await response.text()
  const $ = cheerio.load(html)

  // Remove unwanted elements
  $('script, style, nav, footer, header, aside').remove()

  // Get the main content
  const article = $('article').text() || 
                 $('main').text() || 
                 $('.content, .article, .post').text() || 
                 $('p').text()

  return article.trim()
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    const content = await fetchContent(url)

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Your task is to generate a structured summary while strictly preserving the original content’s organization, key terms, and formatting. 
    
    ### Guidelines:
    
    1. **Title & Subtitle**  
       - Keep the **exact original title** as-is.  
       - Maintain the **original subtitle/description** without changes.  
    
    2. **Bullet Points**  
       - Retain all **bullet points exactly as written** (do not rephrase or remove).  
       - Keep **key terms and concepts unchanged**.  
       - Preserve the **original structure and formatting**.  
    
    3. **Summarizing Lengthy Explanations**  
       - Only **summarize long explanations**, keeping the main ideas intact.  
       - Ensure the **output remains concise yet clear**.  
    
    ### Output Format:
    
    **# [Original Title]**  
    
    *[Original Subtitle/Description]*  
    
    **Main Points:**  
    - [Bullet point 1]  
    - [Bullet point 2]  
    - [Bullet point 3]  
    
    Ensure the summary is well-structured, readable, and visually clean. Do not alter the author’s intended message or structure.`
        },
        {
          role: "user",
          content
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.1, // Very low temperature to stay close to original
      max_tokens: 1024,
    })

    const summary = completion.choices[0]?.message?.content || "Failed to generate summary"
    return NextResponse.json({ summary })
  } catch (error) {
    console.error("[SUMMARIZE_ERROR]", error)
    return new NextResponse("Failed to generate summary", { status: 500 })
  }
} 