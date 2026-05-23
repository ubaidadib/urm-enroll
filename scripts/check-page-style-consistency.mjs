import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve("src/app/pages");
const fileList = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (fullPath.endsWith(".tsx")) fileList.push(fullPath);
  }
}

walk(root);

const rules = [
  {
    key: "hex-colors",
    regex: /#[0-9a-fA-F]{3,8}/g,
    message: "Uses raw hex colors",
  },
  {
    key: "palette-slash-dark",
    regex: /(?:text|bg|border)-(?:slate|gray|zinc)-\d{2,3}|dark:(?:text|bg|border)-(?:slate|gray|zinc)-\d{2,3}/g,
    message: "Uses standalone slate/gray palette instead of theme tokens",
  },
  {
    key: "legacy-page-container",
    regex: /max-w-(?:7xl|4xl)\s+mx-auto\s+px-(?:6|4\s+sm:px-6\s+lg:px-8)/g,
    message: "Uses legacy page container classes instead of page-container/page-container-narrow",
  },
  {
    key: "legacy-page-gutter",
    regex: /max-w-(?:3xl|5xl|6xl)\s+mx-auto\s+px-(?:6|4\s+sm:px-6)/g,
    message: "Uses legacy wrapper gutters instead of page-gutter utility",
  },
];

const findings = [];

for (const file of fileList) {
  const content = readFileSync(file, "utf8");
  const fileFindings = [];

  for (const rule of rules) {
    const matches = content.match(rule.regex);
    if (matches?.length) {
      fileFindings.push({
        rule: rule.key,
        message: rule.message,
        count: matches.length,
      });
    }
  }

  if (fileFindings.length) {
    findings.push({ file, fileFindings });
  }
}

if (findings.length === 0) {
  console.log("[style-consistency] PASS: no drift signals found in page styles.");
  process.exit(0);
}

console.log(`[style-consistency] WARN: ${findings.length} page files with drift signals.`);
for (const item of findings) {
  const relative = path.relative(process.cwd(), item.file);
  const summary = item.fileFindings.map((f) => `${f.rule}:${f.count}`).join(", ");
  console.log(` - ${relative} -> ${summary}`);
}

process.exit(0);
