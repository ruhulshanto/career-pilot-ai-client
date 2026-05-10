"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { ResumeDropzone } from "./resume-dropzone";
import { AnalysisResult } from "./analysis-result";

import { resumeApi } from "@/services/api/resume";

import { useToast } from "@/shared/hooks/use-toast";

export function ResumeUploadPanel() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const data = await resumeApi.analyze(file);
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err.message || "Failed to analyze resume",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold">Resume Analysis</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {!result ? (
          <ResumeDropzone
            file={file}
            setFile={setFile}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
          />
        ) : (
          <AnalysisResult result={result} onReset={() => setResult(null)} />
        )}
      </CardContent>
    </Card>
  );
}
