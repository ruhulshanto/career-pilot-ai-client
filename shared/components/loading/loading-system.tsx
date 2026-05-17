"use React";

import React from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

/**
 * 1. CardGridLoading
 * Mirrors an exact 4-card metric grid layout (e.g. Dashboard overview stats).
 */
export function CardGridLoading({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
          <CardContent className="p-5 flex items-start justify-between gap-4">
            <div className="space-y-3 w-full">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-32 pt-1" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * 2. TableLoading
 * Mirrors a structured enterprise data table with customizable headers and rows.
 */
export function TableLoading({ 
  rows = 5, 
  columns = 5, 
  className 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) {
  return (
    <Card className={cn("rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden", className)}>
      <CardHeader className="border-b border-border/40 p-5 bg-muted/20 flex flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 w-1/3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[600px] divide-y divide-border/40">
          {/* Table Header Row */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted/10">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton key={colIdx} className="h-3.5 w-full max-w-[100px]" />
            ))}
          </div>
          {/* Table Body Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-5 gap-4 p-4.5 items-center bg-card hover:bg-muted/5 transition-colors">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Skeleton 
                  key={colIdx} 
                  className={cn(
                    "h-4 w-full",
                    colIdx === 0 ? "max-w-[140px]" : colIdx === 1 ? "max-w-[180px]" : "max-w-[120px]"
                  )} 
                />
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 3. ProfileLoading
 * Mirrors user identity headers, avatars, and multi-column bio/metadata layouts.
 */
export function ProfileLoading({ className }: { className?: string }) {
  return (
    <Card className={cn("rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden", className)}>
      <CardHeader className="border-b border-border/40 p-6 bg-muted/10 flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-full shrink-0 shadow-inner" />
        <div className="space-y-2.5 text-center sm:text-left w-full max-w-md">
          <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-72 mx-auto sm:mx-0" />
          <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-32" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/5 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-muted/5 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 4. ChartLoading
 * Mirrors telemetry trend rails and AI data visualization canvases.
 */
export function ChartLoading({ className }: { className?: string }) {
  return (
    <Card className={cn("rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden", className)}>
      <CardHeader className="border-b border-border/40 p-5 bg-muted/20 flex flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 w-1/3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[280px] w-full flex items-end justify-between gap-2 pt-8 pb-2 border-b border-border/60 px-4 bg-gradient-to-t from-muted/10 to-transparent rounded-xl">
          {/* Animated Bar Skeletons simulating data */}
          <Skeleton className="h-[30%] w-full rounded-t-md" />
          <Skeleton className="h-[55%] w-full rounded-t-md" />
          <Skeleton className="h-[40%] w-full rounded-t-md" />
          <Skeleton className="h-[75%] w-full rounded-t-md" />
          <Skeleton className="h-[60%] w-full rounded-t-md" />
          <Skeleton className="h-[90%] w-full rounded-t-md" />
          <Skeleton className="h-[45%] w-full rounded-t-md" />
          <Skeleton className="h-[85%] w-full rounded-t-md" />
          <Skeleton className="h-[70%] w-full rounded-t-md" />
          <Skeleton className="h-[100%] w-full rounded-t-md" />
        </div>
        <div className="flex justify-between items-center pt-3 px-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 5. PageLoading
 * The master layout template combining hero title banners, metric grids, and primary content panels.
 */
export function PageLoading({ 
  title = true, 
  grid = true, 
  table = true,
  chart = false,
  className 
}: { 
  title?: boolean; 
  grid?: boolean; 
  table?: boolean; 
  chart?: boolean;
  className?: string; 
}) {
  return (
    <div className={cn("space-y-8 pb-16 w-full animate-in fade-in-50 duration-300", className)}>
      {/* Hero Banner Header */}
      {title && (
        <div className="flex flex-col gap-2 border-b border-border/40 pb-5">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      )}

      {/* Top Overview Cards Grid */}
      {grid && <CardGridLoading count={4} />}

      {/* Main Content Sections */}
      <div className="grid gap-6 lg:grid-cols-1">
        {chart && <ChartLoading />}
        {table && <TableLoading rows={4} columns={5} />}
      </div>
    </div>
  );
}
