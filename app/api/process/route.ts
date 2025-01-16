import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { InvestmentMemoSchema } from "@/lib/schema";

// Initialize OpenAI with error handling
const openai = new OpenAI();
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export async function POST(request: Request) {
  try {
    const { text, fileName } = await request.json();

    if (!text) {
      console.error("No text provided for processing");
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    console.log(`Processing file: ${fileName}`);
    console.log("Text length:", text.length);
    
    try {
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting structured information from investment memos and pitch decks.
Extract the key information about the company and their fundraising round.
Be precise and concise. If a piece of information is not found, use "N/A" as the value.
Focus on the most relevant and important information for each field.`
          },
          { 
            role: "user", 
            content: `Please extract information from the following investment memo/pitch deck text:\n\n${text}`
          },
        ],
        response_format: zodResponseFormat(InvestmentMemoSchema, "investment_memo"),
      });

      const result = completion.choices[0].message.parsed;
      console.log(`Successfully processed ${fileName}:`, result);

      return NextResponse.json({ success: true, data: result });
    } catch (openaiError) {
      console.error(`OpenAI processing error for ${fileName}:`, openaiError);
      throw openaiError;
    }
  } catch (error) {
    console.error("Error in process route:", error);
    return NextResponse.json(
      { error: "Error processing text" },
      { status: 500 }
    );
  }
}
