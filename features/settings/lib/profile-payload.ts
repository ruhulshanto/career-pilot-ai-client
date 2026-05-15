import type {
  PreferredWorkMode,
  ProfileSocialLinks,
  UpdateUserProfilePayload,
  UserProfile,
} from "../../../services/api/profile-types";

export type PreferredWorkModeSelectValue = "" | PreferredWorkMode;

export type ProfileDraft = Omit<
  Partial<UserProfile>,
  | "education"
  | "languages"
  | "preferredWorkMode"
  | "profileCertifications"
  | "profileProjects"
  | "profileSkills"
  | "socialLinks"
> & {
  education: Array<Record<string, string>>;
  languages: string[];
  preferredWorkMode?: PreferredWorkMode | null;
  profileCertifications: Array<Record<string, string>>;
  profileProjects: Array<Record<string, string>>;
  profileSkills: string[];
  socialLinks?: ProfileSocialLinks | null;
};

type ProfilePayloadInput = Omit<ProfileDraft, "preferredWorkMode"> & {
  preferredWorkMode?: PreferredWorkMode | null | string;
};

export const emptyProfileDraft: ProfileDraft = {
  socialLinks: {},
  education: [],
  profileCertifications: [],
  profileProjects: [],
  profileSkills: [],
  languages: [],
};

export const profileSocialLinkKeys = [
  "linkedin",
  "github",
  "portfolio",
  "website",
] as const;

export const preferredWorkModeOptions = [
  { value: "", label: "No preference" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
] as const satisfies ReadonlyArray<{
  value: PreferredWorkModeSelectValue;
  label: string;
}>;

const preferredWorkModeValues = ["REMOTE", "HYBRID", "ONSITE"] as const;

const preferredWorkModeLabels = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "Onsite",
} as const satisfies Record<PreferredWorkMode, string>;

const nullableTextFields = [
  "headline",
  "bio",
  "targetRole",
  "location",
  "phoneNumber",
  "currentCompany",
  "currentPosition",
  "preferredJobType",
  "preferredSalaryRange",
  "experienceSummary",
] as const;

const stableStringify = (value: unknown) => JSON.stringify(value ?? null);

export const hasProfileFieldChanged = (before: unknown, after: unknown) =>
  stableStringify(before) !== stableStringify(after);

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const cleanNullableText = (value: unknown) => {
  const clean = cleanText(value);
  return clean ? clean : null;
};

const cleanStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((item) => cleanText(item))
        .filter((item) => item.length > 0),
    ),
  );
};

const cleanRecordArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object" && !Array.isArray(item),
    )
    .map((item) =>
      Object.fromEntries(
        Object.entries(item)
          .map(([key, itemValue]) => [key, cleanText(itemValue)])
          .filter(([, itemValue]) => itemValue.length > 0),
      ),
    )
    .filter((item) => Object.keys(item).length > 0);
};

const normalizeProfileUrl = (value: unknown) => {
  const clean = cleanText(value);
  if (!clean) return "";
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(clean)) return clean;
  return `https://${clean}`;
};

export const isPreferredWorkMode = (
  value: unknown,
): value is PreferredWorkMode =>
  typeof value === "string" &&
  preferredWorkModeValues.includes(value as PreferredWorkMode);

export const normalizePreferredWorkMode = (
  value: unknown,
): PreferredWorkMode | null => {
  const clean = cleanText(value);
  if (!clean) return null;

  const normalized = clean.toUpperCase().replace(/[\s-]+/g, "_");
  if (normalized === "ON_SITE") return "ONSITE";
  if (isPreferredWorkMode(normalized)) return normalized;

  return null;
};

export const formatPreferredWorkMode = (value: unknown) => {
  const normalized = normalizePreferredWorkMode(value);
  return normalized ? preferredWorkModeLabels[normalized] : null;
};

export const buildProfileUpdatePayload = (
  draft: ProfilePayloadInput,
): Partial<UpdateUserProfilePayload> => {
  const payload: Partial<UpdateUserProfilePayload> = {
    username: cleanText(draft.username),
    firstName: cleanText(draft.firstName),
    lastName: cleanText(draft.lastName),
    showEmail: Boolean(draft.showEmail),
    isPublicProfile: Boolean(draft.isPublicProfile),
    yearsExperience:
      typeof draft.yearsExperience === "number" &&
      Number.isFinite(draft.yearsExperience)
        ? draft.yearsExperience
        : null,
    education: cleanRecordArray(draft.education),
    profileCertifications: cleanRecordArray(draft.profileCertifications),
    profileProjects: cleanRecordArray(draft.profileProjects),
    profileSkills: cleanStringArray(draft.profileSkills),
    languages: cleanStringArray(draft.languages),
    preferredWorkMode: normalizePreferredWorkMode(draft.preferredWorkMode),
    socialLinks: Object.fromEntries(
      profileSocialLinkKeys
        .map(
          (key) =>
            [key, normalizeProfileUrl(draft.socialLinks?.[key])] as const,
        )
        .filter(([, value]) => value.length > 0),
    ),
  };

  nullableTextFields.forEach((key) => {
    (payload as Record<string, unknown>)[key] = cleanNullableText(draft[key]);
  });

  return payload;
};

export const validateProfileUpdatePayload = (
  payload: Partial<UpdateUserProfilePayload>,
) => {
  if (!payload.firstName || !payload.lastName) {
    return "First name and last name are required.";
  }

  if (
    !payload.username ||
    payload.username.length < 3 ||
    !/^[a-zA-Z0-9_-]+$/.test(payload.username)
  ) {
    return "Username must be at least 3 characters and only use letters, numbers, underscores, or hyphens.";
  }

  if (
    typeof payload.yearsExperience === "number" &&
    (payload.yearsExperience < 0 || payload.yearsExperience > 60)
  ) {
    return "Years of experience must be between 0 and 60.";
  }

  if (
    payload.preferredWorkMode !== null &&
    payload.preferredWorkMode !== undefined &&
    !isPreferredWorkMode(payload.preferredWorkMode)
  ) {
    return "Preferred work mode must be Remote, Hybrid, or Onsite.";
  }

  return null;
};
