"use client";

import { Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ResumeDropzoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function ResumeDropzone({
  file,
  setFile,
  isAnalyzing,
  onAnalyze,
}: ResumeDropzoneProps) {
  return (
    <div className="space-y-6">
      <div
        className={cn(
          "group relative border border-border rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-200",
          file
            ? "bg-[#111827] border-primary/30"
            : "bg-card hover:border-primary/20",
        )}
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-[#0B1120] text-muted-foreground">
          <Upload
            className={cn(
              "w-10 h-10 transition-colors",
              file ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>

        {file ? (
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">Ready for analysis</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="mt-5 rounded-2xl"
            >
              Clear Selection
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">
              Upload your resume
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: PDF, DOCX
            </p>
            <input
              type="file"
              className="hidden"
              id="resume-upload"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              variant="outline"
              className="mt-6 rounded-2xl h-12 px-8"
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              Browse Files
            </Button>
          </div>
        )}
      </div>

      <Button
        className="w-full h-14 rounded-3xl text-base font-semibold"
        disabled={!file || isAnalyzing}
        onClick={onAnalyze}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Analyze Resume
          </>
        )}
      </Button>
    </div>
  );
}
