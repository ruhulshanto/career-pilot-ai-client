export type WorkspaceRole = "USER" | "ADMIN" | "COACH" | "MENTOR" | null | undefined;

export function getRoleDashboardHref(role: WorkspaceRole) {
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "COACH" || role === "MENTOR") return "/dashboard/mentor";
  return "/dashboard/user";
}

export function getWorkspaceBaseFromPath(pathname: string, role?: WorkspaceRole) {
  if (pathname.startsWith("/dashboard/admin")) return "/dashboard/admin";
  if (pathname.startsWith("/dashboard/mentor")) return "/dashboard/mentor";
  if (pathname.startsWith("/dashboard/user")) return "/dashboard/user";
  return getRoleDashboardHref(role);
}

export function getWorkspaceHref(base: string, path = "") {
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath ? `${base}/${normalizedPath}` : base;
}

export function resolveWorkspaceHref(base: string, href?: string | null) {
  if (!href) return base;

  return href.replace(/^\/dashboard\/(user|admin|mentor)/, base);
}

export function getRoleWorkspaceLabel(role: WorkspaceRole) {
  if (role === "ADMIN") return "Admin Workspace";
  if (role === "COACH" || role === "MENTOR") return "Mentor Workspace";
  return "User Workspace";
}
