import { NextResponse } from "next/server";
import { generateExcel } from "@/lib/excel";
import { InvestmentMemoSchema } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate the data
    const results = data.map((item: any) => {
      const result = InvestmentMemoSchema.parse(item);
      return { ...result, fileName: item.fileName };
    });

    // Generate Excel buffer
    const buffer = generateExcel(results);

    // Return the Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=investment_memos.xlsx'
      }
    });
  } catch (error) {
    console.error("Error generating Excel file:", error);
    return NextResponse.json(
      { error: "Error generating Excel file" },
      { status: 500 }
    );
  }
}
