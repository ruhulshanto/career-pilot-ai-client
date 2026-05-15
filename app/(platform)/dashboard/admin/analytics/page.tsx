import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <DashboardShell
      title="Platform Analytics"
      description="Deep dive into platform metrics, retention, and AI utilization rates."
    >
      <div className="space-y-6">
        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Detailed Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">Detailed analytics charts are currently being rendered on the main Admin Overview dashboard. Advanced historical views will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
