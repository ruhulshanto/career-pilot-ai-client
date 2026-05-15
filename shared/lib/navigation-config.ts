import {
  LayoutDashboard,
  FileText,
  Map,
  MessageSquare,
  Briefcase,
  Settings,
  Bell,
  BarChart3,
  SearchCheck,
  UsersRound,
  Bot,
  UserCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WorkspaceRole } from "./role-routing";

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string; // relative to workspace base
  badge?: string;
  requiresStage?: number; // For progressive disclosure
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAVIGATION_CONFIG: Record<NonNullable<WorkspaceRole>, NavGroup[]> = {
  USER: [
    {
      id: "home",
      label: "Home",
      items: [
        { id: "dashboard", label: "Dashboard Snapshot", icon: LayoutDashboard, path: "" },
      ]
    },
    {
      id: "intelligence",
      label: "Intelligence",
      items: [
        { id: "resume", label: "Resume Lab", icon: FileText, path: "resume" },
        { id: "skills", label: "Skill Matrix", icon: BarChart3, path: "skills" },
      ]
    },
    {
      id: "execution",
      label: "Execution",
      items: [
        { id: "jobs", label: "Job Hub", icon: SearchCheck, path: "jobs" },
        { id: "roadmap", label: "Career Roadmap", icon: Map, path: "roadmap" },
        { id: "interview", label: "Interview Studio", icon: MessageSquare, path: "interview" },
      ]
    },
    {
      id: "network",
      label: "Network",
      items: [
        { id: "mentor", label: "Mentorship", icon: UsersRound, path: "mentor" },
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        { id: "settings", label: "Settings / Preferences", icon: Settings, path: "settings" },
      ]
    }
  ],
  MENTOR: [
    {
      id: "home",
      label: "Home",
      items: [
        { id: "dashboard", label: "Dashboard Snapshot", icon: LayoutDashboard, path: "" },
      ]
    },
    {
      id: "mentor-hub",
      label: "Mentor Hub",
      items: [
        { id: "students", label: "My Students", icon: UsersRound, path: "students" },
        { id: "schedule", label: "Schedule", icon: Map, path: "schedule" },
        { id: "reviews", label: "Review Queue", icon: FileText, path: "reviews" },
      ]
    },
    {
      id: "intelligence",
      label: "Intelligence",
      items: [
        { id: "resume", label: "Resume Lab", icon: FileText, path: "resume" },
        { id: "skills", label: "Skill Matrix", icon: BarChart3, path: "skills" },
      ]
    },
    {
      id: "execution",
      label: "Execution",
      items: [
        { id: "jobs", label: "Job Hub", icon: SearchCheck, path: "jobs" },
        { id: "roadmap", label: "Career Roadmap", icon: Map, path: "roadmap" },
        { id: "interview", label: "Interview Studio", icon: MessageSquare, path: "interview" },
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        { id: "settings", label: "Settings / Preferences", icon: Settings, path: "settings" },
      ]
    }
  ],
  COACH: [
    {
      id: "home",
      label: "Home",
      items: [
        { id: "dashboard", label: "Dashboard Snapshot", icon: LayoutDashboard, path: "" },
      ]
    },
    {
      id: "coach-hub",
      label: "Coach Hub",
      items: [
        { id: "students", label: "My Clients", icon: UsersRound, path: "students" },
        { id: "schedule", label: "Schedule", icon: Map, path: "schedule" },
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        { id: "settings", label: "Settings / Preferences", icon: Settings, path: "settings" },
      ]
    }
  ],
  ADMIN: [
    {
      id: "home",
      label: "Home",
      items: [
        { id: "dashboard", label: "Dashboard Snapshot", icon: LayoutDashboard, path: "" },
      ]
    },
    {
      id: "admin-hub",
      label: "System Administration",
      items: [
        { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "" },
        { id: "users", label: "User Management", icon: UsersRound, path: "users" },
        { id: "analytics", label: "Platform Analytics", icon: BarChart3, path: "analytics" },
        { id: "mentor", label: "Mentor Management", icon: UsersRound, path: "mentor" },
      ]
    },
    {
      id: "intelligence",
      label: "Intelligence",
      items: [
        { id: "resume", label: "Resume Lab", icon: FileText, path: "resume" },
        { id: "skills", label: "Skill Matrix", icon: BarChart3, path: "skills" },
      ]
    },
    {
      id: "execution",
      label: "Execution",
      items: [
        { id: "jobs", label: "Job Hub", icon: SearchCheck, path: "jobs" },
        { id: "roadmap", label: "Career Roadmap", icon: Map, path: "roadmap" },
        { id: "interview", label: "Interview Studio", icon: MessageSquare, path: "interview" },
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        { id: "settings", label: "Settings / Preferences", icon: Settings, path: "settings" },
      ]
    }
  ]
};

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard, path: "" },
  { id: "jobs", label: "Jobs", icon: Briefcase, path: "jobs" },
  { id: "copilot", label: "AI Copilot", icon: Bot, path: "chat" }, // Special floating action
  { id: "resume", label: "Resume", icon: FileText, path: "resume" },
  { id: "menu", label: "Menu", icon: UserCircle, path: "#menu" }, // Triggers drawer
];

export function getNavigationForRole(role: WorkspaceRole): NavGroup[] {
  if (!role) return [];
  return NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG["USER"];
}
