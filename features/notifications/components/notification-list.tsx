"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  Info,
  Loader2,
  MessageSquare,
  Route,
  Target,
  Trophy,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { resolveWorkspaceHref } from "@/shared/lib/role-routing";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import { refreshDashboardQueries } from "@/features/dashboard/utils/dashboard-query-sync";
import {
  notificationQueryKeys,
  notificationsApi,
  type NotificationItem,
  type NotificationListParams,
  type NotificationStatus,
  type NotificationType,
} from "../api/notifications-api";
import { TableLoading } from "@/shared/components/loading/loading-system";

const PAGE_SIZE = 10;

type NotificationFilter = {
  id: string;
  label: string;
  status?: NotificationStatus;
  types?: NotificationType[];
};

const filters: NotificationFilter[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread", status: "UNREAD" },
  {
    id: "interviews",
    label: "Interviews",
    types: ["INTERVIEW_REMINDER", "INTERVIEW_FEEDBACK"],
  },
  { id: "roadmap", label: "Roadmap", types: ["ROADMAP_REMINDER"] },
  { id: "jobs", label: "Jobs", types: ["JOB_MATCH"] },
  { id: "goals", label: "Goals", types: ["CAREER_GOAL"] },
  {
    id: "system",
    label: "System",
    types: ["SYSTEM", "EMAIL", "IN_APP", "REMINDER"],
  },
];

