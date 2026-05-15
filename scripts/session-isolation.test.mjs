import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = path.join(rootDir, ".session-isolation-test");

const transpileToTempModule = (relativePath) => {
  const sourcePath = path.join(rootDir, relativePath);
  const outputPath = path.join(
    outDir,
    relativePath.replace(/\.ts$/, ".mjs"),
  );
  const source = fs.readFileSync(sourcePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, outputText);
  return outputPath;
};

fs.rmSync(outDir, { recursive: true, force: true });

const sessionModulePath = transpileToTempModule("shared/lib/session-isolation.ts");
const queryClientModulePath = transpileToTempModule("shared/lib/query-client.ts");

const {
  getAuthSessionKey,
  hasActiveSessionState,
  isDifferentAuthSession,
  shouldRotateAuthSessionBoundary,
} = await import(pathToFileURL(sessionModulePath).href);
const { createAppQueryClient } = await import(
  pathToFileURL(queryClientModulePath).href
);

const userSession = getAuthSessionKey({
  role: "USER",
  user: { id: "user-1", name: "User One", email: "user@example.com" },
});
const adminSession = getAuthSessionKey({
  role: "ADMIN",
  user: { id: "admin-1", name: "Admin One", email: "admin@example.com" },
});
const mentorSession = getAuthSessionKey({
  role: "MENTOR",
  user: { id: "mentor-1", name: "Mentor One", email: "mentor@example.com" },
});

assert.equal(userSession, "USER:user-1");
assert.equal(adminSession, "ADMIN:admin-1");
assert.equal(mentorSession, "MENTOR:mentor-1");
assert.equal(getAuthSessionKey({ role: null, user: null }), null);
assert.equal(isDifferentAuthSession(userSession, userSession), false);
assert.equal(isDifferentAuthSession(userSession, adminSession), true);
assert.equal(isDifferentAuthSession(adminSession, userSession), true);
assert.equal(isDifferentAuthSession(userSession, mentorSession), true);
assert.equal(shouldRotateAuthSessionBoundary(null, userSession), false);
assert.equal(shouldRotateAuthSessionBoundary(userSession, userSession), false);
assert.equal(shouldRotateAuthSessionBoundary(userSession, adminSession), true);
assert.equal(hasActiveSessionState({}), false);
assert.equal(hasActiveSessionState({ accessToken: "token" }), true);
assert.equal(hasActiveSessionState({ sessionKey: userSession }), true);

const queryClient = createAppQueryClient();
queryClient.setQueryData(["profile", "me"], {
  email: "previous-user@example.com",
});
queryClient.setQueryData(["dashboard", "summary"], {
  owner: "previous-user",
});

assert.equal(
  queryClient.getQueryData(["profile", "me"]).email,
  "previous-user@example.com",
);
assert.equal(
  queryClient.getQueryData(["dashboard", "summary"]).owner,
  "previous-user",
);

await queryClient.cancelQueries();
queryClient.clear();

assert.equal(queryClient.getQueryData(["profile", "me"]), undefined);
assert.equal(queryClient.getQueryData(["dashboard", "summary"]), undefined);

fs.rmSync(outDir, { recursive: true, force: true });

console.log("session isolation tests passed");
