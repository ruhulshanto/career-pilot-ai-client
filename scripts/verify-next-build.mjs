import { execFile, spawn } from "node:child_process";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const verifyDirName = ".next-verify";
const verifyDir = resolve(process.cwd(), verifyDirName);
const defaultNextDir = resolve(process.cwd(), ".next");
const tsconfigPath = resolve(process.cwd(), "tsconfig.json");
const nextEnvPath = resolve(process.cwd(), "next-env.d.ts");
const devPort = Number(process.env.PORT ?? 3000);
const nextCli = resolve(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const tsconfigBefore = await readFile(tsconfigPath, "utf8").catch(() => null);
const nextEnvBefore = await readFile(nextEnvPath, "utf8").catch(() => null);
const defaultNextExisted = await access(defaultNextDir)
  .then(() => true)
  .catch(() => false);

async function assertPortFree(port) {
  if (process.platform !== "win32") return;

  const { stdout } = await execFileAsync("netstat", ["-ano"]);
  for (const line of stdout.split(/\r?\n/)) {
    const columns = line.trim().split(/\s+/);
    if (columns.length < 5) continue;

    const [protocol, localAddress, , state] = columns;
    if (!protocol.startsWith("TCP")) continue;
    if (state !== "LISTENING") continue;
    if (!localAddress.endsWith(`:${port}`)) continue;

    throw new Error(
      `Port ${port} is active. Stop next dev before running verify:build.`,
    );
  }
}

await assertPortFree(devPort);

await rm(verifyDir, { recursive: true, force: true });

const child = spawn(process.execPath, [nextCli, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: verifyDirName,
  },
});

const exitCode = await new Promise((resolveExit) => {
  child.on("close", resolveExit);
});

await rm(verifyDir, { recursive: true, force: true });
if (!defaultNextExisted) {
  await rm(defaultNextDir, { recursive: true, force: true });
}
if (tsconfigBefore !== null) await writeFile(tsconfigPath, tsconfigBefore);
if (nextEnvBefore !== null) await writeFile(nextEnvPath, nextEnvBefore);

process.exit(typeof exitCode === "number" ? exitCode : 1);
