"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  ClipboardCheck,
  Compass,
  FileSearch,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Route,
  Settings,
  Target,
  UserCircle,
  X,
} from "lucide-react";
import { CareerPilotTrajectoryIcon } from "@/shared/components/icons/CareerPilotTrajectoryIcon";

import { Button } from "@/shared/components/ui/button";
import {
  ThemeModeDropdown,
  ThemeModeToggle,
} from "@/shared/components/theme/theme-mode-toggle";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { cn } from "@/shared/lib/utils";
import { getRoleDashboardHref, getWorkspaceHref } from "@/shared/lib/role-routing";
import { useAuthStore } from "@/shared/store/auth-store";
import { authApi } from "@/services/auth/auth-api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { BrandLogo } from "@/shared/components/layout/brand-logo";
import { getPublicImageUrl } from "@/shared/utils/image";
import { ProfileImagePreview } from "@/shared/components/ui/profile-image-preview";

const navItems = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

const careerTools = [
  {
    label: "Resume Analysis",
    href: "/#resume-analysis",
    description: "Turn resume gaps into role-specific edits.",
    icon: FileSearch,
  },
  {
    label: "ATS Scanner",
    href: "/#resume-analysis",
    description: "Check structure, keywords, and clarity.",
    icon: ClipboardCheck,
  },
  {
    label: "Career Roadmap",
    href: "/#workflow",
    description: "Map target roles into milestones.",
    icon: Route,
  },
  {
    label: "Interview Practice",
    href: "/#features",
    description: "Practice technical and behavioral answers.",
    icon: MessageSquareText,
  },
  {
    label: "Job Match Assistant",
    href: "/#workflow",
    description: "Track real roles and application movement.",
    icon: Target,
  },
  {
    label: "AI Career Copilot",
    href: "/#assistant",
    description: "Ask focused career strategy questions.",
    icon: Bot,
  },
] as const;

const resourceLinks = [
  {
    label: "Blog",
    href: "/blog",
    description: "Practical career operating notes.",
    icon: BookOpen,
  },
  {
    label: "Career Guides",
    href: "/blog",
    description: "Resume, roadmap, interview, and job search guides.",
    icon: Compass,
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Answers for reviewers and users.",
    icon: HelpCircle,
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Review, demo, and deployment contact.",
    icon: MessageSquareText,
  },
  {
    label: "Privacy",
    href: "/privacy",
    description: "How public and workspace data is handled.",
    icon: UserCircle,
  },
  {
    label: "Terms",
    href: "/terms",
    description: "Responsible AI career support terms.",
    icon: ClipboardCheck,
  },
] as const;

const isRouteActive = (pathname: string | null, href: string) => {
  if (!pathname || href.includes("#")) return false;
  return pathname === href;
};

