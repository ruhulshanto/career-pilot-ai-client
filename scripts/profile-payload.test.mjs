import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import fs from "node:fs";
import ts from "typescript";

const source = fs.readFileSync(
  new URL("../features/settings/lib/profile-payload.ts", import.meta.url),
  "utf8",
);

const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const profilePayload = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const {
  buildProfileUpdatePayload,
  normalizePreferredWorkMode,
  preferredWorkModeOptions,
  validateProfileUpdatePayload,
} = profilePayload;

assert.equal(normalizePreferredWorkMode("REMOTE"), "REMOTE");
assert.equal(normalizePreferredWorkMode("Remote"), "REMOTE");
assert.equal(normalizePreferredWorkMode("HYBRID"), "HYBRID");
assert.equal(normalizePreferredWorkMode("Hybrid"), "HYBRID");
assert.equal(normalizePreferredWorkMode("ONSITE"), "ONSITE");
assert.equal(normalizePreferredWorkMode("Onsite"), "ONSITE");
assert.equal(normalizePreferredWorkMode("On-site"), "ONSITE");
assert.equal(normalizePreferredWorkMode(""), null);
assert.equal(normalizePreferredWorkMode(null), null);
assert.equal(normalizePreferredWorkMode("Office"), null);

for (const option of preferredWorkModeOptions) {
  if (option.value) {
    assert.equal(normalizePreferredWorkMode(option.value), option.value);
    assert.notEqual(option.value, option.label);
  }
}

const baseDraft = {
  username: " shanto_dev ",
  firstName: " Shanto ",
  lastName: " Mia ",
  showEmail: true,
  isPublicProfile: true,
  yearsExperience: 3,
  education: [{ school: " Demo University ", degree: " BSc ", year: "" }],
  profileCertifications: [],
  profileProjects: [{ title: " Career Pilot ", description: " AI SaaS " }],
  profileSkills: ["React", " React ", " ", "Node.js"],
  languages: ["English", " Bangla ", ""],
  socialLinks: {
    linkedin: "linkedin.com/in/shanto",
    github: "",
    portfolio: "https://example.com",
  },
  preferredJobType: " Full-time ",
  preferredSalaryRange: "",
  headline: " AI Engineer ",
  bio: " ",
  targetRole: " Product Engineer ",
  location: " Dhaka ",
  phoneNumber: "",
  currentCompany: "",
  currentPosition: " Developer ",
  experienceSummary: " Building AI products ",
};

const payload = buildProfileUpdatePayload({
  ...baseDraft,
  preferredWorkMode: "Remote",
});

assert.equal(payload.preferredWorkMode, "REMOTE");
assert.equal(payload.username, "shanto_dev");
assert.equal(payload.firstName, "Shanto");
assert.equal(payload.bio, null);
assert.deepEqual(payload.profileSkills, ["React", "Node.js"]);
assert.deepEqual(payload.languages, ["English", "Bangla"]);
assert.equal(payload.socialLinks.linkedin, "https://linkedin.com/in/shanto");
assert.equal(payload.socialLinks.github, undefined);
assert.equal(validateProfileUpdatePayload(payload), null);
assert.equal(JSON.stringify(payload).includes('"Remote"'), false);

const emptyWorkModePayload = buildProfileUpdatePayload({
  ...baseDraft,
  preferredWorkMode: "",
});

assert.equal(emptyWorkModePayload.preferredWorkMode, null);

console.log("profile payload enum tests passed");