export function NotificationList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const workspaceBase = useWorkspaceBase();
  const [selectedFilterId, setSelectedFilterId] = useState(filters[0].id);
  const [page, setPage] = useState(1);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const selectedFilter =
    filters.find((filter) => filter.id === selectedFilterId) ?? filters[0];
  const queryParams = useMemo<NotificationListParams>(
    () => ({
      page,
      limit: PAGE_SIZE,
      status: selectedFilter.status,
      types: selectedFilter.types,
    }),
    [page, selectedFilter.status, selectedFilter.types],
  );

  const notificationsQuery = useQuery({
    queryKey: notificationQueryKeys.list(queryParams),
    queryFn: () => notificationsApi.list(queryParams),
    staleTime: 30_000,
    retry: 2,
  });
  const unreadCountQuery = useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: notificationsApi.unreadCount,
    staleTime: 10_000,
    retry: 1,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      setConfirmClearOpen(false);
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      void refreshDashboardQueries(queryClient);
    },
  });
  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      void refreshDashboardQueries(queryClient);
    },
  });

  const notifications = notificationsQuery.data?.items ?? [];
  const pagination = notificationsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;

  useEffect(() => {
    setPage(1);
  }, [selectedFilterId]);

  useEffect(() => {
    if (pagination && page > pagination.totalPages && pagination.totalPages > 0) {
      setPage(pagination.totalPages);
    }
  }, [page, pagination]);

  const openNotification = (item: NotificationItem) => {
    if (item.status === "UNREAD") {
      markAsReadMutation.mutate(item.id);
    }

    if (item.actionLink) {
      router.push(resolveWorkspaceHref(workspaceBase, item.actionLink));
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-border/60 bg-muted/30 p-5 shadow-xl shadow-elevation/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Activity Center
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Track career updates, AI insights, reminders, and system
                activity.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-2xl border-border/60 bg-muted/30 px-4"
            disabled={
              markAllAsReadMutation.isPending ||
              (unreadCountQuery.data ?? 0) === 0
            }
            onClick={() => setConfirmClearOpen(true)}
          >
            {markAllAsReadMutation.isPending ? "Updating" : "Mark all read"}
          </Button>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => {
            const active = selectedFilterId === filter.id;
            return (
              <Button
                key={filter.id}
                type="button"
                variant={active ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 shrink-0 rounded-full px-4 text-xs font-semibold",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/55 hover:text-foreground",
                )}
                onClick={() => setSelectedFilterId(filter.id)}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>
      </section>

      {notificationsQuery.isLoading ? (
        <TableLoading rows={3} columns={1} />
      ) : notificationsQuery.isError ? (
        <div className="space-y-4 rounded-3xl border border-destructive/25 bg-destructive/10 p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">Notifications unavailable</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {(notificationsQuery.error as { message?: string })?.message ||
              "Unable to load notifications."}
          </p>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => notificationsQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState filterLabel={selectedFilter.label} />
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onOpen={() => openNotification(item)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-muted/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page{" "}
              <span className="font-semibold text-foreground">
                {pagination?.page ?? page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalPages}
              </span>
              {totalItems > 0 ? ` - ${totalItems} total` : ""}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-2xl"
                disabled={!pagination?.hasPreviousPage || notificationsQuery.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-2xl"
                disabled={!pagination?.hasNextPage || notificationsQuery.isFetching}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <AlertDialogContent className="rounded-3xl border-border/60 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Mark all notifications as read?</AlertDialogTitle>
            <AlertDialogDescription>
              This keeps your notification history, but removes unread badges
              from the current account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-2xl"
              onClick={() => markAllAsReadMutation.mutate()}
            >
              Mark all read
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({ filterLabel }: { filterLabel: string }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-muted/35 p-10 text-center">
      <Inbox className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
      <p className="font-semibold text-foreground">No notifications found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {filterLabel === "All"
          ? "Resume analysis, roadmap, interview, and job updates will appear here."
          : `There are no ${filterLabel.toLowerCase()} notifications right now.`}
      </p>
    </div>
  );
}

function NotificationCard({
  item,
  onOpen,
}: {
  item: NotificationItem;
  onOpen: () => void;
}) {
  const visual = getNotificationVisual(item);
  const isUnread = item.status === "UNREAD";
  const fallbackAction = !item.actionLink && isUnread;

  return (
    <Card
      className={cn(
        "group border shadow-sm transition-all hover:border-primary/30 hover:bg-muted/35",
        isUnread
          ? "border-primary/25 bg-primary/[0.045] shadow-primary/5"
          : "border-border/60 bg-muted/30 opacity-80 hover:opacity-100",
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
            visual.className,
          )}
        >
          <visual.icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              {isUnread ? (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
              ) : null}
              <h3
                className={cn(
                  "truncate text-sm text-foreground",
                  isUnread ? "font-semibold" : "font-medium",
                )}
              >
                {item.title}
              </h3>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {item.message}
          </p>
        </div>

        {item.actionLink || fallbackAction ? (
          <Button
            variant={isUnread ? "outline" : "ghost"}
            size="sm"
            className="h-9 rounded-2xl px-4 sm:self-center"
            onClick={onOpen}
          >
            {item.actionLink ? "Open" : "Mark read"}
            {item.actionLink ? <ArrowUpRight className="ml-2 h-4 w-4" /> : null}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

function getNotificationVisual(item: NotificationItem) {
  const haystack = `${item.type} ${item.title} ${item.message} ${item.actionLink ?? ""}`.toLowerCase();

  if (haystack.includes("resume")) {
    return {
      icon: FileText,
      className: "border-accent/20 bg-accent/10 text-accent",
    };
  }

  if (item.type === "ROADMAP_REMINDER" || haystack.includes("roadmap")) {
    return {
      icon: Route,
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  if (
    item.type === "INTERVIEW_REMINDER" ||
    item.type === "INTERVIEW_FEEDBACK" ||
    haystack.includes("interview")
  ) {
    return {
      icon: MessageSquare,
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  if (item.type === "JOB_MATCH" || haystack.includes("job")) {
    return {
      icon: BriefcaseBusiness,
      className: "border-accent/20 bg-accent/10 text-accent",
    };
  }

  if (item.type === "CAREER_GOAL" || haystack.includes("goal")) {
    return {
      icon: Target,
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  if (haystack.includes("achievement") || haystack.includes("badge")) {
    return {
      icon: Trophy,
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  }

  if (haystack.includes("fail") || haystack.includes("error")) {
    return {
      icon: AlertCircle,
      className: "border-destructive/20 bg-destructive/10 text-destructive",
    };
  }

  return {
    icon: Info,
    className: "border-border/60 bg-muted/40 text-muted-foreground",
  };
}
