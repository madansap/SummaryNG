import { Groq } from "groq-sdk"

export const groq = new Groq({
  apiKey: process.env.OPENAI_API_KEY!,
}) 