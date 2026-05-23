import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function parseEnvFile(content) {
  const entries = [];

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const idx = line.indexOf("=");
    if (idx <= 0) {
      continue;
    }

    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    entries.push([key, value]);
  }

  return entries;
}

export function loadLocalEnvFiles() {
  const root = process.cwd();
  const candidates = [
    join(root, ".env"),
    join(root, ".env.local"),
  ];

  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      continue;
    }

    const content = readFileSync(filePath, "utf8");
    for (const [key, value] of parseEnvFile(content)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
