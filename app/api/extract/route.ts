import { NextRequest, NextResponse } from "next/server";
import { LlamaParseReader } from "llamaindex";
import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  console.log("Starting PDF text extraction");
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      console.error("No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join("/tmp", `${randomUUID()}.pdf`);
    
    console.log(`Writing file to temporary path: ${tempPath}`);
    await writeFile(tempPath, buffer);

    // Initialize LlamaParse reader
    console.log("Initializing LlamaParse reader");
    const reader = new LlamaParseReader({ 
      resultType: "markdown",
      apiKey: process.env.LLAMA_CLOUD_API_KEY
    });

    // Extract text from PDF
    console.log("Extracting text from PDF");
    const documents = await reader.loadData(tempPath);
    
    // Combine all document chunks
    const fullText = documents.map(doc => doc.text).join("\n\n");
    
    console.log("Text extraction completed successfully");
    
    return NextResponse.json({ text: fullText });
  } catch (error) {
    console.error("Error in PDF text extraction:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
