"use client";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface TextPreviewProps {
  fileName: string;
  text: string;
}

export function TextPreview({ fileName, text }: TextPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Preview Text
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {text}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
