"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import {
  getWorkspaceHref,
  resolveWorkspaceHref,
} from "@/shared/lib/role-routing";
import { refreshDashboardQueries } from "@/features/dashboard/utils/dashboard-query-sync";
import { formatRelativeTime } from "@/features/dashboard/utils/dashboard-format";
import {
  notificationQueryKeys,
  notificationsApi,
  type NotificationItem,
} from "../api/notifications-api";
import { TableLoading } from "@/shared/components/loading/loading-system";

export function NotificationBell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const workspaceBase = useWorkspaceBase();
  const notificationsQuery = useQuery({
    queryKey: notificationQueryKeys.list("UNREAD"),
    queryFn: () => notificationsApi.list("UNREAD"),
    refetchInterval: 20_000,
    staleTime: 10_000,
    retry: 1,
  });
  const unreadCountQuery = useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 20_000,
    staleTime: 10_000,
    retry: 1,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      void refreshDashboardQueries(queryClient);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      void refreshDashboardQueries(queryClient);
    },
  });

  const items = notificationsQuery.data?.items.slice(0, 5) ?? [];
  const unreadCount =
    unreadCountQuery.data ?? notificationsQuery.data?.pagination?.total ?? 0;

  const openNotification = (item: NotificationItem) => {
    if (item.status === "UNREAD") {
      markAsReadMutation.mutate(item.id);
    }
    router.push(
      resolveWorkspaceHref(
        workspaceBase,
        item.actionLink || getWorkspaceHref(workspaceBase, "notifications"),
      ),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-2xl border border-border/60 bg-muted/40 text-foreground hover:border-primary/30 hover:bg-muted/60 sm:h-11 sm:w-11"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4 text-primary" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-[#08111F]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(360px,calc(100vw-2rem))] rounded-2xl border-border/60 bg-card/95 p-2 text-foreground shadow-2xl shadow-elevation/20 backdrop-blur-xl">
        <div className="flex items-center justify-between px-2 py-2">
          <DropdownMenuLabel className="p-0 text-sm">
            Notifications
          </DropdownMenuLabel>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl px-2 text-xs"
            disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
            onClick={() => markAllAsReadMutation.mutate()}
          >
            <CheckCheck className="mr-1 h-3.5 w-3.5" />
            Read all
          </Button>
        </div>
        <DropdownMenuSeparator className="bg-border" />

        {notificationsQuery.isLoading ? (
          <div className="p-4">
            <TableLoading rows={2} columns={1} />
          </div>
        ) : items.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <Inbox className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">All caught up</p>
            <p className="mt-1 text-xs text-muted-foreground">
              New reminders will appear here.
            </p>
          </div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="cursor-pointer rounded-xl p-3 focus:bg-muted/40"
                onSelect={(event) => {
                  event.preventDefault();
                  openNotification(item);
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {item.message}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className={cn("cursor-pointer justify-center rounded-xl text-sm")}
          onSelect={(event) => {
            event.preventDefault();
            router.push(getWorkspaceHref(workspaceBase, "notifications"));
          }}
        >
          View notification center
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
