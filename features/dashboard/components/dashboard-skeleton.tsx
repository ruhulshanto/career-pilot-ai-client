import { Card, CardContent } from "@/shared/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="h-6 w-36 animate-pulse rounded-full bg-muted" />
            <div className="h-9 max-w-2xl animate-pulse rounded-lg bg-muted" />
            <div className="h-5 max-w-xl animate-pulse rounded-lg bg-muted" />
            <div className="flex gap-4">
              <div className="h-11 w-36 animate-pulse rounded-lg bg-muted" />
              <div className="h-11 w-36 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-xl border border-border/80 bg-card"
          />
        ))}
      </div>
    </div>
  );
}
