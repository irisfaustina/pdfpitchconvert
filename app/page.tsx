"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { SchemaDefinition, type SchemaField } from "@/components/schema-definition";
import { ResultsTable } from "@/components/results-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type InvestmentMemo } from "@/lib/schema";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const PAGE_TITLE = "PDF Data Extractor";

interface ProcessedFile {
  file: File;
  text?: string;
}

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<(InvestmentMemo & { fileName: string })[]>([]);
  const { toast } = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles.map(file => ({ file }))]);
    toast({
      title: "Files added",
      description: `Added ${newFiles.length} file(s) for processing`,
    });
  };

  const handleFileProcessed = (file: File, text: string) => {
    setFiles(prev => 
      prev.map(f => f.file === file ? { ...f, text } : f)
    );
    toast({
      title: "File processed",
      description: `Successfully extracted text from ${file.name}`,
    });
  };

  const handleSchemaChange = (newSchema: SchemaField[]) => {
    setSchema(newSchema);
  };

  const handleStartExtraction = async () => {
    setIsProcessing(true);
    const newResults = [];
    let hasError = false;

    try {
      for (const { file, text } of files) {
        if (!text) continue;

        try {
          const response = await fetch("/api/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              text,
              fileName: file.name,
              schema
            }),
          });

          if (!response.ok) {
            console.error(`Failed to process ${file.name}:`, response.statusText);
            hasError = true;
            toast({
              variant: "destructive",
              title: "Processing failed",
              description: `Failed to process ${file.name}. Please try again.`,
            });
            continue;
          }

          const { data } = await response.json();
          newResults.push({ ...data, fileName: file.name });
          toast({
            title: "File processed",
            description: `Successfully processed ${file.name}`,
          });
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          hasError = true;
          toast({
            variant: "destructive",
            title: "Processing error",
            description: `Error processing ${file.name}. Please try again.`,
          });
        }
      }

      setResults(newResults);
      
      if (newResults.length > 0) {
        toast({
          title: "Processing complete",
          description: `Successfully processed ${newResults.length} file(s)${hasError ? ' with some errors' : ''}`,
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      toast({
        variant: "destructive",
        title: "Processing error",
        description: "An error occurred while processing files. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">{PAGE_TITLE}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <FileUpload 
            onFilesSelected={handleFilesSelected}
            onFileProcessed={handleFileProcessed}
          />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Define Schema</h2>
          <SchemaDefinition onSchemaChange={handleSchemaChange} />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg"
          onClick={handleStartExtraction}
          disabled={files.length === 0 || schema.length === 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Start Extraction"
          )}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <ResultsTable results={results} />
        </div>
      )}

      <Toaster />
    </div>
  );
}
