"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Eye, EyeOff, Loader2, Plus, Save, Trash2, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { profileApi, type UserProfile } from "@/services/api/profile";
import {
  buildProfileUpdatePayload,
  emptyProfileDraft,
  hasProfileFieldChanged,
  normalizePreferredWorkMode,
  preferredWorkModeOptions,
  profileSocialLinkKeys,
  validateProfileUpdatePayload,
  type PreferredWorkModeSelectValue,
  type ProfileDraft,
} from "../lib/profile-payload";

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === "object") {
    const maybeError = error as {
      message?: unknown;
      details?: unknown;
      code?: unknown;
      status?: unknown;
    };

    if (typeof maybeError.details === "string") return maybeError.details;
    if (
      maybeError.details &&
      typeof maybeError.details === "object" &&
      "issues" in maybeError.details &&
      Array.isArray((maybeError.details as { issues?: unknown }).issues)
    ) {
      const issues = (maybeError.details as {
        issues: Array<{ field?: unknown; message?: unknown }>;
      }).issues;

      return issues
        .map((issue) => {
          const field = typeof issue.field === "string" ? issue.field : "field";
          const message =
            typeof issue.message === "string" ? issue.message : "Invalid value";
          return `${field}: ${message}`;
        })
        .join(" ");
    }
    if (
      maybeError.details &&
      typeof maybeError.details === "object" &&
      "fieldErrors" in maybeError.details
    ) {
      const fieldErrors = (maybeError.details as {
        fieldErrors?: Record<string, string[]>;
      }).fieldErrors;

      if (fieldErrors) {
        const messages = Object.entries(fieldErrors).flatMap(
          ([field, errors]) => errors.map((message) => `${field}: ${message}`),
        );
        if (messages.length > 0) return messages.join(" ");
      }
    }
    if (Array.isArray(maybeError.details) && maybeError.details.length > 0) {
      return maybeError.details
        .map((item) =>
          item && typeof item === "object" && "message" in item
            ? String((item as { message?: unknown }).message)
            : String(item),
        )
        .join(" ");
    }
    if (typeof maybeError.message === "string") return maybeError.message;
  }

  if (error instanceof Error) return error.message;
  return "Please check your connection and try again.";
};

const getSaveToastFeedback = (
  previous: UserProfile | undefined,
  next: Partial<UserProfile>,
) => {
  if (!previous) {
    return {
      title: "Profile updated successfully",
      description: "Your professional profile changes were saved.",
    };
  }

  const changedSections = [
    hasProfileFieldChanged(previous.profileSkills, next.profileSkills)
      ? "skills"
      : null,
    hasProfileFieldChanged(previous.education, next.education) ? "education" : null,
    hasProfileFieldChanged(previous.profileCertifications, next.profileCertifications)
      ? "certifications"
      : null,
    hasProfileFieldChanged(previous.profileProjects, next.profileProjects)
      ? "projects"
      : null,
    hasProfileFieldChanged(previous.socialLinks, next.socialLinks)
      ? "social links"
      : null,
  ].filter((item): item is string => item !== null);

  if (changedSections.length === 1) {
    const section = changedSections[0];
    const titleBySection: Record<string, string> = {
      skills: "Skills updated",
      education: "Education updated",
      certifications: "Certifications updated",
      projects: "Projects updated",
      "social links": "Social links updated",
    };

    return {
      title: titleBySection[section] ?? "Profile updated successfully",
      description: `Your ${section} section was saved successfully.`,
    };
  }

  if (changedSections.length > 1) {
    return {
      title: "Profile updated successfully",
      description: `Saved updates to ${changedSections.join(", ")}.`,
    };
  }

  return {
    title: "Profile updated successfully",
    description: "Your professional profile changes were saved.",
  };
};

