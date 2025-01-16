# Project overview

Your goal is to build a next.js app that allows users to upload PDF files, and use OpenAI structured output feature to extract information from the PDF file and convert to excel file.
You will be using NextJS 14, shadcn, tailwind, Lucid icon

# Core functionalities

## 1. File Upload & Schema Definition

- Users should be able to upload one or more PDF files
- Users should be able to define and remove data points they want to extract in individual fields
- There should be a button 'Start Extraction'
- Set default schema to showcase how does this work; default schema can be modified or deleted by user and add new fields of their choice
  - Company: Company name
  - Description: Company description
  - URL: Company URL
  - Industry: Company industry
  - Traction: Summary of company traction, including revenue, users, and growth
  - Ask: Amount of funding requested and valuation
- Server-side file processing

## 2. Text Extraction

- Use LlamaParser for PDF text extraction (server-side)
- For each file,combine all document chunks for complete text, Make sure return full text of all documents, not just the first one documents[0]
- The llamaparse text extraction should happen immdiately after user upload files to UI, and not wait for a button click
- Strictly following ## 1. LlamaParser Documentation as code implementation example
- After each file uploaded, it should be displayed as an item on the page, displaying the file name (same as uploaded name) with a button to click to preview the full text extracted
- User can keep adding new files to the list, previously uploaded files should be displayed
- Server-side processing only

## 3. Data Processing

- After clicking on 'Start Extraction', the data should be sent to OpenAI for processing across all files
- Use OpenAI structured output for information extraction
- Strictly following ## 2. OpenAI Documentation as code implementation example
- After file processed, we should display the result in a table format, each data point should be displayed in a column; one file should have on row in the table

## 4. File Download

- Combine data processed from multiple PDFs into one excel file
- Implement proper error handling and type safety
- Enable excel file download
- Implement temporary file cleanup, do not cache files on the server, and delete them after processing

# Doc

## 1. LlamaParser Documentation

Use API key located in a file called .env that looks like this:

LLAMA_CLOUD_API_KEY=llx-key

Set up a new TypeScript project in a new folder, we use this:

npm init
npm install -D typescript @types/node

LlamaParse support is built-in to LlamaIndex for TypeScript, so you'll need to install LlamaIndex.TS:

npm install llamaindex dotenv

Let's create a parse.ts file and put our dependencies in it:

import {
LlamaParseReader,
// we'll add more here later
} from "llamaindex";
import 'dotenv/config'

Now let's create our main function, which will load in fun facts about Canada and parse them:

async function main() {
// save the file linked above as sf_budget.pdf, or change this to match
const path = "./canada.pdf";

// set up the llamaparse reader
const reader = new LlamaParseReader({ resultType: "markdown" });

// parse the document
const documents = await reader.loadData(path);

// print the parsed document
console.log(documents)
}

main().catch(console.error);

Now run the file:

npx tsx parse.ts

Congratulations! You've parsed the file, and should see output that looks like this:

[
Document {
id\_: '02f5e252-9dca-47fa-80b2-abdd902b911a',
embedding: undefined,
metadata: { file_path: './canada.pdf' },
excludedEmbedMetadataKeys: [],
excludedLlmMetadataKeys: [],
relationships: {},
text: '# Fun Facts About Canada\n' +
'\n' +
'We may be known as the Great White North, but
...etc...

## 2. OpenAI Documentation

Make sure you use the gpt-4o model and zod for defining data structures.

```
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure." },
    { role: "user", content: "..." },
  ],
  response_format: zodResponseFormat(ResearchPaperExtraction, "research_paper_extraction"),
});

const research_paper = completion.choices[0].message.parsed;
```

# Important Implementation Notes

## 0. Adding logs

- Always add server side logs to your code so we can debug any potential issues

## 1. Project setup

- All new components should go in /components at the root (not in the app folder) and be named like example-component.tsx unless otherwise specified
- All new pages go in /app
- Use the Next.js 14 app router
- All data fetching should be done in a server component and pass the data down as props
- Client components (useState, hooks, etc) require that 'use client' is set at the top of the file

## 2. Server-Side API Calls:

- All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.
- Create dedicated API routes in the `pages/api` directory for each external API interaction.
- Client-side components should fetch data through these API routes, not directly from external APIs.

## 3. Environment Variables:

- Store all sensitive information (API keys, credentials) in environment variables.
- Use a `.env.local` file for local development and ensure it's listed in `.gitignore`.
- For production, set environment variables in the deployment platform (e.g., Vercel).
- Access environment variables only in server-side code or API routes.

## 4. Error Handling and Logging:

- Implement comprehensive error handling in both client-side components and server-side API routes.
- Log errors on the server-side for debugging purposes.
- Display user-friendly error messages on the client-side.

## 5. Type Safety:

- Use TypeScript interfaces for all data structures, especially API responses.
- Avoid using `any` type; instead, define proper types for all variables and function parameters.

## 6. API Client Initialization:

- Initialize API clients (e.g., Snoowrap for Reddit, OpenAI) in server-side code only.
- Implement checks to ensure API clients are properly initialized before use.

## 7. Data Fetching in Components:

- Use React hooks (e.g., `useEffect`) for data fetching in client-side components.
- Implement loading states and error handling for all data fetching operations.

## 8. Next.js Configuration:

- Utilize `next.config.mjs` for environment-specific configurations.
- Use the `env` property in `next.config.mjs` to make environment variables available to the application.

## 9. CORS and API Routes:

- Use Next.js API routes to avoid CORS issues when interacting with external APIs.
- Implement proper request validation in API routes.

## 10. Component Structure:

- Separate concerns between client and server components.
- Use server components for initial data fetching and pass data as props to client components.

## 11. Security:

    - Never expose API keys or sensitive credentials on the client-side.
    - Implement proper authentication and authorization for API routes if needed.

## 12. Special syntax:

- When use shadcn, use npx shadcn@latest add xxx, instead of shadcn-ui@latest, this is deprecated
