"use client";

import { usePathname } from "next/navigation";
import {
  getWorkspaceBaseFromPath,
  getWorkspaceHref,
} from "@/shared/lib/role-routing";
import { useAuthStore } from "@/shared/store/auth-store";

export function useWorkspaceBase() {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.role);

  return getWorkspaceBaseFromPath(pathname, role);
}

export function useWorkspaceHref(path = "") {
  return getWorkspaceHref(useWorkspaceBase(), path);
}
