export type PreferredWorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export type ProfileSocialLinks = {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
};

export type UserProfile = {
  id: string;
  email?: string;
  role?: "USER" | "ADMIN" | "COACH" | "MENTOR";
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  headline?: string | null;
  bio?: string | null;
  targetRole?: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  showEmail?: boolean;
  currentCompany?: string | null;
  currentPosition?: string | null;
  yearsExperience?: number | null;
  education?: Array<Record<string, unknown>>;
  profileSkills?: string[];
  profileCertifications?: Array<Record<string, unknown>>;
  profileProjects?: Array<Record<string, unknown>>;
  preferredJobType?: string | null;
  preferredWorkMode?: PreferredWorkMode | null;
  preferredSalaryRange?: string | null;
  languages?: string[];
  experienceSummary?: string | null;
  mentorSpecialties?: string[];
  mentorExpertise?: string[];
  mentorRating?: number | null;
  mentorCompletedReviews?: number;
  socialLinks?: ProfileSocialLinks | null;
  isPublicProfile: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

export type CareerPortfolio = {
  user: UserProfile;
  stats: {
    atsScore: number;
    interviewReadiness: number;
    roadmapProgress: number;
    applicationsSent: number;
    completedMilestones: number;
    profileCompletion: number;
  };
  roadmap: null | {
    id: string;
    targetRole: string;
    progress: number;
    completedMilestones: Array<{
      id: string;
      title: string;
      description: string;
      completedAt?: string | null;
    }>;
  };
  skills: Array<{
    name: string;
    category?: string | null;
    targetLevel?: string;
    priority?: string;
    progress?: number;
    status?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer?: string;
    url?: string;
    source?: string;
  }>;
  projects: Array<{
    title: string;
    description?: string;
    difficulty?: string | null;
    status?: string;
    technologies?: string[];
  }>;
  careerGoals: Array<{
    id: string;
    title: string;
    status: string;
    progress: number;
    targetRole?: string | null;
  }>;
  achievements: Achievement[];
};

export type UpdateUserProfilePayload = Pick<
  UserProfile,
  | "username"
  | "firstName"
  | "lastName"
  | "headline"
  | "bio"
  | "targetRole"
  | "location"
  | "phoneNumber"
  | "showEmail"
  | "currentCompany"
  | "currentPosition"
  | "yearsExperience"
  | "education"
  | "profileSkills"
  | "profileCertifications"
  | "profileProjects"
  | "preferredJobType"
  | "preferredWorkMode"
  | "preferredSalaryRange"
  | "languages"
  | "experienceSummary"
  | "mentorSpecialties"
  | "mentorExpertise"
  | "socialLinks"
  | "isPublicProfile"
>;
