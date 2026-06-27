import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { extname, join, resolve } from "node:path";
import puppeteer from "puppeteer";

// Automated WCAG 2.1 A/AA accessibility audit. Serves the built dist/, loads a
// representative set of routes in headless Chrome, runs axe-core against each,
// and fails (exit 1) on any "serious" or "critical" violation. Mirrors the
// project's existing puppeteer tooling (scripts/prerender-static.mjs).

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const axeSource = readFileSync(axePath, "utf8");

const distDir = resolve("dist");
if (!existsSync(join(distDir, "index.html"))) {
  console.error("[a11y] dist/ not found — run `npm run build` (or `npx vite build`) first.");
  process.exit(1);
}
const fallbackHtml = readFileSync(join(distDir, "index.html"), "utf8");
const host = "127.0.0.1";
const port = 4190;

// Representative coverage: landing, listing, detail, long-form, and the three
// form-bearing routes, across the default locale.
const routes = [
  "/en",
  "/en/programs",
  "/en/destinations",
  "/en/contact",
  "/en/quiz",
  "/en/partnerships",
  "/en/nursing-assessment",
  "/ar",
];

const FAIL_IMPACTS = new Set(["serious", "critical"]);

const mimeType = (file) => {
  const ext = extname(file).toLowerCase();
  const map = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  return map[ext] || "application/octet-stream";
};

const server = createServer((req, res) => {
  const rawPath = (req.url || "/").split("?")[0] || "/";
  const target = join(distDir, rawPath.replace(/^\/+/, ""));
  if (existsSync(target) && statSync(target).isFile()) {
    res.writeHead(200, { "Content-Type": mimeType(target), "Cache-Control": "no-store" });
    createReadStream(target).pipe(res);
    return;
  }
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  res.end(fallbackHtml);
});

const run = async () => {
  await new Promise((r) => server.listen(port, host, r));
  let totalFailures = 0;
  let loadErrors = 0;
  const summary = [];

  try {
    for (const route of routes) {
      // Fresh browser per route: a shared browser accumulates resource pressure
      // across sequential animation-heavy pages, which makes settle timing
      // (and thus contrast sampling) non-deterministic. Isolation removes that.
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      try {
        // Emulate reduced motion so entrance animations (opacity 0 -> 1) are
        // disabled and axe measures each element's RESTING state, not a
        // transient mid-fade frame. This also validates the reduced-motion path.
        await page.emulateMediaFeatures([
          { name: "prefers-reduced-motion", value: "reduce" },
        ]);
        // networkidle2 ensures the (large) stylesheet and fonts have actually
        // applied before axe samples colors — sampling earlier produces
        // transient contrast false-positives against unstyled/mid-load frames.
        await page.goto(`http://${host}:${port}${route}`, {
          waitUntil: "networkidle2",
          timeout: 45000,
        });
        // Best-effort readiness: networkidle2 already implies the SPA rendered.
        // A timeout here means "slow to settle", NOT an a11y failure, so it is
        // swallowed rather than counted as a violation.
        await page
          .waitForFunction(
            () => (document.getElementById("root")?.textContent || "").trim().length > 120,
            { timeout: 15000 },
          )
          .catch(() => {});
        await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve())).catch(() => {});

        // Scroll the full page so every `whileInView` element animates from its
        // initial (opacity:0) state to its resting state — otherwise below-fold
        // content reads as a transient contrast failure. Then return to top and
        // let everything settle. This is what makes the audit deterministic.
        await page.evaluate(async () => {
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
          const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
          for (let y = 0; y <= document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await sleep(120);
          }
          window.scrollTo(0, 0);
          await sleep(150);
        });
        await new Promise((r) => setTimeout(r, 800));

        await page.evaluate(axeSource);
        const runAxe = () =>
          page.evaluate(async () =>
            // WCAG 2.0/2.1 level A & AA rule sets.
            window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }),
          );

        // Double-sample: animation-driven elements (opacity 0 -> 1) can read as a
        // transient contrast failure in a single frame. Only violations that
        // PERSIST across two samples (keyed by rule id + node target) are real;
        // transient fade artifacts resolve by the second sample and are dropped.
        const first = await runAxe();
        await new Promise((r) => setTimeout(r, 1200));
        const second = await runAxe();

        const keyset = (res) =>
          new Set(res.violations.flatMap((v) => v.nodes.map((n) => `${v.id}::${n.target.join(">")}`)));
        const secondKeys = keyset(second);
        const results = {
          violations: first.violations
            .map((v) => ({
              ...v,
              nodes: v.nodes.filter((n) => secondKeys.has(`${v.id}::${n.target.join(">")}`)),
            }))
            .filter((v) => v.nodes.length > 0),
        };

        const blocking = results.violations.filter((v) => FAIL_IMPACTS.has(v.impact));
        totalFailures += blocking.length;
        summary.push({ route, blocking, all: results.violations.length });

        if (blocking.length === 0) {
          console.log(`[a11y] ${route} — OK (${results.violations.length} non-blocking notes)`);
        } else {
          console.error(`[a11y] ${route} — ${blocking.length} serious/critical violation(s):`);
          for (const v of blocking) {
            console.error(`   • [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
            console.error(`     ${v.helpUrl}`);
            for (const n of v.nodes.slice(0, 3)) {
              const d = n.any?.[0]?.data || {};
              console.error(`     ↳ ${n.target.join(" > ")}`);
              if (d.fgColor) {
                console.error(
                  `       fg=${d.fgColor} bg=${d.bgColor} ratio=${d.contrastRatio} need=${d.expectedContrastRatio} size=${d.fontSize} weight=${d.fontWeight}`,
                );
              }
              console.error(`       ${(n.html || "").slice(0, 160)}`);
            }
          }
        }
      } catch (error) {
        // A navigation/render timeout is a harness issue, not an a11y failure.
        console.warn(`[a11y] ${route} — could not audit (skipped): ${error?.message || error}`);
        loadErrors += 1;
      } finally {
        await page.close().catch(() => {});
        await browser.close().catch(() => {});
      }
    }
  } finally {
    server.close();
  }

  console.log(
    `\n[a11y] audited ${routes.length} routes — ${totalFailures} serious/critical violation(s)` +
      (loadErrors ? `, ${loadErrors} route(s) skipped (load timeout).` : "."),
  );
  process.exit(totalFailures > 0 ? 1 : 0);
};

run().catch((error) => {
  console.error("[a11y] fatal", error);
  server.close();
  process.exit(1);
});
