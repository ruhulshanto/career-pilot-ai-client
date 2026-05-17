"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  MoreHorizontal, 
  ShieldAlert, 
  ShieldCheck, 
  UserCircle,
  Clock,
  Loader2,
  UsersRound,
  FilterX
} from "lucide-react";

import { adminApi } from "@/services/api/admin";
import { useToast } from "@/shared/hooks/use-toast";
import { cn } from "@/shared/lib/utils";
import { getPublicImageUrl } from "@/shared/utils/image";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { TableLoading } from "@/shared/components/loading/loading-system";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/components/ui/alert-dialog";

import { ProfileImagePreview } from "@/shared/components/ui/profile-image-preview";
import { AdminUserProfileModal } from "./admin-user-profile-modal";
import { AdminUserActivityModal } from "./admin-user-activity-modal";
import { useDebounce } from "@/shared/hooks/use-debounce";

export function AdminUsersManager() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedDetailUserId, setSelectedDetailUserId] = useState<string | null>(null);
  const [selectedActivityUser, setSelectedActivityUser] = useState<{ id: string; username: string } | null>(null);
  const [selectedSuspendUser, setSelectedSuspendUser] = useState<{ id: string; username: string; isActive: boolean; deletedAt?: string | null } | null>(null);

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getRelativeTime = (dateStr: string) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
    const diffHours = Math.round(diff / (1000 * 60 * 60));
    const diffMins = Math.round(diff / (1000 * 60));
    if (Math.abs(diffMins) < 60) return rtf.format(diffMins, "minute");
    if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
    return rtf.format(diffDays, "day");
  };

  const query = useQuery({
    queryKey: ["admin-users", page, limit, debouncedSearch, role, status],
    queryFn: () =>
      adminApi.getUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
        role: role !== "all" ? role : undefined,
        status: status !== "all" ? status : undefined,
      }),
    refetchInterval: 60_000,
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateUserStatus(id, isActive),
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: `Account ${data.isActive ? "Restored" : "Suspended"}`,
        description: `User account has been successfully ${data.isActive ? "restored to active status" : "suspended"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedSuspendUser(null);
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: err.response?.data?.message || err.message || "Failed to update user account status.",
      });
      setSelectedSuspendUser(null);
    },
  });

  const handleResetFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setPage(1);
  };

  if (query.isLoading) return <TableLoading rows={5} columns={4} />;

  return (
    <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
      <CardHeader className="border-b border-border/40 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <UsersRound className="h-5 w-5 text-primary" />
              User Directory
            </CardTitle>
            <CardDescription className="mt-1">
              Browse and manage all registered accounts on the platform.
            </CardDescription>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="w-full pl-9 sm:w-[250px] rounded-xl"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full sm:w-[140px] items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="USER">User</option>
              <option value="MENTOR">Mentor</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full sm:w-[140px] items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="unverified">Unverified</option>
              <option value="deleted">Deleted</option>
            </select>
            
            {(search || role !== "all" || status !== "all") && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleResetFilters}
                className="shrink-0 h-10 w-10 rounded-xl"
                title="Reset filters"
              >
                <FilterX className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold w-[300px]">User</th>
                <th className="px-6 py-4 font-semibold">Role & Status</th>
                <th className="px-6 py-4 font-semibold">Activity</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {query.isError ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <ShieldAlert className="mx-auto h-8 w-8 text-destructive/50 mb-3" />
                    <p>Failed to load users.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => query.refetch()}
                      className="mt-4 rounded-xl"
                    >
                      Try again
                    </Button>
                  </td>
                </tr>
              ) : query.data?.users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <UserCircle className="mx-auto h-8 w-8 opacity-20 mb-3" />
                    <p>No users found matching your filters.</p>
                    {(search || role !== "all" || status !== "all") && (
                      <Button 
                        variant="link" 
                        onClick={handleResetFilters}
                        className="mt-2 text-primary"
                      >
                        Clear filters
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                query.data?.users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ProfileImagePreview avatarUrl={user.avatarUrl} name={user.firstName}>
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted">
                            {user.avatarUrl ? (
                              <img
                                src={getPublicImageUrl(user.avatarUrl) ?? ""}
                                alt={user.firstName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-accent/10 font-bold text-accent">
                                {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </ProfileImagePreview>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                          user.role === "ADMIN" ? "bg-destructive/10 text-destructive" :
                          user.role === "MENTOR" ? "bg-accent/10 text-accent" :
                          "bg-primary/10 text-primary"
                        )}>
                          {user.role}
                        </span>
                        
                        {user.deletedAt ? (
                          <span className="flex items-center gap-1 text-[11px] text-destructive font-medium">
                            <ShieldAlert className="h-3 w-3" /> Deleted
                          </span>
                        ) : !user.isActive ? (
                          <span className="flex items-center gap-1 text-[11px] text-destructive font-semibold">
                            <ShieldAlert className="h-3 w-3" /> Suspended
                          </span>
                        ) : user.emailVerifiedAt ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                            <Clock className="h-3 w-3" /> Unverified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                        <p>
                          <span className="font-medium text-foreground/80">Joined:</span>{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium text-foreground/80">Last login:</span>{" "}
                          {user.lastLoginAt 
                            ? getRelativeTime(user.lastLoginAt)
                            : "Never"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl border-border/40 shadow-xl backdrop-blur-xl bg-background/95 p-1.5">
                          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                            @{user.username}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1" />
                          <DropdownMenuItem 
                            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium"
                            onClick={() => setSelectedDetailUserId(user.id)}
                          >
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium"
                            onClick={() => setSelectedActivityUser({ id: user.id, username: user.username })}
                          >
                            Activity Logs
                          </DropdownMenuItem>
                          {user.role !== "ADMIN" && (
                            <>
                              <DropdownMenuSeparator className="my-1" />
                              <DropdownMenuItem 
                                className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
                                onClick={() => setSelectedSuspendUser({
                                  id: user.id,
                                  username: user.username,
                                  isActive: user.isActive,
                                  deletedAt: user.deletedAt
                                })}
                              >
                                {user.deletedAt ? "Restore Account" : user.isActive ? "Suspend Account" : "Un-suspend Account"}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {query.data && query.data.total > 0 && (
          <div className="flex items-center justify-between border-t border-border/40 px-6 py-4 bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium text-foreground">{(page - 1) * limit + 1}</span> to{" "}
              <span className="font-medium text-foreground">
                {Math.min(page * limit, query.data.total)}
              </span>{" "}
              of <span className="font-medium text-foreground">{query.data.total}</span> users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg px-3"
                disabled={page === 1 || query.isFetching}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 text-sm font-medium">
                {query.isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-2" />
                ) : (
                  <span className="mx-2 text-muted-foreground">Page {page}</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg px-3"
                disabled={page * limit >= query.data.total || query.isFetching}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Modals & Dialogs */}
      <AdminUserProfileModal 
        userId={selectedDetailUserId} 
        onClose={() => setSelectedDetailUserId(null)} 
      />

      <AdminUserActivityModal 
        userId={selectedActivityUser?.id ?? null} 
        username={selectedActivityUser?.username ?? ""} 
        onClose={() => setSelectedActivityUser(null)} 
      />

      <AlertDialog open={!!selectedSuspendUser} onOpenChange={(open) => !open && setSelectedSuspendUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedSuspendUser?.deletedAt 
                ? "Restore Deleted Account?" 
                : selectedSuspendUser?.isActive 
                  ? "Suspend User Account?" 
                  : "Un-suspend User Account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedSuspendUser?.deletedAt 
                ? `Are you sure you want to restore @${selectedSuspendUser?.username}? They will regain full access to the platform.`
                : selectedSuspendUser?.isActive 
                  ? `Are you sure you want to suspend @${selectedSuspendUser?.username}? They will be immediately logged out and blocked from accessing authenticated platform features.`
                  : `Are you sure you want to restore active status for @${selectedSuspendUser?.username}? They will be able to log in and access the platform again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={suspendMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                selectedSuspendUser?.isActive ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-emerald-500 hover:bg-emerald-600 text-white"
              )}
              disabled={suspendMutation.isPending}
              onClick={() => {
                if (selectedSuspendUser) {
                  suspendMutation.mutate({
                    id: selectedSuspendUser.id,
                    isActive: !selectedSuspendUser.isActive
                  });
                }
              }}
            >
              {suspendMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : selectedSuspendUser?.deletedAt ? (
                "Restore Account"
              ) : selectedSuspendUser?.isActive ? (
                "Yes, Suspend Account"
              ) : (
                "Yes, Un-suspend Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
