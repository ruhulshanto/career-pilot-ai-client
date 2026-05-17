"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Database,
  Cloud,
  Activity,
  ShieldAlert,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu,
  HardDrive,
  Mail,
  Bot,
  Zap,
  Terminal,
  FileCode2,
  ListFilter,
  Check,
  Play
} from "lucide-react";

import { adminApi, type SystemHealthData } from "@/services/api/admin";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { DashboardError } from "@/features/dashboard/components/dashboard-error";

export function SystemHealthDashboard() {
  const { toast } = useToast();
  const [selectedQueueFilter, setSelectedQueueFilter] = useState<string>("all");
  const [inspectingJob, setInspectingJob] = useState<any | null>(null);

  const query = useQuery({
    queryKey: ["admin-system-health"],
    queryFn: adminApi.system,
    refetchInterval: 15_000,
  });

  if (query.isLoading) return <DashboardSkeleton />;

  if (query.isError || !query.data) {
    return (
      <DashboardError
        message={(query.error as { message?: string })?.message ?? "System infrastructure health could not be loaded."}
        onRetry={() => query.refetch()}
      />
    );
  }

  const data = query.data;

  // Gather all recent failures across queues
  const allFailures = data.components.queues.queueHealth.flatMap(q => 
    (q.recentFailures || []).map(f => ({ ...f, queueName: q.name }))
  );

  const filteredFailures = selectedQueueFilter === "all" 
    ? allFailures 
    : allFailures.filter(f => f.queueName === selectedQueueFilter);

  return (
    <div className="space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Server className="h-6 w-6 text-primary" />
            System Health & Infrastructure Console
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Production SaaS infrastructure monitoring, database diagnostics, distributed cache health, and queue error inspection.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm",
            data.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
            data.status === "degraded" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
            "bg-destructive/10 text-destructive border-destructive/20"
          )}>
            {data.status === "online" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            System {data.status} ({data.readiness})
          </span>
          <Button
            variant="outline"
            onClick={() => query.refetch()}
            loading={query.isFetching}
            className="gap-2 rounded-xl shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Ping Subsystems
          </Button>
        </div>
      </div>

      {/* SECTION 1: SERVER HEALTH & CORE SUBSYSTEMS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Server Health & Uptime</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatDuration(data.uptimeSeconds)}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                <Activity className="h-3.5 w-3.5 text-emerald-500" /> Active Process Uptime
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Cpu className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Environment Tier</p>
              <p className="text-2xl font-bold text-foreground capitalize mt-1">{data.environment.nodeEnv}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                <Terminal className="h-3.5 w-3.5 text-blue-500" /> {data.environment.productionReady ? "Production Ready" : "Development Mode"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm">
              <Terminal className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API Latency Benchmark</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {Math.max(data.components.database.latencyMs, data.components.redis.latencyMs, 5)} ms
              </p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> Gateway Response Time
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Required Subsystems</p>
              <p className="text-2xl font-bold text-foreground mt-1">{data.requiredServices.length} Active</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {data.requiredServices.join(", ")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-sm">
              <Server className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2: DATABASE & REDIS CACHE HEALTH */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PostgreSQL Database Health */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                PostgreSQL Database Diagnostics
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
                data.components.database.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                {data.components.database.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-blue-500" /> Connection Ping Latency
                </span>
                <p className="text-xl font-bold text-foreground">{data.components.database.latencyMs} ms</p>
                <p className="text-[11px] text-muted-foreground">Direct connection health</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <FileCode2 className="h-3.5 w-3.5 text-primary" /> Schema Alignment
                </span>
                <p className="text-xl font-bold text-foreground">
                  {data.components.database.schema?.missing?.length ? `${data.components.database.schema.missing.length} Missing` : "Synchronized"}
                </p>
                <p className="text-[11px] text-muted-foreground">Prisma ORM schema check</p>
              </div>
            </div>

            {/* Migration Diagnostics */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Prisma Migration & Table Verification
              </h4>
              {data.components.database.schema?.missing && data.components.database.schema.missing.length > 0 ? (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                  <p className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Pending Database Migrations Detected
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The database schema is currently missing the following tables or columns required by the Prisma ORM schema:
                  </p>
                  <div className="space-y-1 pt-1 font-mono text-xs text-muted-foreground">
                    {data.components.database.schema.missing.map((m, i) => (
                      <p key={i} className="bg-card p-2 rounded border border-border/40">• {m}</p>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-1 italic">
                    Run `npx prisma migrate deploy` to synchronize the database schema before production launch.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-500 font-medium">
                    All database tables, columns, and indexes are fully synchronized with the Prisma schema.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Redis & Cache Health */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
            <CardTitle className="text-lg font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-amber-500" />
                Redis Cache & Distributed Locks
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
                data.components.redis.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                data.components.redis.status === "degraded" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                {data.components.redis.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-500" /> Redis Ping Latency
                </span>
                <p className="text-xl font-bold text-foreground">{data.components.redis.latencyMs} ms</p>
                <p className="text-[11px] text-muted-foreground">In-memory cache health</p>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-purple-500" /> Queue Dependency
                </span>
                <p className="text-xl font-bold text-foreground">
                  {data.components.redis.status === "online" ? "Operational" : "Degraded"}
                </p>
                <p className="text-[11px] text-muted-foreground">BullMQ backend store</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Distributed Cache Health Summary
              </h4>
              {data.components.redis.message ? (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs text-muted-foreground">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Redis Client Diagnostic Warning</p>
                    <p className="mt-1 leading-relaxed">{data.components.redis.message}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-500 font-medium">
                    Redis memory store is actively handling session caching, rate-limiting, and BullMQ worker synchronization.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: STORAGE, AI PROVIDERS & EMAIL CONFIGURATION */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Storage Provider Health */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-purple-500" />
                Storage Subsystem
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
                data.components.storage.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                {data.components.storage.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">Storage Provider</span>
              <span className="font-bold text-foreground capitalize">{data.components.storage.provider}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">Writable Verification</span>
              <span className={cn(
                "font-bold flex items-center gap-1",
                data.components.storage.writable ? "text-emerald-500" : "text-destructive"
              )}>
                {data.components.storage.writable ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {data.components.storage.writable ? "Writable" : "Read-Only"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">Public Base URL</span>
              <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[180px]">
                {data.components.storage.publicBaseUrl || "N/A"}
              </span>
            </div>
            {data.components.storage.message && (
              <p className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/60">
                {data.components.storage.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* AI Provider Health */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                AI Copilot Providers
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
                data.components.ai.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                data.components.ai.status === "degraded" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                {data.components.ai.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">Active AI Provider</span>
              <span className="font-bold text-foreground capitalize">{data.environment.aiProvider}</span>
            </div>
            
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Model Endpoints</span>
              <div className="space-y-2">
                {Object.entries(data.components.ai.providers || {}).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/10 text-xs">
                    <span className="font-semibold text-foreground capitalize">{key}</span>
                    <span className={cn(
                      "font-semibold flex items-center gap-1",
                      val?.configured ? "text-emerald-500" : val?.keyPresent ? "text-amber-500" : "text-destructive"
                    )}>
                      {val?.configured ? <Check className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {val?.configured ? "Fully Configured" : val?.keyPresent ? "Key Present" : "Missing Key"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email & SMTP Health */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
            <CardTitle className="text-base font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                SMTP & Email Gateway
              </span>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
                data.components.email.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                data.components.email.status === "degraded" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                {data.components.email.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">Email Provider</span>
              <span className="font-bold text-foreground capitalize">{data.components.email.provider || "SMTP"}</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">SMTP Host & Port</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {data.components.email.host || "N/A"}:{data.components.email.port || 587}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-border/40 pb-3">
              <span className="text-muted-foreground font-semibold">SMTP Auth Check</span>
              <span className={cn(
                "font-bold flex items-center gap-1",
                data.components.email.passwordLooksPlaceholder ? "text-amber-500" : data.components.email.configured ? "text-emerald-500" : "text-destructive"
              )}>
                {data.components.email.passwordLooksPlaceholder ? <AlertTriangle className="h-3.5 w-3.5" /> : data.components.email.configured ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {data.components.email.passwordLooksPlaceholder ? "Placeholder Pass" : data.components.email.configured ? "Configured" : "Unconfigured"}
              </span>
            </div>
            {data.components.email.message && (
              <p className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-xl border border-border/60">
                {data.components.email.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SECTION 4: QUEUE SYSTEM MONITORING & HEALTH CARDS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Distributed BullMQ Job Queues
          </h3>
          <span className="text-xs text-muted-foreground">
            {data.components.queues.failedJobs} Total Failed Jobs • {data.components.queues.stuckJobs} Stuck Jobs
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {data.components.queues.queueHealth.map((q) => (
            <Card key={q.name} className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden flex flex-col justify-between">
              <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={cn(
                      "h-3 w-3 rounded-full",
                      q.healthy ? "bg-emerald-500" : "bg-destructive animate-pulse"
                    )} />
                    {q.name}
                  </span>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border",
                    q.healthy ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                  )}>
                    {q.healthy ? "Healthy" : "Stalled / Review"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-foreground">{q.waiting}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Waiting</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-primary">{q.active}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Active</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-emerald-500">{q.completed}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Completed</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-destructive">{q.failed}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Failed</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-amber-500">{q.delayed}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Delayed</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-muted-foreground">{q.paused}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Paused</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-blue-500">{q.retryCount}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Retries</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/10 p-3">
                    <p className="text-xl font-bold text-purple-500">{q.stuck}</p>
                    <p className="text-[11px] text-muted-foreground uppercase mt-1">Stuck</p>
                  </div>
                </div>

                {q.message && (
                  <p className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    {q.message}
                  </p>
                )}

                <div className="pt-2 border-t border-border/40 flex justify-end">
                  <RetryQueueActionBtn queueName={q.name} disabled={q.failed === 0} onComplete={() => query.refetch()} toast={toast} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SECTION 5: FAILED JOBS & ERROR INSPECTOR */}
      <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/40 bg-muted/20 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                Failed Jobs & Error Inspector
              </CardTitle>
              <CardDescription>
                Deep inspect recent queue exceptions, execution stack traces, and attempt histories.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border/60 self-start sm:self-auto">
              <Button
                variant={selectedQueueFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedQueueFilter("all")}
                className="rounded-lg px-3 text-xs"
              >
                All Queues ({allFailures.length})
              </Button>
              {data.components.queues.queueHealth.map(q => (
                <Button
                  key={q.name}
                  variant={selectedQueueFilter === q.name ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedQueueFilter(q.name)}
                  className="rounded-lg px-3 text-xs"
                >
                  {q.name} ({(q.recentFailures || []).length})
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40 min-h-[350px]">
            {/* Left: Failure List */}
            <div className="md:col-span-1 overflow-y-auto max-h-[400px] custom-scrollbar p-3 space-y-2">
              {filteredFailures.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground space-y-2">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500/60" />
                  <p className="text-sm font-medium">No failed jobs in this queue.</p>
                  <p className="text-xs text-muted-foreground/80">All asynchronous workers are executing flawlessly.</p>
                </div>
              ) : (
                filteredFailures.map((fail) => (
                  <div
                    key={`${fail.queueName}-${fail.id}`}
                    onClick={() => setInspectingJob(fail)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all space-y-1.5 text-xs",
                      inspectingJob?.id === fail.id && inspectingJob?.queueName === fail.queueName
                        ? "bg-primary/10 border-primary text-foreground shadow-sm"
                        : "bg-muted/10 border-border/40 hover:bg-muted/30 text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span className="truncate max-w-[160px]">{fail.name}</span>
                      <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full border border-destructive/20">
                        Attempt #{fail.attemptsMade}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-primary font-semibold">{fail.queueName}</span>
                      <span>{new Date(fail.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] line-clamp-2 pt-1 font-mono bg-background/60 p-1.5 rounded border border-border/40 overflow-hidden">
                      {fail.failedReason || "Unknown execution exception"}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Right: Error Stack & Inspector */}
            <div className="md:col-span-2 p-6 overflow-y-auto max-h-[400px] custom-scrollbar flex flex-col justify-between bg-muted/5">
              {inspectingJob ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-4">
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{inspectingJob.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Job ID: <span className="font-mono text-primary">{inspectingJob.id}</span> • Queue: <span className="font-semibold">{inspectingJob.queueName}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-destructive/10 text-destructive px-3 py-1 rounded-full border border-destructive/20 font-semibold">
                        Failed at Attempt #{inspectingJob.attemptsMade}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exception Stack Trace & Reason</span>
                    <div className="bg-card p-4 rounded-xl border border-destructive/20 shadow-inner overflow-x-auto font-mono text-xs text-destructive leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                      {inspectingJob.failedReason || "No stack trace or failure reason captured by BullMQ worker."}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="bg-card p-3.5 rounded-xl border border-border/60 space-y-1">
                      <span className="text-muted-foreground">Processed On</span>
                      <p className="font-semibold text-foreground">
                        {inspectingJob.processedOn ? new Date(inspectingJob.processedOn).toLocaleString() : "N/A"}
                      </p>
                    </div>
                    <div className="bg-card p-3.5 rounded-xl border border-border/60 space-y-1">
                      <span className="text-muted-foreground">Finished On</span>
                      <p className="font-semibold text-foreground">
                        {inspectingJob.finishedOn ? new Date(inspectingJob.finishedOn).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-16 space-y-3">
                  <Terminal className="h-12 w-12 text-muted-foreground/40 stroke-1" />
                  <p className="text-base font-medium text-foreground">Select a failed job to inspect execution details</p>
                  <p className="text-xs max-w-sm">
                    Click any job from the failure list on the left to deeply analyze its exception stack trace, timestamps, and worker attempt history.
                  </p>
                </div>
              )}

              {inspectingJob && (
                <div className="pt-6 border-t border-border/40 flex justify-end">
                  <RetryQueueActionBtn 
                    queueName={inspectingJob.queueName} 
                    disabled={false} 
                    onComplete={() => {
                      query.refetch();
                      setInspectingJob(null);
                    }} 
                    toast={toast} 
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RetryQueueActionBtn({ queueName, disabled, onComplete, toast }: { queueName: string; disabled: boolean; onComplete: () => void; toast: any }) {
  const mutation = useMutation({
    mutationFn: () => adminApi.retryFailedJobs(queueName),
    onSuccess: (result) => {
      toast({ variant: "success", title: "Retry Triggered", description: `${result.retried} failed jobs moved back into active processing.` });
      onComplete();
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Retry Failed", description: err.message || "Failed to retry queue jobs." });
    }
  });

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled || mutation.isPending}
      loading={mutation.isPending}
      onClick={() => mutation.mutate()}
      className="rounded-xl gap-2 text-xs h-8 shadow-sm"
    >
      <RefreshCw className="h-3.5 w-3.5" /> Retry Stalled Jobs
    </Button>
  );
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
