import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { summaries } from "@/drizzle/schema"
import * as cheerio from 'cheerio'
import https from 'https'
import crypto from 'crypto'
import { groq } from "@/lib/groq"

// Generate a random ID
function generateId(): string {
  return crypto.randomBytes(5).toString('hex');
}

// Helper function to validate URL
function isValidUrl(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

// Helper function to fetch URL content
function fetchUrl(urlString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlString);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      timeout: 15000, // 15 seconds timeout
    };

    const request = https.get(parsedUrl, options, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`Redirecting to: ${redirectUrl}`);
          fetchUrl(redirectUrl)
            .then(resolve)
            .catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch article: HTTP ${response.statusCode} - ${response.statusMessage}`));
        return;
      }

      // Check content type
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        reject(new Error('URL does not point to an HTML page. Please provide a valid article URL.'));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (!data) {
          reject(new Error('No content received from the URL'));
          return;
        }
        resolve(data);
      });
    });

    request.on('error', (error) => {
      reject(new Error(`Failed to fetch article: ${error.message}`));
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timed out. Please check if the URL is accessible.'));
    });

    request.setTimeout(options.timeout);
  });
}

interface RequestBody {
  url: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json() as RequestBody
    if (!body.url) {
      return new NextResponse("URL is required", { status: 400 })
    }

    // Validate URL format
    if (!isValidUrl(body.url)) {
      return new NextResponse("Invalid URL format", { status: 400 })
    }

    // Fetch the article content with proper error handling
    let html;
    try {
      html = await fetchUrl(body.url);
    } catch (error) {
      console.error("Fetch error:", error);
      return new NextResponse(
        "Failed to fetch the article. Please check if the URL is accessible.",
        { status: 400 }
      );
    }

    // Use cheerio to parse the HTML
    const $ = cheerio.load(html)
    
    // Extract title - try different common selectors
    const title = $('meta[property="og:title"]').attr('content') || 
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text() ||
                "Untitled Article"

    // Extract article content
    const articleText = $('article, [role="article"], .article-content, .post-content, main')
      .find('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .join('\n')
      .replace(/\s+/g, ' ')
      .trim();

    if (!articleText) {
      return new NextResponse(
        "Could not extract article content. Please ensure the URL points to a valid article.",
        { status: 400 }
      );
    }

    // Generate summary using Groq
    const prompt = `
      Summarize the following article while keeping its core content intact. Maintain the original tone and key insights.
      
      Format your response exactly as follows:
      TITLE: ${title}
      SUBTITLE: [one-line essence of the article]
      KEY POINTS:
      • [Bold Title]: [1-2 sentence explanation]
      • [Bold Title]: [1-2 sentence explanation]
      • [Bold Title]: [1-2 sentence explanation]
      (up to 5 points maximum)

      Rules:
      - Each bullet point must have a bold title followed by a colon and explanation
      - Titles should be 2-4 words, capturing the key concept
      - Explanations must be directly from the article (no external knowledge)
      - Keep explanations to 1-2 sentences maximum
      - Include only factual information present in the article
      - Do not add personal opinions or interpretations
      - Do not add any external context not present in the article
      
      Article content:
      ${articleText}
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.1,
      max_tokens: 1024,
    });

    const summary = completion.choices[0]?.message?.content;
    if (!summary) {
      throw new Error("Failed to generate summary");
    }

    // Parse the summary into structured format
    interface SummaryPoint {
      title: string;
      description: string;
    }

    const lines = summary.split('\n').map(line => line.trim()).filter(Boolean);
    const subtitle = lines.find(line => line.startsWith('SUBTITLE:'))?.replace('SUBTITLE:', '').trim() || '';
    
    // Extract bullet points
    const points: SummaryPoint[] = lines
      .filter(line => line.startsWith('•'))
      .map(point => {
        const [title, ...descriptionParts] = point.replace('•', '').split(':').map(s => s.trim());
        return {
          title: title.replace(/[\[\]]/g, '').replace(/\*\*/g, ''),  // Remove brackets and asterisks
          description: descriptionParts.join(':').trim()  // Rejoin in case there were colons in the description
        };
      });

    // Create the formatted summary
    const content = `
      <div class="summary-content p-8 max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div class="prose prose-sm max-w-none">
          <h1 class="text-2xl font-semibold mb-2 outline-none" contenteditable="true">${title}</h1>
          <p class="text-lg text-gray-600 mb-6 outline-none" contenteditable="true">${subtitle}</p>
          
          <div class="space-y-4">
            ${points.map(point => `
              <div class="point-container group">
                <div class="flex items-baseline">
                  <span class="text-[#333] mr-2">•</span>
                  <div class="flex-1">
                    <span class="text-[15px] font-semibold outline-none" contenteditable="true">${point.title}:</span>
                    <span class="text-[15px] outline-none ml-1" contenteditable="true">${point.description}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="mt-8 pt-4 border-t">
            <p class="text-gray-500">Source: <a href="${body.url}" class="text-blue-500 hover:underline" target="_blank">${body.url}</a></p>
          </div>
        </div>
      </div>
    `

    // Save to database
    const id = generateId()
    const summaryDb = await db.insert(summaries).values({
      id,
      userId,
      title: title.trim() || 'Untitled Article',
      content,
      url: body.url,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning().get()

    return NextResponse.json(summaryDb)
  } catch (error) {
    console.error("[SUMMARIZE_ERROR]", error)
    return new NextResponse(
      "Failed to generate summary. Please try again later.", 
      { status: 500 }
    )
  }
} 