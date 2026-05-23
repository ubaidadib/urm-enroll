import puppeteer from "puppeteer";

const BASE_URL = process.env.AUDIT_BASE_URL || "http://127.0.0.1:4173";
const PAGES = ["/", "/programs", "/universities", "/services", "/about", "/contact", "/nursing"];
const KEY_JOURNEY_ROUTES = [
  "/",
  "/programs",
  "/universities",
  "/quiz",
  "/germany-careers",
  "/chancenkarte/eligibility",
  "/contact",
];
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

async function waitForAppReady(page) {
  await page.waitForFunction(
    () => {
      const hasPreloader = Boolean(document.querySelector('[role="status"][aria-live="polite"]'));
      const hasNavLinks = document.querySelectorAll("a").length > 0;
      return !hasPreloader && hasNavLinks;
    },
    { timeout: 25000 }
  );
}

async function runResponsiveChecks(page) {
  const results = [];
  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    for (const path of PAGES) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle2" });
      await waitForAppReady(page);
      const data = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
        const clientWidth = doc.clientWidth;
        const hasOverflow = scrollWidth > clientWidth + 1;
        return { scrollWidth, clientWidth, hasOverflow };
      });
      results.push({ viewport: vp.name, path, ...data });
    }
  }
  return results;
}

async function runDarkModeCheck(page) {
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });
  await waitForAppReady(page);
  await page.waitForSelector("header", { timeout: 10000 });

  const before = await page.evaluate(() => {
    const htmlClass = document.documentElement.className;
    const bg = getComputedStyle(document.body).backgroundColor;
    return { htmlClass, bg };
  });

  const toggleSelector =
    'button[aria-controls="theme-menu"], button[title*="mode" i], button[aria-label*="mode" i]';
  const themeToggle = await page.$(toggleSelector);
  if (!themeToggle) {
    return { passed: false, reason: "theme toggle button not found" };
  }

  await themeToggle.click();
  await page.waitForSelector("#theme-menu", { timeout: 4000 });

  const lightButton = await page.$("#theme-menu button:nth-child(2)");
  if (!lightButton) {
    return { passed: false, reason: "light mode option not found" };
  }
  await lightButton.click();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const lightState = await page.evaluate(() => {
    const htmlClass = document.documentElement.className;
    const bg = getComputedStyle(document.body).backgroundColor;
    return { htmlClass, bg };
  });

  const toggleAgain = await page.$(toggleSelector);
  if (!toggleAgain) {
    return { passed: false, reason: "theme toggle button not found for second pass" };
  }
  await toggleAgain.click();
  await page.waitForSelector("#theme-menu", { timeout: 4000 });

  const darkButton = await page.$("#theme-menu button:nth-child(3)");
  if (!darkButton) {
    return { passed: false, reason: "dark mode option not found" };
  }

  await darkButton.click();
  await new Promise((resolve) => setTimeout(resolve, 300));

  const after = await page.evaluate(() => {
    const htmlClass = document.documentElement.className;
    const bg = getComputedStyle(document.body).backgroundColor;
    return { htmlClass, bg };
  });

  const lightModeActive = /(^|\s)light(\s|$)/.test(lightState.htmlClass) || lightState.bg !== after.bg;
  const darkModeActive = /(^|\s)dark(\s|$)/.test(after.htmlClass) || lightState.bg !== after.bg;

  return {
    passed: lightModeActive && darkModeActive,
    before,
    lightState,
    after,
  };
}

