import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";
import puppeteer from "puppeteer";

// Puppeteer requires Chrome system libraries (libnspr4.so, etc.) that are not
// available in Vercel's build environment. Skip prerendering there — Vercel
// serves the SPA index.html for all routes via cleanUrls + rewrites anyway.
if (process.env.VERCEL) {
  console.log("[prerender] Skipping prerender on Vercel (Puppeteer not supported in build environment)");
  process.exit(0);
}

const distDir = resolve("dist");
const fallbackHtml = readFileSync(join(distDir, "index.html"), "utf8");
const host = "127.0.0.1";
const port = 4178;

const baseRoutes = [
  "",
  "/services",
  "/programs",
  "/destinations",
  "/nursing",
  "/nursing-assessment",
  "/partnerships",
  "/about",
  "/contact",
  "/resources",
  "/resources/how-to-apply-german-university",
  "/resources/student-visa-germany-guide",
  "/resources/free-universities-germany",
  "/quiz",
  "/germany-careers",
  "/germany-jobs",
  "/germany-relocation",
  "/chancenkarte",
  "/chancenkarte/eligibility",
  "/chancenkarte/process",
  "/chancenkarte/requirements",
  "/chancenkarte/success-stories",
  "/chancenkarte/faq",
  "/privacy",
  "/terms",
  "/cookies",
];
const langs = ["en", "ar", "de"];
const routes = langs.flatMap((lang) => baseRoutes.map((path) => `/${lang}${path}`));

const mimeType = (file) => {
  const extension = extname(file).toLowerCase();
  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".js") return "application/javascript; charset=utf-8";
  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".json") return "application/json; charset=utf-8";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  if (extension === ".woff") return "font/woff";
  if (extension === ".woff2") return "font/woff2";
  return "application/octet-stream";
};

const server = createServer((req, res) => {
  const rawPath = (req.url || "/").split("?")[0] || "/";
  const safePath = rawPath.replace(/^\/+/, "");
  const target = join(distDir, safePath);

  if (existsSync(target) && statSync(target).isFile()) {
    res.writeHead(200, { "Content-Type": mimeType(target), "Cache-Control": "no-store" });
    createReadStream(target).pipe(res);
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  res.end(fallbackHtml);
});

const waitForRenderedContent = async (page) => {
  await page.waitForSelector("#root", { timeout: 30000 });
  await page.waitForFunction(
    () => {
      const root = document.getElementById("root");
      if (!root) return false;
      const text = (root.textContent || "").trim();
      return text.length > 120;
    },
    { timeout: 30000 },
  );
};

const deduplicateDoctype = (html) => {
  const stripped = html.replace(/<!DOCTYPE[^>]*>/gi, "").trimStart();
  return `<!DOCTYPE html>\n${stripped}`;
};

const writeRouteHtml = (route, html) => {
  const routeDir = join(distDir, route.replace(/^\//, ""));
  mkdirSync(routeDir, { recursive: true });
  const normalizedHtml = deduplicateDoctype(html).trim();
  writeFileSync(join(routeDir, "index.html"), normalizedHtml, "utf8");
};

const run = async () => {
  await new Promise((resolveStart) => server.listen(port, host, resolveStart));
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (process.platform === "win32"
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : undefined);
  const browser = await puppeteer.launch({
    headless: true,
    ...(chromePath ? { executablePath: chromePath } : {}),
  });
  const page = await browser.newPage();

  try {
    for (const route of routes) {
      const url = `http://${host}:${port}${route}`;
      await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
      await waitForRenderedContent(page);

      const html = await page.content();
      writeRouteHtml(route, html);
      console.log(`[prerender] ${route}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
};

run().catch((error) => {
  console.error("[prerender] failed", error);
  server.close();
  process.exit(1);
});
