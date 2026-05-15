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
      id: "intelligence",
      label: "Intelligence",
      items: [
        { id: "dashboard", label: "Snapshot", icon: LayoutDashboard, path: "" },
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
    }
  ],
  MENTOR: [
    {
      id: "mentor-hub",
      label: "Mentor Hub",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "" },
        { id: "students", label: "My Students", icon: UsersRound, path: "students" },
        { id: "schedule", label: "Schedule", icon: Map, path: "schedule" },
        { id: "reviews", label: "Review Queue", icon: FileText, path: "reviews" },
      ]
    }
  ],
  COACH: [
    {
      id: "coach-hub",
      label: "Coach Hub",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "" },
        { id: "students", label: "My Clients", icon: UsersRound, path: "students" },
        { id: "schedule", label: "Schedule", icon: Map, path: "schedule" },
      ]
    }
  ],
  ADMIN: [
    {
      id: "admin-hub",
      label: "System Administration",
      items: [
        { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "" },
        { id: "users", label: "User Management", icon: UsersRound, path: "users" },
        { id: "analytics", label: "Platform Analytics", icon: BarChart3, path: "analytics" },
        { id: "settings", label: "System Settings", icon: Settings, path: "settings" },
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
