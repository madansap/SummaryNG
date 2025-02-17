import { Groq } from "groq-sdk"

// Check if we're on the server side
if (typeof window === 'undefined') {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured in environment variables')
  }
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
}) 