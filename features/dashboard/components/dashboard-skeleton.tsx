import React from "react";
import { PageLoading } from "@/shared/components/loading/loading-system";

export function DashboardSkeleton() {
  return <PageLoading title={true} grid={true} table={true} />;
}