export function ProfileForm() {
  const queryClient = useQueryClient();
  const { dismiss, toast } = useToast();
  const [draft, setDraft] = useState<ProfileDraft>(emptyProfileDraft);
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const profileQuery = useQuery({
    queryKey: ["profile", "me"],
    queryFn: profileApi.getMe,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    setDraft({
      ...profileQuery.data,
      preferredWorkMode: normalizePreferredWorkMode(
        profileQuery.data.preferredWorkMode,
      ),
      socialLinks: profileQuery.data.socialLinks ?? {},
      education: (profileQuery.data.education as Array<Record<string, string>>) ?? [],
      profileCertifications:
        (profileQuery.data.profileCertifications as Array<Record<string, string>>) ?? [],
      profileProjects:
        (profileQuery.data.profileProjects as Array<Record<string, string>>) ?? [],
      profileSkills: profileQuery.data.profileSkills ?? [],
      languages: profileQuery.data.languages ?? [],
    });
  }, [profileQuery.data]);

  const updateMutation = useMutation({
    mutationFn: profileApi.updateMe,
    onSuccess: (profile, submittedDraft) => {
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      setDraft({
        ...profile,
        preferredWorkMode: normalizePreferredWorkMode(profile.preferredWorkMode),
        socialLinks: profile.socialLinks ?? {},
        education: (profile.education as Array<Record<string, string>>) ?? [],
        profileCertifications:
          (profile.profileCertifications as Array<Record<string, string>>) ?? [],
        profileProjects:
          (profile.profileProjects as Array<Record<string, string>>) ?? [],
        profileSkills: profile.profileSkills ?? [],
        languages: profile.languages ?? [],
      });
      const feedback = getSaveToastFeedback(
        profileQuery.data,
        submittedDraft,
      );
      dismiss();
      toast({
        variant: "success",
        title: feedback.title,
        description: feedback.description,
      });
    },
    onError: (error) => {
      dismiss();
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: getErrorMessage(error),
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: profileApi.uploadPhoto,
    onSuccess: (profile) => {
      setDraft((current) => ({ ...current, avatarUrl: profile.avatarUrl }));
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
      dismiss();
      toast({
        variant: "success",
        title: "Profile photo uploaded",
        description: "Your new profile photo is ready for your portfolio.",
      });
    },
    onError: (error) => {
      dismiss();
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: getErrorMessage(error),
      });
    },
  });

  const fullName = useMemo(
    () => [draft.firstName, draft.lastName].filter(Boolean).join(" "),
    [draft.firstName, draft.lastName],
  );

  const setField = <K extends keyof ProfileDraft>(
    key: K,
    value: ProfileDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setSocial = (key: (typeof profileSocialLinkKeys)[number], value: string) => {
    setDraft((current) => ({
      ...current,
      socialLinks: { ...(current.socialLinks ?? {}), [key]: value },
    }));
  };

  const addTextItem = (key: "profileSkills" | "languages", value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setDraft((current) => ({
      ...current,
      [key]: Array.from(new Set([...(current[key] ?? []), clean])),
    }));
  };

  const removeTextItem = (key: "profileSkills" | "languages", value: string) => {
    setDraft((current) => ({
      ...current,
      [key]: (current[key] ?? []).filter((item) => item !== value),
    }));
  };

  const addRecord = (
    key: "education" | "profileCertifications" | "profileProjects",
    value: Record<string, string>,
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: [...(current[key] ?? []), value],
    }));
  };

  const removeRecord = (
    key: "education" | "profileCertifications" | "profileProjects",
    index: number,
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: (current[key] ?? []).filter((_item, itemIndex) => itemIndex !== index),
    }));
  };

  if (profileQuery.isLoading) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="flex items-center justify-center p-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border/70 p-6">
        <CardTitle className="text-2xl">Profile Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Build a professional identity that powers your public career portfolio.
        </p>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/40">
              {draft.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {fullName || "Your name"}
              </p>
              <p className="text-sm text-muted-foreground">
                @{draft.username || "username"}
              </p>
            </div>
          </div>
          <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl border border-border px-4 text-sm font-medium hover:bg-muted/40 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-60">
            <Camera className="mr-2 h-4 w-4" />
            {uploadMutation.isPending ? "Uploading" : "Upload photo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={uploadMutation.isPending}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadMutation.mutate(file);
              }}
            />
          </label>
        </section>

        <Section title="Identity">
          <Field label="First name" value={draft.firstName} onChange={(value) => setField("firstName", value)} />
          <Field label="Last name" value={draft.lastName} onChange={(value) => setField("lastName", value)} />
          <Field label="Username" value={draft.username} onChange={(value) => setField("username", value)} />
          <Field label="Phone number" value={draft.phoneNumber} onChange={(value) => setField("phoneNumber", value)} />
          <Field label="Target role" value={draft.targetRole} onChange={(value) => setField("targetRole", value)} />
          <Field label="Location" value={draft.location} onChange={(value) => setField("location", value)} />
          <Field label="Current company" value={draft.currentCompany} onChange={(value) => setField("currentCompany", value)} />
          <Field label="Current position" value={draft.currentPosition} onChange={(value) => setField("currentPosition", value)} />
          <Field
            label="Years of experience"
            type="number"
            value={draft.yearsExperience ?? ""}
            onChange={(value) => setField("yearsExperience", value === "" ? null : Number(value))}
          />
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Headline</label>
            <Input value={draft.headline ?? ""} onChange={(event) => setField("headline", event.target.value)} className="h-12 rounded-2xl" />
          </div>
          <TextArea label="Bio" value={draft.bio} onChange={(value) => setField("bio", value)} />
          <TextArea label="Experience summary" value={draft.experienceSummary} onChange={(value) => setField("experienceSummary", value)} />
        </Section>

        <Section title="Preferences">
          <Field label="Preferred job type" value={draft.preferredJobType} onChange={(value) => setField("preferredJobType", value)} />
          <PreferredWorkModeSelect
            value={normalizePreferredWorkMode(draft.preferredWorkMode) ?? ""}
            onChange={(value) =>
              setField("preferredWorkMode", value === "" ? null : value)
            }
          />
          <Field label="Preferred salary range" value={draft.preferredSalaryRange} onChange={(value) => setField("preferredSalaryRange", value)} />
          <ToggleCard
            title="Show email publicly"
            description={draft.email ?? "Your account email"}
            active={Boolean(draft.showEmail)}
            onToggle={() => setField("showEmail", !draft.showEmail)}
          />
          <ToggleCard
            title="Public profile"
            description={`/u/${draft.username ?? "username"}`}
            active={Boolean(draft.isPublicProfile)}
            onToggle={() => setField("isPublicProfile", !draft.isPublicProfile)}
          />
        </Section>

        <TagEditor
          title="Skills"
          value={skillInput}
          onValueChange={setSkillInput}
          items={draft.profileSkills ?? []}
          placeholder="Add skill, e.g. React"
          onAdd={() => {
            addTextItem("profileSkills", skillInput);
            setSkillInput("");
          }}
          onRemove={(item) => removeTextItem("profileSkills", item)}
        />

        <TagEditor
          title="Languages"
          value={languageInput}
          onValueChange={setLanguageInput}
          items={draft.languages ?? []}
          placeholder="Add language, e.g. English"
          onAdd={() => {
            addTextItem("languages", languageInput);
            setLanguageInput("");
          }}
          onRemove={(item) => removeTextItem("languages", item)}
        />

        <RecordEditor
          title="Education"
          items={draft.education ?? []}
          fields={["school", "degree", "year"]}
          onAdd={(value) => addRecord("education", value)}
          onRemove={(index) => removeRecord("education", index)}
        />
        <RecordEditor
          title="Certifications"
          items={draft.profileCertifications ?? []}
          fields={["title", "issuer", "url"]}
          onAdd={(value) => addRecord("profileCertifications", value)}
          onRemove={(index) => removeRecord("profileCertifications", index)}
        />
        <RecordEditor
          title="Projects"
          items={draft.profileProjects ?? []}
          fields={["title", "description", "url", "technologies"]}
          onAdd={(value) => addRecord("profileProjects", value)}
          onRemove={(index) => removeRecord("profileProjects", index)}
        />

        <Section title="Links">
          {profileSocialLinkKeys.map((key) => (
            <Field
              key={key}
              label={key}
              value={draft.socialLinks?.[key] ?? ""}
              onChange={(value) => setSocial(key, value)}
            />
          ))}
        </Section>

        <div className="sticky bottom-4 flex justify-end">
          <Button
            className="h-12 rounded-2xl px-6 shadow-lg"
            onClick={() => {
              if (!updateMutation.isPending) {
                const payload = buildProfileUpdatePayload(draft);
                const validationMessage = validateProfileUpdatePayload(payload);

                if (validationMessage) {
                  dismiss();
                  toast({
                    variant: "destructive",
                    title: "Profile update failed",
                    description: validationMessage,
                  });
                  return;
                }

                updateMutation.mutate(payload);
              }
            }}
            disabled={updateMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {updateMutation.isPending ? "Saving" : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value?: string | number | null;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium capitalize text-muted-foreground">{label}</label>
      <Input value={value ?? ""} type={type} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl" />
    </div>
  );
}

