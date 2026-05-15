export const resumeQueryKeys = {
  all: ["resume"] as const,
  history: () => ["resume", "history"] as const,
  analysis: (resumeId: string | null) =>
    ["resume", "analysis", resumeId] as const,
};
