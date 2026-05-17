"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Trash2,
  XCircle,
  Eye,
  RotateCcw,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { ResumeDropzone } from "./resume-dropzone";
import { AnalysisResult } from "./analysis-result";

import {
  resumeApi,
  type ResumeRecord,
  type ResumeWithFeedback,
} from "@/services/api/resume";

import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  refreshDashboardQueries,
  scheduleDashboardRefresh,
} from "@/features/dashboard/utils/dashboard-query-sync";
import { resumeQueryKeys } from "../api/resume-query-keys";
import type { ProcessingStatus } from "@/services/api/resume";
import { PageLoading, TableLoading } from "@/shared/components/loading/loading-system";

const ACTIVE_STATUSES: ProcessingStatus[] = ["PENDING", "PROCESSING"];
const TERMINAL_STATUSES: ProcessingStatus[] = ["COMPLETED", "FAILED"];

type ResumeUploadPanelProps = {
  mode?: "compact" | "center";
};

export function ResumeUploadPanel({ mode = "compact" }: ResumeUploadPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<ResumeRecord | null>(
    null,
  );
  const lastSyncedStatusRef = useRef<ProcessingStatus | null>(null);

  const uploadMutation = useMutation({
    mutationFn: resumeApi.analyze,
    onSuccess: (resume) => {
      setResumeId(resume.id);
      lastSyncedStatusRef.current = resume.status;
      void queryClient.invalidateQueries({ queryKey: resumeQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["career-context"] });
      void refreshDashboardQueries(queryClient);
      toast({
        title: "Analysis Queued",
        description: "Your resume is being analyzed by the AI pipeline.",
      });
    },
    onError: (err: { message?: string }) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err.message || "Failed to queue resume analysis",
      });
    },
  });

  const historyQuery = useQuery({
    queryKey: resumeQueryKeys.history(),
    queryFn: resumeApi.getHistory,
    enabled: mode === "center",
    staleTime: 15_000,
  });

  const deleteMutation = useMutation({
    mutationFn: resumeApi.delete,
    onSuccess: async (_data, deletedResumeId) => {
      if (deletedResumeId === resumeId) {
        handleReset();
      }

      setResumeToDelete(null);
      await queryClient.invalidateQueries({ queryKey: resumeQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: ["career-context"] });
      await refreshDashboardQueries(queryClient);
      toast({
        title: "Resume deleted successfully",
        description: "Your resume and its analysis data have been removed.",
      });
    },
    onError: (err: { message?: string }) => {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err.message || "Unable to delete this resume.",
      });
    },
  });

  const resumeQuery = useQuery<ResumeWithFeedback>({
    queryKey: resumeQueryKeys.analysis(resumeId),
    queryFn: () => resumeApi.getById(resumeId!),
    enabled: Boolean(resumeId),
    refetchInterval: (query) => {
      const resume = query.state.data;
      return resume && ACTIVE_STATUSES.includes(resume.status) ? 2500 : false;
    },
  });

  useEffect(() => {
    if (!resumeQuery.data) return;

    const currentStatus = resumeQuery.data.status;
    const previousStatus = lastSyncedStatusRef.current;

    if (currentStatus === previousStatus) return;

    lastSyncedStatusRef.current = currentStatus;

    if (ACTIVE_STATUSES.includes(currentStatus)) {
      void queryClient.invalidateQueries({ queryKey: ["career-context"] });
      void refreshDashboardQueries(queryClient);
      return;
    }

    if (TERMINAL_STATUSES.includes(currentStatus)) {
      void queryClient.invalidateQueries({ queryKey: ["career-context"] });
      void refreshDashboardQueries(queryClient);
      scheduleDashboardRefresh(queryClient);
    }
  }, [queryClient, resumeQuery.data?.status]);

  const handleAnalyze = async () => {
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleReset = () => {
    setFile(null);
    setResumeId(null);
  };

  const resume = resumeQuery.data;
  const isProcessing =
    uploadMutation.isPending ||
    Boolean(resume?.status && ACTIVE_STATUSES.includes(resume.status));

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-border/70 px-6 py-5">
        <CardTitle className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold">
            {mode === "center" ? "Resume Intelligence Center" : "Resume Analysis"}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {!resumeId ? (
          <ResumeDropzone
            file={file}
            setFile={setFile}
            error={fileError}
            setError={setFileError}
            isAnalyzing={uploadMutation.isPending}
            onAnalyze={handleAnalyze}
          />
        ) : resumeQuery.isError ? (
          <div className="space-y-4 rounded-3xl border border-destructive/20 bg-destructive/10 p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">Analysis status unavailable</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {(resumeQuery.error as { message?: string })?.message ||
                "Unable to load resume analysis status."}
            </p>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => resumeQuery.refetch()}
            >
              Retry
            </Button>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-accent/20 bg-accent/10 p-10 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">
                Resume analysis in progress...
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Status: {resume?.status ?? "QUEUED"}. This panel refreshes
                automatically while the AI worker runs.
              </p>
            </div>
          </div>
        ) : resume ? (
          <AnalysisResult resume={resume} onReset={handleReset} />
        ) : (
          <PageLoading title={false} grid={true} table={false} />
        )}

        {mode === "center" && (
          <ResumeHistory
            resumes={historyQuery.data?.data ?? []}
            isLoading={historyQuery.isLoading}
            isError={historyQuery.isError}
            activeResumeId={resumeId}
            deletingResumeId={deleteMutation.variables ?? null}
            onSelect={(id) => setResumeId(id)}
            onDelete={(resume) => setResumeToDelete(resume)}
          />
        )}
      </CardContent>

      {resumeToDelete && (
        <DeleteResumeDialog
          resume={resumeToDelete}
          isDeleting={deleteMutation.isPending}
          onCancel={() => setResumeToDelete(null)}
          onConfirm={() => deleteMutation.mutate(resumeToDelete.id)}
        />
      )}
    </Card>
  );
}

