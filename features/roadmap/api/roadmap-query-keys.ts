export const roadmapQueryKeys = {
  all: ["roadmap"] as const,
  latest: ["roadmap", "latest"] as const,
  detail: (id: string | null) => ["roadmap", "detail", id] as const,
};
