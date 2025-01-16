import { z } from "zod";

export const InvestmentMemoSchema = z.object({
  company: z.string().describe("Company name"),
  description: z.string().describe("Company description"),
  url: z.string().describe("Company URL"),
  industry: z.string().describe("Company industry"),
  traction: z.string().describe("Summary of company traction, including revenue, users, and growth"),
  roundSize: z.string().describe("Looking for $xM in funding at $xM valuation"),
});

export type InvestmentMemo = z.infer<typeof InvestmentMemoSchema>;
