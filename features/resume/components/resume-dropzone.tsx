"use client";

import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ACCEPTED_RESUME_EXTENSIONS = [".pdf", ".docx", ".txt"];
const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface ResumeDropzoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error?: string | null;
  setError?: (message: string | null) => void;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export function ResumeDropzone({
  file,
  setFile,
  error,
  setError,
  isAnalyzing,
  onAnalyze,
}: ResumeDropzoneProps) {
  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setError?.(null);
      return;
    }

    const lowerName = selectedFile.name.toLowerCase();
    const hasSafeExtension = ACCEPTED_RESUME_EXTENSIONS.some((extension) =>
      lowerName.endsWith(extension),
    );

    if (!hasSafeExtension || !ACCEPTED_RESUME_TYPES.includes(selectedFile.type)) {
      setFile(null);
      setError?.("Upload a PDF, DOCX, or TXT resume.");
      return;
    }

    if (selectedFile.size > MAX_RESUME_FILE_SIZE_BYTES) {
      setFile(null);
      setError?.("Resume file must be 5 MB or smaller.");
      return;
    }

    setError?.(null);
    setFile(selectedFile);
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "group relative border border-border rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-200",
          file
            ? "bg-card border-primary/30"
            : "bg-card hover:border-primary/20",
        )}
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-background text-muted-foreground">
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
            <p className="text-sm text-muted-foreground">
              {readableFileType(file)} · {formatFileSize(file.size)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFileChange(null)}
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
              Supported formats: PDF, DOCX, TXT up to 5 MB
            </p>
            <input
              type="file"
              className="hidden"
              id="resume-upload"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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

      {error ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

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
          "Analyze Resume"
        )}
      </Button>
    </div>
  );
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const readableFileType = (file: File) => {
  if (file.type === "application/pdf") return "PDF";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "DOCX";
  }
  if (file.type === "text/plain") return "TXT";
  return file.type || "Unknown file";
};
