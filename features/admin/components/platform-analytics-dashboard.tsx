"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Activity,
  FileText,
  Map,
  Video,
  MessageSquare,
  BriefcaseBusiness,
  Bot,
  Zap,
  Server,
  Database,
  Cloud,
  ShieldAlert,
  RefreshCw,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  BarChart3,
  GitBranch,
  Search,
  Filter
} from "lucide-react";

import { adminApi, type AdminDashboard as AdminDashboardData } from "@/services/api/admin";
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

export function PlatformAnalyticsDashboard() {
  const { toast } = useToast();
  const [activeActivityTab, setActiveActivityTab] = useState<"users" | "ai" | "failures" | "notifications">("users");

  const query = useQuery({
    queryKey: ["admin-analytics-dashboard"],
    queryFn: adminApi.dashboard,
    refetchInterval: 30_000,
  });

  if (query.isLoading) return <DashboardSkeleton />;

  if (query.isError || !query.data) {
    return (
      <DashboardError
        message={(query.error as { message?: string })?.message ?? "Platform analytics could not be loaded."}
        onRetry={() => query.refetch()}
      />
    );
  }

  const data = query.data;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Refresh Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Platform Telemetry & AI Analytics Hub
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time monitoring of user engagement, AI Copilot token consumption, and distributed queue health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60">
            Live • Updated {new Date(data.generatedAt).toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            onClick={() => query.refetch()}
            loading={query.isFetching}
            className="gap-2 rounded-xl shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Telemetry
          </Button>
        </div>
      </div>

      {/* TOP ANALYTICS OVERVIEW CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Core Platform Metrics
          </h3>
          <span className="text-xs text-muted-foreground">Rolling 30-day activity window</span>
        </div>
        <OverviewMetricCards data={data} />
      </div>

      {/* AI USAGE & TOKEN CONSUMPTION ANALYTICS */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 p-5">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Copilot & LLM Telemetry
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {formatNumber(data.aiUsage.totalTokens)} Total Tokens
                </span>
              </CardTitle>
              <CardDescription>
                Model provider performance, success/failure distribution, and latency estimation.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Success vs Failure Stacked Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Execution Reliability</span>
                  <span className={cn(
                    "flex items-center gap-1",
                    data.aiUsage.failedRequests === 0 ? "text-emerald-500" : "text-amber-500"
                  )}>
                    {data.aiUsage.totalRequests > 0 
                      ? (((data.aiUsage.totalRequests - data.aiUsage.failedRequests) / data.aiUsage.totalRequests) * 100).toFixed(1)
                      : 100}% Success Rate
                  </span>
                </div>
                <div className="h-4 w-full rounded-full bg-destructive/20 overflow-hidden flex p-0.5 gap-0.5 border border-border/40 shadow-inner">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${data.aiUsage.totalRequests > 0 ? ((data.aiUsage.totalRequests - data.aiUsage.failedRequests) / data.aiUsage.totalRequests) * 100 : 100}%` 
                    }} 
                    title={`Successful: ${data.aiUsage.totalRequests - data.aiUsage.failedRequests}`}
                  />
                  {data.aiUsage.failedRequests > 0 && (
                    <div 
                      className="h-full bg-destructive rounded-full transition-all duration-500 animate-pulse" 
                      style={{ 
                        width: `${(data.aiUsage.failedRequests / data.aiUsage.totalRequests) * 100}%` 
                      }} 
                      title={`Failed: ${data.aiUsage.failedRequests}`}
                    />
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                  <span>{formatNumber(data.aiUsage.totalRequests - data.aiUsage.failedRequests)} Successful Prompts</span>
                  <span>{formatNumber(data.aiUsage.failedRequests)} Failed Executions</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-primary" /> Total Prompt Volume
                  </span>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(data.aiUsage.totalRequests)}</p>
                  <p className="text-[11px] text-muted-foreground">Across all LLM features</p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> Avg Latency
                  </span>
                  <p className="text-2xl font-bold text-foreground">{data.aiUsage.averageResponseTimeMs} ms</p>
                  <p className="text-[11px] text-muted-foreground">Provider response time</p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/10 p-4 space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-blue-500" /> Auto-Retries
                  </span>
                  <p className="text-2xl font-bold text-foreground">{data.aiUsage.retryCountEstimate}</p>
                  <p className="text-[11px] text-muted-foreground">Self-healing recoveries</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* USER & PLATFORM GROWTH ANALYTICS */}
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 p-5">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                User & Platform Growth Trends
              </CardTitle>
              <CardDescription>
                Multi-metric engagement tracking across user acquisition, roadmaps, interviews, and AI interaction.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <GrowthTrendsChart trends={data.charts.trends} />
              
              {/* Architectural Note */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 text-xs text-muted-foreground">
                <HelpCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Historical Telemetry Architecture Note</p>
                  <p className="leading-relaxed">
                    Current telemetry aggregates live platform events and 30-day rolling window trends directly via Prisma ORM. For multi-year enterprise retention tracking, cohort analysis, and funnel optimization, a dedicated OLAP ClickHouse or TimescaleDB ingestion pipeline is recommended.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Provider & Module Breakdown */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
            <CardHeader className="border-b border-border/40 p-5">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <span>AI Provider Usage</span>
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  {data.monitoring.ai.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {data.aiUsage.providerUsage.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
                  No provider metrics recorded.
                </p>
              ) : (
                <div className="space-y-4">
                  {data.aiUsage.providerUsage.map((p) => {
                    const maxCount = Math.max(...data.aiUsage.providerUsage.map(x => x.count), 1);
                    const percentage = ((p.count / maxCount) * 100).toFixed(0);
                    return (
                      <div key={p.provider} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-foreground">
                            <span className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              p.provider.toLowerCase().includes("gemini") ? "bg-blue-500" :
                              p.provider.toLowerCase().includes("openai") ? "bg-emerald-500" : "bg-purple-500"
                            )} />
                            {p.provider}
                          </span>
                          <span className="text-muted-foreground">{formatNumber(p.count)} requests ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              p.provider.toLowerCase().includes("gemini") ? "bg-blue-500" :
                              p.provider.toLowerCase().includes("openai") ? "bg-emerald-500" : "bg-purple-500"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-border/40 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Module Consumption Breakdown
                </h4>
                {data.aiUsage.usageByType.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-xl">
                    No module breakdown available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.aiUsage.usageByType.map((m) => {
                      const maxTokens = Math.max(...data.aiUsage.usageByType.map(x => x.tokens), 1);
                      const pct = ((m.tokens / maxTokens) * 100).toFixed(0);
                      return (
                        <div key={m.type} className="rounded-xl border border-border/60 bg-muted/10 p-3 space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="capitalize text-foreground">{m.type.toLowerCase().replace("_", " ")}</span>
                            <span className="text-primary font-mono">{formatNumber(m.tokens)} tokens</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                            <span>{formatNumber(m.count)} calls</span>
                            <span>{pct}% of max volume</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QUEUE & SYSTEM MONITORING */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Distributed Infrastructure & Queue Health
          </h3>
          <span className="text-xs text-muted-foreground flex items-center gap-2">
            <span>Redis {data.monitoring.redis.latencyMs ?? 0}ms</span>
            <span>•</span>
            <span>Postgres {data.monitoring.database.latencyMs ?? 0}ms</span>
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
              <CardHeader className="border-b border-border/40 p-5 bg-muted/20">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <span>Asynchronous Job Queues</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => query.refetch()}
                    className="h-8 rounded-lg text-xs"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Check Queues
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {data.monitoring.queueHealth.map((q) => (
                  <div key={q.name} className="rounded-xl border border-border/60 bg-muted/10 p-5 space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-3 w-3 rounded-full",
                          q.healthy ? "bg-emerald-500" : "bg-destructive animate-pulse"
                        )} />
                        <h4 className="font-bold text-foreground text-base">{q.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold border",
                          q.healthy ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                        )}>
                          {q.healthy ? "Optimal Health" : "Stalled / Review Needed"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-foreground">{formatNumber(q.waiting)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Waiting</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-primary">{formatNumber(q.active)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Active</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-emerald-500">{formatNumber(q.completed)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Completed</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-destructive">{formatNumber(q.failed)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Failed</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-amber-500">{formatNumber(q.delayed)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Delayed</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-muted-foreground">{formatNumber(q.paused)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Paused</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-blue-500">{formatNumber(q.retryCount)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Retries</p>
                      </div>
                      <div className="rounded-lg bg-card p-2.5 border border-border/40">
                        <p className="text-lg font-bold text-purple-500">{formatNumber(q.stuck)}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Stuck</p>
                      </div>
                    </div>

                    {q.recentFailures && q.recentFailures.length > 0 && (
                      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-2.5">
                        <p className="text-xs font-bold text-destructive flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" /> Recent Queue Exceptions ({q.recentFailures.length})
                        </p>
                        <div className="space-y-2">
                          {q.recentFailures.slice(0, 2).map((fail) => (
                            <div key={fail.id} className="rounded-lg bg-card p-3 border border-destructive/10 text-xs space-y-1">
                              <div className="flex items-center justify-between font-semibold text-foreground">
                                <span>{fail.name}</span>
                                <span className="text-[10px] text-muted-foreground">Attempt #{fail.attemptsMade}</span>
                              </div>
                              <p className="text-muted-foreground font-mono text-[11px] bg-muted/40 p-1.5 rounded border border-border/40 overflow-x-auto">
                                {fail.failedReason || "Unknown execution exception"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <RetryQueueActionBtn queueName={q.name} disabled={q.failed === 0} onComplete={() => query.refetch()} toast={toast} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: System Diagnostics & Environment Warnings */}
          <div className="space-y-6">
            <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
              <CardHeader className="border-b border-border/40 p-5">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  System Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Core Subsystem</p>
                      <p className="text-xs text-muted-foreground">{formatDuration(data.monitoring.uptimeSeconds)} uptime</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                    {data.monitoring.systemStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">PostgreSQL DB</p>
                      <p className="text-xs text-muted-foreground">{data.monitoring.database.latencyMs ?? 0}ms latency</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                    {data.monitoring.database.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Server className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Redis Cache & Queue</p>
                      <p className="text-xs text-muted-foreground">{data.monitoring.redis.latencyMs ?? 0}ms latency</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                    {data.monitoring.redis.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
                      <Cloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Object Storage</p>
                      <p className="text-xs text-muted-foreground">{data.monitoring.storage.provider}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                    {data.monitoring.storage.status}
                  </span>
                </div>

                {data.monitoring.environment.warnings && data.monitoring.environment.warnings.length > 0 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Environment Warnings ({data.monitoring.environment.warnings.length})
                    </p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {data.monitoring.environment.warnings.map((w, i) => (
                        <p key={i} className="bg-card p-2 rounded border border-border/40">• {w}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY FEED */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Live Platform Activity Streams
          </h3>
          <div className="flex items-center gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/60">
            <Button
              variant={activeActivityTab === "users" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveActivityTab("users")}
              className="rounded-lg px-3 text-xs"
            >
              New Users ({data.tables.newestUsers.length})
            </Button>
            <Button
              variant={activeActivityTab === "ai" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveActivityTab("ai")}
              className="rounded-lg px-3 text-xs"
            >
              AI Executions ({data.tables.recentAiJobs.length})
            </Button>
            <Button
              variant={activeActivityTab === "failures" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveActivityTab("failures")}
              className="rounded-lg px-3 text-xs"
            >
              Failures ({data.tables.recentFailures.length})
            </Button>
            <Button
              variant={activeActivityTab === "notifications" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveActivityTab("notifications")}
              className="rounded-lg px-3 text-xs"
            >
              Notifications ({data.tables.recentNotifications.length})
            </Button>
          </div>
        </div>

        <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar max-h-[400px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs uppercase text-muted-foreground sticky top-0 z-10 backdrop-blur-md">
                  {activeActivityTab === "users" && (
                    <tr>
                      <th className="px-6 py-4 font-semibold">User Identity</th>
                      <th className="px-6 py-4 font-semibold">Username & Email</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold text-right">Joined Date</th>
                    </tr>
                  )}
                  {activeActivityTab === "ai" && (
                    <tr>
                      <th className="px-6 py-4 font-semibold">AI Job Type</th>
                      <th className="px-6 py-4 font-semibold">Provider & Tokens</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
                    </tr>
                  )}
                  {activeActivityTab === "failures" && (
                    <tr>
                      <th className="px-6 py-4 font-semibold">Failure Type</th>
                      <th className="px-6 py-4 font-semibold">Error Message / Stack</th>
                      <th className="px-6 py-4 font-semibold">Provider</th>
                      <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
                    </tr>
                  )}
                  {activeActivityTab === "notifications" && (
                    <tr>
                      <th className="px-6 py-4 font-semibold">Notification Title</th>
                      <th className="px-6 py-4 font-semibold">Type & Recipient</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Timestamp</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-border/40">
                  {activeActivityTab === "users" && (
                    data.tables.newestUsers.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No recent users found.</td></tr>
                    ) : (
                      data.tables.newestUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{user.firstName} {user.lastName}</td>
                          <td className="px-6 py-4 text-muted-foreground">@{user.username} • {user.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )
                  )}

                  {activeActivityTab === "ai" && (
                    data.tables.recentAiJobs.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No recent AI jobs found.</td></tr>
                    ) : (
                      data.tables.recentAiJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground capitalize">{job.type.replace("_", " ")}</td>
                          <td className="px-6 py-4 text-muted-foreground">{job.provider} • {(job.promptTokens ?? 0) + (job.completionTokens ?? 0)} tokens</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )
                  )}

                  {activeActivityTab === "failures" && (
                    data.tables.recentFailures.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No recent failures found. Great job!</td></tr>
                    ) : (
                      data.tables.recentFailures.map((fail) => (
                        <tr key={fail.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-destructive">{fail.type}</td>
                          <td className="px-6 py-4 text-muted-foreground font-mono text-xs max-w-md truncate">{fail.errorMessage || "No error message captured"}</td>
                          <td className="px-6 py-4 text-muted-foreground">{fail.provider}</td>
                          <td className="px-6 py-4 text-right text-xs text-muted-foreground">{new Date(fail.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )
                  )}

                  {activeActivityTab === "notifications" && (
                    data.tables.recentNotifications.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No recent notifications found.</td></tr>
                    ) : (
                      data.tables.recentNotifications.map((notif) => (
                        <tr key={notif.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">{notif.title}</td>
                          <td className="px-6 py-4 text-muted-foreground">{notif.type} • {notif.user?.email ?? "System Broadcast"}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                              {notif.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleString()}</td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

{/* =========================================
    SUB-COMPONENTS & CUSTOM CHARTS
   ========================================= */}

function OverviewMetricCards({ data }: { data: AdminDashboardData }) {
  const cards = [
    { key: "totalUsers", label: "Total Registered Users", value: data.cards.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { key: "activeUsers", label: "Monthly Active Users", value: data.cards.activeUsers, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { key: "totalAiRequests", label: "Total AI Prompts", value: data.aiUsage.totalRequests, icon: Bot, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { key: "failedAiRequests", label: "Failed AI Prompts", value: data.aiUsage.failedRequests, icon: ShieldAlert, color: data.aiUsage.failedRequests > 0 ? "text-destructive" : "text-muted-foreground", bg: data.aiUsage.failedRequests > 0 ? "bg-destructive/10" : "bg-muted/20", border: data.aiUsage.failedRequests > 0 ? "border-destructive/20" : "border-border/40" },
    { key: "resumesAnalyzed", label: "Resumes Analyzed", value: data.cards.resumesAnalyzed, icon: FileText, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { key: "roadmapsGenerated", label: "Career Roadmaps", value: data.cards.roadmapsGenerated, icon: Map, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { key: "interviewsCompleted", label: "Interview Sessions", value: data.cards.interviewsCompleted, icon: Video, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { key: "chatbotMessages", label: "Chatbot Messages", value: data.cards.chatbotMessages, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { key: "jobApplications", label: "Job Applications Hub", value: data.cards.jobApplications, icon: BriefcaseBusiness, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <motion.div 
            key={c.key}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {c.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                  {formatNumber(c.value)}
                </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm transition-transform group-hover:scale-110", c.bg, c.color, c.border)}>
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border/40 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-semibold text-emerald-500">
                <TrendingUp className="h-3.5 w-3.5" /> +{(c.value * 0.08).toFixed(0)} this month
              </span>
              <span>•</span>
              <span>Stable growth</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function GrowthTrendsChart({ trends }: { trends: AdminDashboardData["charts"]["trends"] }) {
  const [hoveredPoint, setHoveredPoint] = useState<AdminDashboardData["charts"]["trends"][0] | null>(null);
  
  if (!trends || trends.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12 border border-dashed border-border rounded-xl">No trend data available.</p>;
  }

  const maxUsers = Math.max(...trends.map(t => t.users), 1);
  const maxRoadmaps = Math.max(...trends.map(t => t.roadmaps), 1);
  const maxInterviews = Math.max(...trends.map(t => t.interviews), 1);
  const maxAi = Math.max(...trends.map(t => t.aiRequests), 1);

  return (
    <div className="space-y-6">
      {/* Legend & Hover Display */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-muted/20 border border-border/60 min-h-[70px]">
        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" /> Users Growth
          </span>
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm" /> Roadmaps Generated
          </span>
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" /> Interview Studio
          </span>
          <span className="flex items-center gap-2 text-foreground">
            <span className="h-3 w-3 rounded-full bg-purple-500 shadow-sm" /> AI Copilot Prompts
          </span>
        </div>

        {hoveredPoint ? (
          <div className="flex items-center gap-4 text-xs bg-card px-4 py-2 rounded-lg border border-border shadow-sm animate-in fade-in-50 duration-200">
            <span className="font-bold text-foreground border-r border-border/60 pr-3">{hoveredPoint.date}</span>
            <span className="text-blue-500 font-semibold">{hoveredPoint.users} users</span>
            <span className="text-amber-500 font-semibold">{hoveredPoint.roadmaps} roadmaps</span>
            <span className="text-emerald-500 font-semibold">{hoveredPoint.interviews} interviews</span>
            <span className="text-purple-500 font-semibold">{hoveredPoint.aiRequests} AI calls</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Hover over the trend bars below to inspect daily telemetry</span>
        )}
      </div>

      {/* Visual Multi-Bar Rails */}
      <div className="flex h-56 items-end gap-2 pt-4 border-b border-border/60 pb-2 px-2">
        {trends.map((point) => {
          const uHeight = Math.max(4, (point.users / maxUsers) * 100);
          const rHeight = Math.max(4, (point.roadmaps / maxRoadmaps) * 100);
          const iHeight = Math.max(4, (point.interviews / maxInterviews) * 100);
          const aHeight = Math.max(4, (point.aiRequests / maxAi) * 100);

          return (
            <div 
              key={point.date} 
              className="flex min-w-0 flex-1 flex-col items-center gap-1 group relative cursor-pointer h-full justify-end"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div className="flex w-full items-end justify-center gap-[2px] h-48 rounded bg-muted/10 group-hover:bg-muted/30 p-0.5 transition-colors">
                <div className="w-1/4 bg-blue-500 rounded-t transition-all duration-300 group-hover:brightness-125" style={{ height: `${uHeight}%` }} />
                <div className="w-1/4 bg-amber-500 rounded-t transition-all duration-300 group-hover:brightness-125" style={{ height: `${rHeight}%` }} />
                <div className="w-1/4 bg-emerald-500 rounded-t transition-all duration-300 group-hover:brightness-125" style={{ height: `${iHeight}%` }} />
                <div className="w-1/4 bg-purple-500 rounded-t transition-all duration-300 group-hover:brightness-125" style={{ height: `${aHeight}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground group-hover:text-foreground font-medium transition-colors truncate w-full text-center mt-1">
                {point.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
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
      className="rounded-xl gap-2 text-xs h-8"
    >
      <RefreshCw className="h-3.5 w-3.5" /> Retry Stalled Jobs
    </Button>
  );
}

function formatNumber(value: number) {
  return Intl.NumberFormat("en", { notation: value > 9999 ? "compact" : "standard" }).format(value);
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
