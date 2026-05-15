export type DashboardActivity = {
  id: string;
  source: "analytics" | "resume" | "interview" | "roadmap" | "ai-feedback";
  eventType: string;
  title: string;
  description: string;
  entityType?: string;
  entityId?: string;
  score?: number;
  createdAt: string;
};

export type DashboardSkillGap = {
  skill: string;
  gapScore: number;
  currentLevel?: string;
  targetLevel?: string;
  source: "roadmap" | "ai-feedback";
  recommendation?: string;
};

export type DashboardAiJob = {
  id: string;
  type: string;
  entityType: "resume" | "roadmap" | "interview" | "ai-feedback";
  entityId: string;
  status: string;
  progressStage: string;
  progress?: number;
  createdAt: string;
  updatedAt?: string;
};

export type DashboardMetricSummary = {
  totalResumes: number;
  resumesAnalyzed: number;
  applicationsTracked: number;
  interviewPracticeCount: number;
  aiUsageCount: number;
  activeCareerGoals: number;
  completedRoadmapMilestones: number;
  totalRoadmapMilestones: number;
  latestResumeScore: number;
  roadmapCompletion: number;
};

export type DashboardTrend = {
  key:
    | "resumeScore"
    | "resumeAnalyses"
    | "applications"
    | "interviews"
    | "aiUsage";
  label: string;
  current: number;
  previous: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
  unit: "count" | "score" | "percent";
  series?: Array<{ date: string; value: number | null }>;
};

export type DashboardInsight = {
  id: string;
  severity: "info" | "success" | "warning";
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
  source: "resume" | "roadmap" | "interview" | "jobs" | "ai" | "goals";
};

export type DashboardSummary = {
  resumeScore: number;
  interviewAverage: number;
  careerReadiness: number;
  roadmapProgress: number;
  jobMatches: number;
  unreadNotifications: number;
  metrics: DashboardMetricSummary;
  trends: DashboardTrend[];
  insights: DashboardInsight[];
  recentActivity: DashboardActivity[];
  topSkillGaps: DashboardSkillGap[];
  processingAiJobs: DashboardAiJob[];
  recommendedJobs: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    jobUrl?: string;
    matchScore: number;
    skillsMatch: string[];
    missingSkills: string[];
    matchReasons: string[];
    recommendedImprovements: string[];
    source: string;
    sourceLabel: string;
    isSearchAssistant: boolean;
    applicationStatus?: string;
  }>;
  applications: Array<{
    id: string;
    jobId?: string;
    title: string;
    company: string;
    location?: string;
    source?: string;
    sourceLabel?: string;
    jobUrl?: string;
    matchScore?: number;
    skillsMatch?: string[];
    missingSkills?: string[];
    status: string;
    notes?: string;
    appliedAt?: string;
    interviewAt?: string;
    updatedAt?: string;
  }>;
  careerGoals: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
    nextSteps: string[];
  }>;
  reminders: Array<{
    id: string;
    type:
      | "UPCOMING_INTERVIEW"
      | "NEXT_ROADMAP_TASK"
      | "NEWEST_JOB_MATCHES"
      | "CAREER_MENTORING";
    title: string;
    description: string;
    actionLabel: string;
    actionLink: string;
    dueAt?: string;
    metadata?: Record<string, unknown>;
  }>;
  generatedAt: string;
};
