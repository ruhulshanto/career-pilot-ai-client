"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Award, ExternalLink, Share2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useWorkspaceBase } from "@/shared/hooks/use-workspace-base";
import { getWorkspaceHref } from "@/shared/lib/role-routing";
import { profileApi } from "@/services/api/profile";
import { ShareProfileModal } from "./share-profile-modal";
import { getPublicImageUrl } from "@/shared/utils/image";

export function DashboardProfileCard() {
  const [shareOpen, setShareOpen] = useState(false);
  const workspaceBase = useWorkspaceBase();
  const portfolioQuery = useQuery({
    queryKey: ["profile", "portfolio"],
    queryFn: profileApi.getMyPortfolio,
    staleTime: 30_000,
    retry: 1,
  });
  const portfolio = portfolioQuery.data;
  const profileUrl =
    typeof window !== "undefined" && portfolio
      ? `${window.location.origin}/u/${portfolio.user.username}`
      : "";

  if (!portfolio) return null;

  return (
    <>
      <Card className="border border-border shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-border/70 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40">
              {portfolio.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getPublicImageUrl(portfolio.user.avatarUrl) ?? ""}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">Public career profile</CardTitle>
              <p className="text-sm text-muted-foreground">
                {portfolio.stats.profileCompletion}% complete
                {portfolio.user.isPublicProfile ? " - public" : " - private"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="h-10 rounded-2xl">
              <Link href={getWorkspaceHref(workspaceBase, "settings")}>
                Edit profile
              </Link>
            </Button>
            <Button
              className="h-10 rounded-2xl"
              disabled={!portfolio.user.isPublicProfile}
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 p-6 md:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            <div className="h-2 rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${portfolio.stats.profileCompletion}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="ATS" value={portfolio.stats.atsScore} />
              <Stat label="Readiness" value={portfolio.stats.interviewReadiness} />
              <Stat label="Roadmap" value={portfolio.stats.roadmapProgress} />
              <Stat label="Applications" value={portfolio.stats.applicationsSent} />
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Award className="h-4 w-4 text-accent" />
              Latest achievements
            </div>
            {portfolio.achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Achievements unlock as you analyze a resume, complete interviews,
                start a roadmap, and track applications.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {portfolio.achievements.slice(0, 3).map((achievement) => (
                  <span
                    key={achievement.id}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {achievement.title}
                  </span>
                ))}
              </div>
            )}
            {portfolio.user.isPublicProfile ? (
              <Button asChild variant="ghost" className="mt-4 h-9 rounded-xl px-0">
                <Link href={`/u/${portfolio.user.username}`}>
                  View public page
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <ShareProfileModal
        open={shareOpen}
        profileUrl={profileUrl}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
