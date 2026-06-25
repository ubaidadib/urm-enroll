import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const appDir = path.join(root, "src/app");
const localesDir = path.join(root, "src/i18n/locales");

function resolveLocalImport(importerDir, specifier) {
  if (!specifier.startsWith(".")) return null;
  for (const candidate of [
    path.join(importerDir, specifier + ".ts"),
    path.join(importerDir, specifier, "index.ts"),
  ]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function collectModuleSources(entryFile) {
  const visited = new Set();
  const sources = new Map();
  function walk(filePath) {
    const resolved = path.resolve(filePath);
    if (visited.has(resolved)) return;
    visited.add(resolved);
    sources.set(resolved, fs.readFileSync(resolved, "utf8"));
    const importPattern = /(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importPattern.exec(sources.get(resolved))) !== null) {
      const target = resolveLocalImport(path.dirname(resolved), match[1]);
      if (target) walk(target);
    }
  }
  walk(entryFile);
  return sources;
}

function loadLocale(locale) {
  const entryFile = path.join(localesDir, locale, "index.ts");
  const allSources = collectModuleSources(entryFile);
  const moduleRegistry = new Map();
  for (const [filePath, source] of allSources) {
    moduleRegistry.set(
      filePath,
      ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
        fileName: filePath,
      }).outputText
    );
  }
  const moduleCache = new Map();
  function customRequire(requester, specifier) {
    const target = resolveLocalImport(path.dirname(requester), specifier);
    if (!target || !moduleRegistry.has(target)) {
      throw new Error(`Cannot resolve '${specifier}' from '${path.basename(requester)}'`);
    }
    if (moduleCache.has(target)) return moduleCache.get(target);
    const mod = { exports: {} };
    moduleCache.set(target, mod.exports);
    vm.runInNewContext(moduleRegistry.get(target), {
      module: mod,
      exports: mod.exports,
      require: (spec) => customRequire(target, spec),
    }, { filename: target });
    moduleCache.set(target, mod.exports);
    return mod.exports;
  }
  const entryResolved = path.resolve(entryFile);
  const entryModule = { exports: {} };
  vm.runInNewContext(moduleRegistry.get(entryResolved), {
    module: entryModule,
    exports: entryModule.exports,
    require: (spec) => customRequire(entryResolved, spec),
  }, { filename: entryResolved });
  return entryModule.exports[locale];
}

function getValue(obj, key) {
  return key.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return acc[part];
    return undefined;
  }, obj);
}

function walkDir(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, files);
    else if (/\.tsx?$/.test(entry.name)) files.push(full);
  }
  return files;
}

const en = loadLocale("en");
const usedKeys = new Set();
const patterns = [
  /t<string>\(\s*[`'"]([^`'"]+)[`'"]\s*\)/g,
  /tx\(\s*[`'"]([^`'"]+)[`'"]\s*\)/g,
  /labelKey:\s*[`'"]([^`'"]+)[`'"]/g,
];

for (const file of walkDir(appDir)) {
  const content = fs.readFileSync(file, "utf8");
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (!match[1].includes("${") && !match[1].includes("/") && !match[1].startsWith(".")) {
        usedKeys.add(match[1]);
      }
    }
  }
}

const missing = [...usedKeys].filter((key) => getValue(en, key) === undefined).sort();
console.log(`Checked ${usedKeys.size} static keys against en locale`);
if (missing.length) {
  console.log(`MISSING (${missing.length}):`);
  missing.forEach((k) => console.log(" ", k));
  process.exit(1);
}
console.log("All static t() keys exist in en locale");
