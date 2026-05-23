import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { serverLogger } from "../lib/pino.js";

/**
 * Translation Parity Checker
 *
 * Validates that EN, AR, and DE locale modules export identical leaf-key
 * structures.  Works against the modular i18n layout at
 * src/i18n/locales/{en,ar,de}/index.ts by transpiling each barrel file and
 * all of its local imports into an evaluable CommonJS bundle.
 */

const root = process.cwd();
const localesDir = path.join(root, "src/i18n/locales");
const locales = ["en", "ar", "de"];

/* ------------------------------------------------------------------ */
/*  Transpile & evaluate a locale barrel with all its local imports    */
/* ------------------------------------------------------------------ */

function resolveLocalImport(importerDir, specifier) {
  if (!specifier.startsWith(".")) return null;

  const candidates = [
    path.join(importerDir, specifier + ".ts"),
    path.join(importerDir, specifier, "index.ts"),
    path.join(importerDir, specifier + ".js"),
  ];

  for (const candidate of candidates) {
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

    const source = fs.readFileSync(resolved, "utf8");
    sources.set(resolved, source);

    const importPattern =
      /(?:import|export)\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importPattern.exec(source)) !== null) {
      const target = resolveLocalImport(path.dirname(resolved), match[1]);
      if (target) walk(target);
    }
  }

  walk(entryFile);
  return sources;
}

function transpileAndEval(entryFile, exportName) {
  const allSources = collectModuleSources(entryFile);
  const moduleRegistry = new Map();

  for (const [filePath, source] of allSources) {
    const transpiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
      fileName: filePath,
    }).outputText;

    moduleRegistry.set(filePath, transpiled);
  }

  const moduleCache = new Map();

  function customRequire(requester, specifier) {
    const target = resolveLocalImport(path.dirname(requester), specifier);
    if (!target || !moduleRegistry.has(target)) {
      throw new Error(
        `Cannot resolve '${specifier}' from '${path.basename(requester)}'`,
      );
    }

    if (moduleCache.has(target)) return moduleCache.get(target);

    const mod = { exports: {} };
    moduleCache.set(target, mod.exports);

    const code = moduleRegistry.get(target);
    const sandbox = {
      module: mod,
      exports: mod.exports,
      require: (spec) => customRequire(target, spec),
    };

    vm.runInNewContext(code, sandbox, { filename: target });
    moduleCache.set(target, mod.exports);
    return mod.exports;
  }

  const entryResolved = path.resolve(entryFile);
  const entryCode = moduleRegistry.get(entryResolved);
  const entryModule = { exports: {} };

  vm.runInNewContext(entryCode, {
    module: entryModule,
    exports: entryModule.exports,
    require: (spec) => customRequire(entryResolved, spec),
  }, { filename: entryResolved });

  const result = entryModule.exports[exportName];
  if (!result) {
    throw new Error(
      `Export '${exportName}' not found in ${path.basename(entryFile)}`,
    );
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Leaf-key collection & diff                                         */
/* ------------------------------------------------------------------ */

function collectLeafPaths(node, prefix = "") {
  const paths = new Set();

  if (Array.isArray(node)) {
    paths.add(`${prefix}[]`);
    if (
      node.length > 0 &&
      typeof node[0] === "object" &&
      node[0] !== null &&
      !Array.isArray(node[0])
    ) {
      for (const key of Object.keys(node[0])) {
        collectLeafPaths(node[0][key], `${prefix}[].${key}`).forEach((p) =>
          paths.add(p),
        );
      }
    }
    return paths;
  }

  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      const current = prefix ? `${prefix}.${key}` : key;
      collectLeafPaths(value, current).forEach((p) => paths.add(p));
    }
    return paths;
  }

  paths.add(prefix);
  return paths;
}

function diff(base, candidate) {
  const missing = [];
  for (const key of base) {
    if (!candidate.has(key)) missing.push(key);
  }
  return missing;
}

/* ------------------------------------------------------------------ */
/*  Main                                                                */
/* ------------------------------------------------------------------ */

try {
  const translations = {};

  for (const locale of locales) {
    const entryFile = path.join(localesDir, locale, "index.ts");
    if (!fs.existsSync(entryFile)) {
      throw new Error(`Locale entry not found: ${entryFile}`);
    }
    translations[locale] = transpileAndEval(entryFile, locale);
  }

  const pathMap = Object.fromEntries(
    locales.map((locale) => [locale, collectLeafPaths(translations[locale])]),
  );

  const mismatches = [];
  for (const a of locales) {
    for (const b of locales) {
      if (a === b) continue;
      const missingInB = diff(pathMap[a], pathMap[b]);
      if (missingInB.length) {
        mismatches.push({ from: a, to: b, keys: missingInB });
      }
    }
  }

  const keyCounts = Object.fromEntries(
    locales.map((locale) => [locale, pathMap[locale].size]),
  );
  serverLogger.info({ message: "Translation leaf key counts", keyCounts });

  if (mismatches.length) {
    serverLogger.error({ message: "Translation parity mismatches detected" });
    for (const mismatch of mismatches) {
      serverLogger.error({
        message: `Keys in '${mismatch.from}' missing from '${mismatch.to}'`,
        missingCount: mismatch.keys.length,
      });
      mismatch.keys
        .slice(0, 30)
        .forEach((key) =>
          serverLogger.error({ message: `Missing key: ${key}` }),
        );
      if (mismatch.keys.length > 30) {
        serverLogger.error({
          message: "Additional keys omitted",
          omittedCount: mismatch.keys.length - 30,
        });
      }
    }
    process.exit(1);
  }

  serverLogger.info({
    message: "Translation parity check passed for en/ar/de",
  });
} catch (error) {
  serverLogger.error({
    message: "Translation check failed",
    error: error instanceof Error ? error.message : error,
  });
  process.exit(1);
}
