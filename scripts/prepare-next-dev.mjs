import { execFile } from "node:child_process";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const nextDir = resolve(process.cwd(), ".next");
const devPort = process.env.PORT ?? "3000";

async function findPortPids(port) {
  if (process.platform !== "win32") return [];

  const { stdout } = await execFileAsync("netstat", ["-ano"]);
  const pids = new Set();

  for (const line of stdout.split(/\r?\n/)) {
    const columns = line.trim().split(/\s+/);
    if (columns.length < 5) continue;

    const [protocol, localAddress, , state, pid] = columns;
    if (!protocol.startsWith("TCP")) continue;
    if (state !== "LISTENING") continue;
    if (!localAddress.endsWith(`:${port}`)) continue;
    if (/^\d+$/.test(pid)) pids.add(pid);
  }

  return [...pids];
}

for (const pid of await findPortPids(devPort)) {
  await execFileAsync("taskkill", ["/PID", pid, "/F"]).catch(() => undefined);
}

await rm(nextDir, { recursive: true, force: true });
