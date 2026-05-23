import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const checks = [
  {
    id: "MALFORMED_GRADIENT_CLASS",
    message: "Malformed gradient utility class (missing separator).",
    pattern: /(?:bg-|text-|from-|to-|via-)linear-to-(?:r|l|t|b|tr|tl|br|bl)from/g,
  },
  {
    id: "MALFORMED_LINEAR_PREFIX",
    message: "Malformed gradient utility class (bg-linearto-r style typo).",
    pattern: /bg-linearto-[a-z]+/g,
  },
  {
    id: "UNSUPPORTED_ACCENT_SECONDARY",
    message: "Unsupported token class 'accent-secondary'. Use accent-tech or a supported semantic token.",
    pattern: /accent-secondary/g,
  },
];

function findLineAndColumn(content, index) {
  const upToIndex = content.slice(0, index);
  const lines = upToIndex.split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}

function run() {
  const files = execSync("rg --files src -g '*.ts' -g '*.tsx' -g '*.css'", {
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const violations = [];

  for (const filePath of files) {
    const content = readFileSync(filePath, "utf8");

    for (const check of checks) {
      const regex = new RegExp(check.pattern.source, check.pattern.flags);
      let match;
      while ((match = regex.exec(content)) !== null) {
        const location = findLineAndColumn(content, match.index);
        violations.push({
          filePath,
          line: location.line,
          column: location.column,
          rule: check.id,
          message: check.message,
          snippet: match[0],
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log("[ui-token-guard] OK: no malformed UI utility tokens found.");
    process.exit(0);
  }

  console.error(`[ui-token-guard] Found ${violations.length} violation(s):`);
  for (const violation of violations) {
    console.error(
      `- ${violation.filePath}:${violation.line}:${violation.column} [${violation.rule}] ${violation.message} -> ${violation.snippet}`
    );
  }
  process.exit(1);
}

run();