function NavDropdown({
  label,
  items,
  active,
}: {
  label: string;
  items: typeof careerTools | typeof resourceLinks;
  active?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 rounded-full px-4 text-sm font-medium transition-all",
            active
              ? "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
          aria-label={`Open ${label} menu`}
        >
          {label}
          <ChevronDown className="h-3.5 w-3.5 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-[22rem] rounded-xl border-border/60 bg-popover p-3 shadow-xl shadow-elevation/10 backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground/70 mb-1">
          {label}
        </DropdownMenuLabel>
        <div className="grid gap-1">
          {items.map((item) => (
            <DropdownMenuItem
              key={`${label}-${item.label}`}
              asChild
              className="cursor-pointer rounded-lg p-0 focus:bg-muted/60 transition-colors"
            >
              <Link href={item.href} className="flex gap-3 p-3 hover:bg-muted/40">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground/80">
                    {item.description}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken, logout, role, user, hasHydrated } = useAuthStore();
  const isAuthenticated = hasHydrated && Boolean(accessToken);
  const dashboardHref = getRoleDashboardHref(role);
  const displayName = user
    ? user.name || `${user.firstName} ${user.lastName}`
    : "Career Pilot User";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      closeMobileMenu();
      router.push("/");
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "dark-surface-topbar border-border/50 bg-background/95 shadow-sm shadow-elevation/5 backdrop-blur-xl dark:border-border/70"
          : "border-transparent bg-background/75 backdrop-blur-md dark:bg-background/60",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo variant="navbar" className="transition-transform hover:scale-105" />

        <div className="hidden items-center rounded-full border border-border/40 bg-card/40 p-1 lg:flex backdrop-blur-sm">
          <Link
            href={isAuthenticated ? getWorkspaceHref(dashboardHref, "resume") : "/login?next=/dashboard/user/resume"}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              isRouteActive(pathname, "/resume")
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
            )}
          >
            Resume Analysis
          </Link>
          <NavDropdown label="Career Tools" items={careerTools} />
          <NavDropdown
            label="Resources"
            items={resourceLinks}
            active={["/blog", "/faq", "/contact", "/privacy", "/terms"].includes(
              pathname ?? "",
            )}
          />
          <Link
            href="/pricing"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              isRouteActive(pathname, "/pricing")
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              isRouteActive(pathname, "/about")
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            About
          </Link>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeModeDropdown />
          {isAuthenticated && (
            <div className="relative">
              <NotificationBell />
            </div>
          )}
          {!hasHydrated ? (
            <div className="flex items-center gap-3" aria-label="Checking session">
              <div className="h-9 w-24 animate-pulse rounded-lg bg-muted/60" />
              <div className="h-9 w-9 animate-pulse rounded-lg bg-muted/60" />
            </div>
          ) : isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="sm" className="border-border/50 hover:border-border/80">
                <Link href={dashboardHref}>
                  <LayoutDashboard className="h-4 w-4" />
                  Open Workspace
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 rounded-lg border border-border/50 bg-background/40 px-2 transition-all hover:border-border/80 hover:bg-muted/50"
                    aria-label="Open profile menu"
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
                      {user?.avatarUrl ? (
                        <img
                          src={getPublicImageUrl(user.avatarUrl) ?? ""}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials || "U"
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground/60 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl border-border/60 bg-popover p-3 shadow-xl shadow-elevation/10">
                  <DropdownMenuLabel className="mb-2 rounded-lg bg-muted/35 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <ProfileImagePreview avatarUrl={user?.avatarUrl} name={displayName}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer hover:opacity-90 transition-opacity">
                          {user?.avatarUrl ? (
                            <img
                              src={getPublicImageUrl(user.avatarUrl) ?? ""}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials || "U"
                          )}
                        </div>
                      </ProfileImagePreview>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {displayName}
                        </p>
                        <p className="truncate text-xs font-normal text-muted-foreground/80">
                          {user?.email || "Signed in"}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40" />
                  <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground/70">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    <Link href={getWorkspaceHref(dashboardHref, "settings/profile")}>
                      <UserCircle className="mr-3 h-4 w-4 text-primary/80" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40 my-2" />
                  <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-semibold text-muted-foreground/70">
                    Workspace
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    <Link href={dashboardHref}>
                      <LayoutDashboard className="mr-3 h-4 w-4 text-primary/80" />
                      Workspace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    <Link href={getWorkspaceHref(dashboardHref, "notifications")}>
                      <Bell className="mr-3 h-4 w-4 text-primary/80" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary">
                    <Link href={getWorkspaceHref(dashboardHref, "settings")}>
                      <Settings className="mr-3 h-4 w-4 text-primary/80" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <div className="px-1 py-2">
                    <ThemeModeToggle />
                  </div>
                  <DropdownMenuSeparator className="bg-border/40 my-2" />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-lg p-3 text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onSelect={(event) => {
                      event.preventDefault();
                      void handleLogout();
                    }}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="font-semibold gap-2">
                <Link href="/register">
                  <CareerPilotTrajectoryIcon className="h-4 w-4" />
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background/40 text-muted-foreground transition-all hover:border-border/80 hover:bg-muted/50 hover:text-foreground lg:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
          aria-controls="public-mobile-navigation"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div
          id="public-mobile-navigation"
          className="border-t border-border/40 bg-background/98 px-4 py-4 shadow-xl shadow-elevation/10 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-4">
            <div className="grid gap-1">
              <Link
                href={isAuthenticated ? getWorkspaceHref(dashboardHref, "resume") : "/login?next=/dashboard/user/resume"}
                onClick={closeMobileMenu}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isRouteActive(pathname, "/resume")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
                )}
              >
                Resume Analysis
              </Link>
              {navItems.map((item) => {
                const isActive = isRouteActive(pathname, item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-2">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Career Tools
                </p>
                {careerTools.map((item) => (
                  <Link
                    key={`mobile-${item.label}`}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="pt-2">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/70">
                  Resources
                </p>
                {resourceLinks.map((item) => (
                  <Link
                    key={`mobile-${item.label}`}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-2 border-t border-border/40 pt-4">
              <ThemeModeToggle />
              {!hasHydrated ? (
                <div className="grid gap-2" aria-label="Checking session">
                  <div className="h-11 animate-pulse rounded-lg bg-muted/60" />
                  <div className="h-11 animate-pulse rounded-lg bg-muted/60" />
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <ProfileImagePreview avatarUrl={user?.avatarUrl} name={displayName}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                          {user?.avatarUrl ? (
                            <img
                              src={getPublicImageUrl(user.avatarUrl) ?? ""}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials || "U"
                          )}
                        </div>
                      </ProfileImagePreview>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground/80">
                          {user?.email || "Signed in"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={dashboardHref} onClick={closeMobileMenu}>
                      <LayoutDashboard className="h-4 w-4" />
                      Open Workspace
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={getWorkspaceHref(dashboardHref, "settings/profile")}
                      onClick={closeMobileMenu}
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={dashboardHref} onClick={closeMobileMenu}>
                      <LayoutDashboard className="h-4 w-4" />
                      Workspace
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={getWorkspaceHref(dashboardHref, "notifications")}
                      onClick={closeMobileMenu}
                    >
                      <Bell className="h-4 w-4" />
                      Notifications
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={getWorkspaceHref(dashboardHref, "settings")}
                      onClick={closeMobileMenu}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => void handleLogout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="w-full">
                    <Link href="/register" onClick={closeMobileMenu}>
                      <CareerPilotTrajectoryIcon className="h-4 w-4" />
                      Get Started
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={closeMobileMenu}>
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
