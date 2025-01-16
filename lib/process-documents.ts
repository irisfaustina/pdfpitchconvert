import OpenAI from "openai"
import { z } from "zod"
import { zodResponseFormat } from "openai/helpers/zod"

const InvestmentMemoExtraction = z.object({
  company: z.string(),
  description: z.string(),
  url: z.string(),
  industry: z.string(),
  traction: z.string(),
  roundSize: z.string(),
})

export async function processDocuments(text: string) {
  const openai = new OpenAI()
  
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: "Extract the following information from the provided text:\n" +
          "Company: Company name\n" +
          "Description: Company description\n" +
          "URL: Company URL\n" +
          "Industry: Company industry\n" +
          "Traction: Summary of company traction, including revenue, users, and growth\n" +
          "Round Size: Amount of funding requested and valuation"
      },
      { role: "user", content: text },
    ],
    response_format: zodResponseFormat(InvestmentMemoExtraction, "investment_memo_extraction"),
  })

  return completion.choices[0].message.parsed
} 