function PreferredWorkModeSelect({
  value,
  onChange,
}: {
  value: PreferredWorkModeSelectValue;
  onChange: (value: PreferredWorkModeSelectValue) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Preferred work mode
      </label>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as PreferredWorkModeSelectValue)
        }
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none"
      >
        {preferredWorkModeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value?: string | null; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2 md:col-span-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="min-h-28 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none" />
    </div>
  );
}

function ToggleCard({ title, description, active, onToggle }: { title: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button type="button" variant={active ? "default" : "outline"} className="h-10 rounded-xl" onClick={onToggle}>
        {active ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
        {active ? "On" : "Off"}
      </Button>
    </div>
  );
}

function TagEditor({ title, items, value, onValueChange, placeholder, onAdd, onRemove }: { title: string; items: string[]; value: string; onValueChange: (value: string) => void; placeholder: string; onAdd: () => void; onRemove: (item: string) => void }) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input value={value} onChange={(event) => onValueChange(event.target.value)} placeholder={placeholder} className="h-12 rounded-2xl" />
        <Button type="button" variant="outline" className="h-12 rounded-2xl" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item} type="button" onClick={() => onRemove(item)} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20">
            {item} x
          </button>
        ))}
      </div>
    </section>
  );
}

function RecordEditor({ title, items, fields, onAdd, onRemove }: { title: string; items: Array<Record<string, string>>; fields: string[]; onAdd: (value: Record<string, string>) => void; onRemove: (index: number) => void }) {
  const [record, setRecord] = useState<Record<string, string>>({});

  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <Input key={field} value={record[field] ?? ""} onChange={(event) => setRecord((current) => ({ ...current, [field]: event.target.value }))} placeholder={field} className="h-12 rounded-2xl" />
        ))}
      </div>
      <Button type="button" variant="outline" className="h-11 rounded-2xl" onClick={() => {
        if (!Object.values(record).some(Boolean)) return;
        onAdd(record);
        setRecord({});
      }}>
        <Plus className="mr-2 h-4 w-4" />
        Add {title.toLowerCase()}
      </Button>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 p-4">
            <div>
              <p className="font-semibold text-foreground">{String(item.title ?? item.school ?? item.degree ?? "Entry")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{Object.entries(item).filter(([, value]) => value).map(([key, value]) => `${key}: ${value}`).join(" - ")}</p>
            </div>
            <Button type="button" size="icon" variant="ghost" className="h-9 w-9 rounded-xl" onClick={() => onRemove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