async function runAccessibilityChecks(page) {
  await page.setViewport({ width: 1280, height: 800 });

  const findings = [];
  for (const path of PAGES) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle2" });
    await waitForAppReady(page);
    const pageFindings = await page.evaluate(() => {
      const issues = [];

      const imagesWithoutAlt = Array.from(document.querySelectorAll("img")).filter(
        (img) => !img.hasAttribute("alt") || !img.getAttribute("alt")
      );
      if (imagesWithoutAlt.length > 0) {
        issues.push({ type: "img-alt", count: imagesWithoutAlt.length });
      }

      const unlabeledButtons = Array.from(document.querySelectorAll("button")).filter((button) => {
        const text = (button.textContent || "").trim();
        const aria = button.getAttribute("aria-label");
        const title = button.getAttribute("title");
        return !text && !aria && !title;
      });
      if (unlabeledButtons.length > 0) {
        issues.push({ type: "button-label", count: unlabeledButtons.length });
      }

      const formElements = Array.from(document.querySelectorAll("input, select, textarea"));
      const unlabeledInputs = formElements.filter((el) => {
        if (el instanceof HTMLInputElement && el.type === "hidden") {
          return false;
        }
        const id = el.getAttribute("id");
        const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
        const hasExplicitLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
        const hasWrapperLabel = Boolean(el.closest("label"));
        return !aria && !hasExplicitLabel && !hasWrapperLabel;
      });
      if (unlabeledInputs.length > 0) {
        issues.push({ type: "input-label", count: unlabeledInputs.length });
      }

      return issues;
    });

    findings.push({ path, issues: pageFindings });
  }

  return findings;
}

async function runRouteSnapshotChecks(page) {
  await page.setViewport({ width: 1280, height: 800 });

  const snapshots = [];
  for (const path of KEY_JOURNEY_ROUTES) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle2" });
    await waitForAppReady(page);

    const snapshot = await page.evaluate((currentPath) => {
      const title = document.title || "";
      const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
      const h1Count = document.querySelectorAll("h1").length;
      const h1Text = document.querySelector("h1")?.textContent?.trim() || "";
      const htmlLang = document.documentElement.getAttribute("lang") || "";

      const issues = [];
      if (!title.trim()) issues.push("missing-title");
      if (!description.trim()) issues.push("missing-meta-description");
      if (!canonical.trim()) issues.push("missing-canonical");
      if (!ogTitle.trim()) issues.push("missing-og-title");
      if (!ogDescription.trim()) issues.push("missing-og-description");
      if (h1Count === 0) issues.push("missing-h1");
      if (h1Count > 1) issues.push("multiple-h1");

      return {
        path: currentPath,
        title,
        description,
        canonical,
        ogTitle,
        ogDescription,
        h1Count,
        h1Text,
        htmlLang,
        issues,
      };
    }, path);

    snapshots.push(snapshot);
  }

  return snapshots;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const responsive = await runResponsiveChecks(page);
    const darkMode = await runDarkModeCheck(page);
    const accessibility = await runAccessibilityChecks(page);
    const routeSnapshots = await runRouteSnapshotChecks(page);

    const overflowIssues = responsive.filter((item) => item.hasOverflow);
    const accessibilityIssues = accessibility.filter((item) => item.issues.length > 0);
    const routeSnapshotIssues = routeSnapshots.filter((item) => item.issues.length > 0);

    const summary = {
      responsive: {
        totalChecks: responsive.length,
        overflowIssues: overflowIssues.length,
        samples: overflowIssues.slice(0, 8),
      },
      darkMode,
      accessibility: {
        pagesChecked: accessibility.length,
        pagesWithIssues: accessibilityIssues.length,
        details: accessibilityIssues,
      },
      routeSnapshots: {
        routesChecked: routeSnapshots.length,
        routesWithIssues: routeSnapshotIssues.length,
        details: routeSnapshots,
      },
    };

    // Print machine-readable JSON and a compact text summary.
    console.log("UI_SMOKE_AUDIT_JSON_START");
    console.log(JSON.stringify(summary, null, 2));
    console.log("UI_SMOKE_AUDIT_JSON_END");

    const darkStatus = darkMode.passed ? "PASS" : `FAIL (${normalizeText(darkMode.reason)})`;
    console.log(`RESPONSIVE: ${responsive.length - overflowIssues.length}/${responsive.length} checks passed`);
    console.log(`DARK_MODE: ${darkStatus}`);
    console.log(`A11Y: ${accessibility.length - accessibilityIssues.length}/${accessibility.length} pages without issues`);
    console.log(`ROUTE_SNAPSHOTS: ${routeSnapshots.length - routeSnapshotIssues.length}/${routeSnapshots.length} routes passed metadata checks`);

    if (overflowIssues.length > 0 || !darkMode.passed || accessibilityIssues.length > 0 || routeSnapshotIssues.length > 0) {
      process.exitCode = 2;
    }
  } finally {
    await browser.close();
  }
})();
