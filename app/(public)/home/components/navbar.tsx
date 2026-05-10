"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  Sparkles,
  FileText,
  MessageCircle,
  Star,
  Zap,
  Shield,
  ChevronDown,
  Home,
  Briefcase,
  Users,
  Crown,
  Moon,
  Sun,
  Search,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/shared/store/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/shared/components/ui/dropdown-menu";

// Navigation items for unauthenticated users
const publicNavItems = [
  { label: "AI Dashboard", href: "/dashboard/user", icon: Home },
  {
    label: "Resume Intelligence",
    href: "/dashboard/user/resume",
    icon: FileText,
  },
  {
    label: "Interview AI",
    href: "/dashboard/user/interview",
    icon: MessageCircle,
  },
  { label: "Career Roadmap", href: "/dashboard/user/roadmap", icon: Briefcase },
  { label: "AI Assistant", href: "/dashboard/user/chat", icon: Sparkles },
] as const;

// Navigation items for authenticated users
const authenticatedNavItems = [
  { label: "AI Dashboard", href: "/dashboard/user", icon: Home },
  {
    label: "Resume Intelligence",
    href: "/dashboard/user/resume",
    icon: FileText,
  },
  {
    label: "Interview AI",
    href: "/dashboard/user/interview",
    icon: MessageCircle,
  },
  { label: "Career Roadmap", href: "/dashboard/user/roadmap", icon: Briefcase },
  { label: "AI Assistant", href: "/dashboard/user/chat", icon: Sparkles },
] as const;

// Quick actions for authenticated users
const quickActions = [
  { label: "Upload Resume", href: "/dashboard/upload", icon: FileText },
  {
    label: "Start Interview Prep",
    href: "/dashboard/interview",
    icon: MessageCircle,
  },
  { label: "Get Career Advice", href: "/dashboard/advice", icon: Sparkles },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { accessToken, logout, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = !!accessToken;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for dark mode preference
  useEffect(() => {
    const isDark =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-white/10 bg-[#060B18]/90 shadow-lg shadow-black/20 backdrop-blur-xl"
          : "border-white/5 bg-[#060B18]/70 backdrop-blur-md",
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with Animation */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
              Career<span className="text-primary">AI</span>
            </span>
            <span className="text-xs text-primary ml-1 font-medium">Beta</span>
          </div>
        </Link>

        {/* Desktop Navigation with Active State */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = item.href as string;
            const isActive =
              pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-9 w-48 rounded-full border border-white/10 bg-white/5 px-3 pl-9 text-sm text-white transition-all placeholder:text-slate-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 lg:w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </form>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell with Badge */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/dashboard/user/notifications")}
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              </div>

              {/* User Dropdown with Animation */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 rounded-full hover:bg-muted/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-sm font-semibold shadow-md group-hover:scale-105 transition-transform">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 animate-in slide-in-from-top-2"
                >
                  <DropdownMenuLabel className="flex flex-col gap-1">
                    <div className="text-sm font-semibold">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user?.email || "user@example.com"}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Quick Actions Submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Actions
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <DropdownMenuItem key={action.label} asChild>
                            <Link href={action.href}>
                              <Icon className="w-4 h-4 mr-2" />
                              {action.label}
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/user/settings"
                      className="cursor-pointer"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/user/profile"
                      className="cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {/* Subscription Status */}
                  <div className="px-2 py-1.5 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Plan:</span>
                      <span className="font-semibold text-primary">Pro</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-full hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="h-9 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu with Animation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background/95 backdrop-blur-xl border-t border-border/50 z-40 animate-in slide-in-from-top-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 overflow-y-auto h-full">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full h-11 px-4 pl-11 text-base rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </form>

            {/* Mobile Navigation Items */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-xl"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions for Authenticated Users */}
            {isAuthenticated && (
              <div className="mt-6">
                <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Actions
                </div>
                <div className="space-y-1">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors rounded-xl"
                      >
                        <Icon className="w-5 h-5" />
                        {action.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-border/50 pt-6 mt-6 space-y-3">
              {/* Dark Mode Toggle for Mobile */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start rounded-xl"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 mr-2" />
                ) : (
                  <Moon className="w-4 h-4 mr-2" />
                )}
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Button>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard/user/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start rounded-xl"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </Button>
                  </Link>
                  <Link
                    href="/dashboard/user/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start rounded-xl"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-xl"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-primary/80 rounded-xl"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Join Network
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
