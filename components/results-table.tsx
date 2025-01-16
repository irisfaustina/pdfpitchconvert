"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { type InvestmentMemo } from "@/lib/schema";

interface ResultsTableProps {
  results: (InvestmentMemo & { fileName: string })[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(results),
      });

      if (!response.ok) throw new Error("Download failed");

      // Get the blob from the response
      const blob = await response.blob();

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "investment_memos.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-[200px]"
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Round Size</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Traction</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={`${result.fileName}-${index}`}>
                <TableCell className="font-medium">{result.fileName}</TableCell>
                <TableCell>{result.company}</TableCell>
                <TableCell>{result.industry}</TableCell>
                <TableCell>{result.roundSize}</TableCell>
                <TableCell>
                  {result.url !== "N/A" ? (
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {result.url}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>{result.traction}</TableCell>
                <TableCell className="max-w-md truncate" title={result.description}>
                  {result.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
