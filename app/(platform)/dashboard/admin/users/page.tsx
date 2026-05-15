import { DashboardShell } from "@/shared/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { UsersRound } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      title="User Management"
      description="View, manage, and audit all users across the platform."
    >
      <div className="space-y-6">
        <Card className="border border-border/60 bg-muted/30">
          <CardHeader className="border-b border-border/60 p-5">
            <CardTitle className="flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-primary" />
              Platform Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">User Management Table is currently being integrated with the new data grid. Please refer to the main Admin Overview for newest users.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
