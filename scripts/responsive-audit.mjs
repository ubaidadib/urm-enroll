/**
 * Comprehensive responsive audit — all routes × all breakpoints × light/dark.
 * Usage: AUDIT_BASE_URL=http://127.0.0.1:5173 node scripts/responsive-audit.mjs
 */
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:5173";

const STATIC_ROUTES = [
  "/",
  "/services",
  "/programs",
  "/programs/de_bachelor_business",
  "/compare",
  "/saved",
  "/destinations",
  "/destinations/germany",
  "/universities",
  "/universities/uni_001",
  "/nursing",
  "/nursing-assessment",
  "/germany-jobs",
  "/germany-relocation",
  "/chancenkarte",
  "/chancenkarte/eligibility",
  "/chancenkarte/process",
  "/chancenkarte/requirements",
  "/chancenkarte/success-stories",
  "/chancenkarte/faq",
  "/partnerships",
  "/about",
  "/contact",
  "/resources",
  "/resources/how-to-apply-german-university",
  "/resources/student-visa-germany-guide",
  "/resources/free-universities-germany",
  "/privacy",
  "/terms",
  "/cookies",
  "/impressum",
  "/quiz",
  "/nonexistent-page-404",
];

const VIEWPORTS = [
  { name: "320", width: 320, height: 800 },
  { name: "360", width: 360, height: 800 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "480", width: 480, height: 800 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const THEMES = ["light", "dark"];

async function waitForAppReady(page) {
  await page.waitForFunction(
    () => {
      const hasPreloader = Boolean(document.querySelector('[role="status"][aria-live="polite"]'));
      const hasContent = document.querySelectorAll("a, main, h1").length > 0;
      return !hasPreloader && hasContent;
    },
    { timeout: 30000 }
  );
  await new Promise((r) => setTimeout(r, 150));
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(t);
    try {
      localStorage.setItem("urm-theme", t);
    } catch {
      /* ignore — class toggle is enough for layout checks */
    }
  }, theme);
  await new Promise((r) => setTimeout(r, 100));
}

function detectOverflow() {
  const doc = document.documentElement;
  const body = document.body;
  const clientWidth = doc.clientWidth;
  const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
  const hasOverflow = scrollWidth > clientWidth + 1;

  const offenders = [];
  if (hasOverflow) {
    const all = document.querySelectorAll("*");
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.right > clientWidth + 2 || rect.left < -2) {
        const style = getComputedStyle(el);
        if (style.position === "fixed" || style.position === "sticky") continue;
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const cls =
          el.className && typeof el.className === "string"
            ? `.${el.className.split(/\s+/).slice(0, 2).join(".")}`
            : "";
        offenders.push({
          tag,
          selector: `${tag}${id}${cls}`,
          right: Math.round(rect.right),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
        });
        if (offenders.length >= 5) break;
      }
    }
  }

  return { clientWidth, scrollWidth, hasOverflow, offenders };
}

async function discoverDynamicRoutes(page) {
  const routes = [];

  await page.goto(`${BASE_URL}/programs`, { waitUntil: "domcontentloaded", timeout: 20000 });
  await waitForAppReady(page);
  const programLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/programs/"]'))
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && !h.endsWith("/programs") && h.split("/").length >= 3)
      .slice(0, 2)
  );
  routes.push(...programLinks.map((h) => (h.startsWith("http") ? new URL(h).pathname : h)));

  await page.goto(`${BASE_URL}/universities`, { waitUntil: "domcontentloaded", timeout: 20000 });
  await waitForAppReady(page);
  const uniLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/universities/"]'))
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && !h.endsWith("/universities") && h.split("/").filter(Boolean).length >= 2)
      .slice(0, 2)
  );
  routes.push(...uniLinks.map((h) => (h.startsWith("http") ? new URL(h).pathname : h)));

  return [...new Set(routes)];
}

const CHROME_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const results = [];
  let dynamicRoutes = [];

  try {
    const allRoutes = STATIC_ROUTES;

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });

      for (const path of allRoutes) {
        try {
          await page.goto(`${BASE_URL}${path}`, { waitUntil: "domcontentloaded", timeout: 20000 });
          await waitForAppReady(page);

          for (const theme of THEMES) {
            await setTheme(page, theme);
            const data = await page.evaluate(detectOverflow);
            results.push({ path, viewport: vp.name, theme, ...data });
          }
        } catch (err) {
          for (const theme of THEMES) {
            results.push({ path, viewport: vp.name, theme, error: err.message });
          }
        }
      }
    }
  } finally {
    await browser.close();
  }

  const overflowIssues = results.filter((r) => r.hasOverflow);
  const errors = results.filter((r) => r.error);

  const summary = {
    totalChecks: results.length,
    routesChecked: [...STATIC_ROUTES, ...dynamicRoutes].length,
    dynamicRoutes,
    viewports: VIEWPORTS.map((v) => v.name),
    themes: THEMES,
    overflowCount: overflowIssues.length,
    errorCount: errors.length,
    overflowIssues,
    errors,
  };

  writeFileSync("responsive-audit-report.json", JSON.stringify(summary, null, 2));

  console.log("RESPONSIVE_AUDIT_JSON_START");
  console.log(JSON.stringify(summary, null, 2));
  console.log("RESPONSIVE_AUDIT_JSON_END");
  console.log(
    `RESULT: ${results.length - overflowIssues.length - errors.length}/${results.length} passed | overflow: ${overflowIssues.length} | errors: ${errors.length}`
  );

  if (overflowIssues.length > 0 || errors.length > 0) {
    process.exitCode = 2;
  }
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