function ResumeHistory({
  resumes,
  isLoading,
  isError,
  activeResumeId,
  deletingResumeId,
  onSelect,
  onDelete,
}: {
  resumes: ResumeRecord[];
  isLoading: boolean;
  isError: boolean;
  activeResumeId: string | null;
  deletingResumeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (resume: ResumeRecord) => void;
}) {
  return (
    <div className="mt-8 border-t border-border/70 pt-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Uploaded Resumes
          </p>
          <p className="text-xs text-muted-foreground">
            Keep your active resume history clean and dashboard-ready.
          </p>
        </div>
      </div>

      {isError ? (
        <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-muted-foreground">
          Unable to load resume history.
        </p>
      ) : isLoading ? (
        <TableLoading rows={2} columns={1} />
      ) : resumes.length === 0 ? (
        <p className="rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Uploaded resumes will appear here after analysis is queued.
        </p>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume, index) => (
            <ResumeHistoryItem
              key={resume.id}
              resume={resume}
              isLatest={index === 0}
              isActive={resume.id === activeResumeId}
              isDeleting={resume.id === deletingResumeId}
              onSelect={() => onSelect(resume.id)}
              onDelete={() => onDelete(resume)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResumeHistoryItem({
  resume,
  isLatest,
  isActive,
  isDeleting,
  onSelect,
  onDelete,
}: {
  resume: ResumeRecord;
  isLatest: boolean;
  isActive: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const StatusIcon =
    resume.status === "COMPLETED"
      ? CheckCircle2
      : resume.status === "FAILED"
        ? XCircle
        : Clock;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between",
        isActive && "border-accent/30 bg-accent/[0.055]",
        isDeleting && "scale-[0.99] opacity-60",
      )}
    >
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <StatusIcon className="h-4 w-4 shrink-0 text-accent" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {resume.title}
              </p>
              {isLatest && (
                <span className="rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                  Latest
                </span>
              )}
              {isActive && (
                <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  Viewing
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {resume.status} - {formatFileSize(resume.fileSize)} -{" "}
              {new Date(resume.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </button>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {typeof resume.latestFeedback?.score === "number" && (
          <div className="rounded-2xl border border-border/60 bg-muted/40 px-3 py-2 text-sm font-semibold text-accent">
            ATS {Math.round(resume.latestFeedback.score)}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl"
          onClick={onSelect}
        >
          <Eye className="h-4 w-4" />
          View Analysis
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-2xl text-muted-foreground"
          disabled
        >
          <RotateCcw className="h-4 w-4" />
          Reanalyze
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-2xl text-destructive hover:text-destructive"
          disabled={isDeleting}
          loading={isDeleting}
          onClick={onDelete}
        >
          {!isDeleting && <Trash2 className="h-4 w-4" />}
          Delete
        </Button>
      </div>
    </div>
  );
}

function DeleteResumeDialog({
  resume,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  resume: ResumeRecord;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">
              Delete this resume?
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This removes "{resume.title}", its AI feedback, related resume
              activity, and dashboard metrics from the backend.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="rounded-2xl"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="rounded-2xl"
            loading={isDeleting}
            onClick={onConfirm}
          >
            Delete Resume
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(size?: number) {
  if (!size) return "unknown size";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
