"use client";

import { useState } from "react";
import { Upload, File as FileIcon, X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TextPreview } from "./text-preview";
import { useToast } from "./ui/use-toast";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileProcessed: (file: File, text: string) => void;
}

interface ProcessedFile {
  file: File;
  text?: string;
  isProcessing: boolean;
  error?: string;
}

export function FileUpload({ onFilesSelected, onFileProcessed }: FileUploadProps) {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    console.log(`Processing file: ${file.name}`);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process file");
      }

      const data = await response.json();
      console.log(`Successfully extracted text from ${file.name}`);
      return data.text;
    } catch (error) {
      console.error("Error processing file:", error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files).filter(
      (file) => file.type === "application/pdf"
    );

    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid files",
        description: "Please select PDF files only",
      });
      return;
    }

    // Update state with new files
    const newProcessedFiles = files.map(file => ({
      file,
      isProcessing: true
    }));

    setProcessedFiles(prev => [...prev, ...newProcessedFiles]);
    onFilesSelected(files);

    // Process each file immediately
    for (const file of files) {
      try {
        const text = await processFile(file);
        setProcessedFiles(prev => prev.map((pf) => {
          if (pf.file === file) {
            return { ...pf, text, isProcessing: false };
          }
          return pf;
        }));
        onFileProcessed(file, text);
        
        toast({
          title: "File processed",
          description: `Successfully extracted text from ${file.name}`,
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        setProcessedFiles(prev => prev.map((pf) => {
          if (pf.file === file) {
            return { 
              ...pf, 
              isProcessing: false, 
              error: "Failed to process file" 
            };
          }
          return pf;
        }));
        
        toast({
          variant: "destructive",
          title: "Processing failed",
          description: `Failed to process ${file.name}. Please try again.`,
        });
      }
    }

    // Reset the file input
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/pdf"
    );

    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "Invalid files",
        description: "Please drop PDF files only",
      });
      return;
    }

    // Update state with new files
    const newProcessedFiles = files.map(file => ({
      file,
      isProcessing: true
    }));

    setProcessedFiles(prev => [...prev, ...newProcessedFiles]);
    onFilesSelected(files);

    // Process each file immediately
    for (const file of files) {
      try {
        const text = await processFile(file);
        setProcessedFiles(prev => prev.map((pf) => {
          if (pf.file === file) {
            return { ...pf, text, isProcessing: false };
          }
          return pf;
        }));
        onFileProcessed(file, text);
        
        toast({
          title: "File processed",
          description: `Successfully extracted text from ${file.name}`,
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        setProcessedFiles(prev => prev.map((pf) => {
          if (pf.file === file) {
            return { 
              ...pf, 
              isProcessing: false, 
              error: "Failed to process file" 
            };
          }
          return pf;
        }));
        
        toast({
          variant: "destructive",
          title: "Processing failed",
          description: `Failed to process ${file.name}. Please try again.`,
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (index: number) => {
    setProcessedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      <Card 
        className="p-4 border-dashed border-2 hover:border-primary/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <label className="flex flex-col items-center space-y-2 cursor-pointer">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Drop PDF files here or click to browse
          </span>
          <input
            type="file"
            multiple
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button variant="secondary" size="sm">
            Select Files
          </Button>
        </label>
      </Card>

      {processedFiles.length > 0 && (
        <div className="space-y-2">
          {processedFiles.map((processedFile, index) => (
            <div
              key={`${processedFile.file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <div className="flex items-center space-x-2">
                <FileIcon className="h-4 w-4" />
                <span className="text-sm">{processedFile.file.name}</span>
                {processedFile.isProcessing && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {processedFile.error && (
                  <span className="text-sm text-red-500">
                    {processedFile.error}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {processedFile.text && (
                  <TextPreview 
                    fileName={processedFile.file.name}
                    text={processedFile.text}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
