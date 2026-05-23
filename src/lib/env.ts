import { z } from "zod";

type PublicEnv = {
  siteUrl: string;
  ogImagePath: string;
  allowedOrigins: string[];
  turnstileSiteKey: string;
  ga4Id: string;
  metaPixelId: string;
  analyticsDebug: boolean;
};

const envSchema = z.object({
  VITE_PUBLIC_SITE_URL: z.string().url().optional().or(z.literal("")),
  VITE_ALLOWED_ORIGINS: z.string().optional(),
  VITE_TURNSTILE_SITE_KEY: z.string().optional(),
  VITE_GA4_MEASUREMENT_ID: z.string().optional(),
  VITE_META_PIXEL_ID: z.string().optional(),
  VITE_ANALYTICS_DEBUG: z.string().optional(),
});

const sanitizeUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return "";
  }
};

export const getPublicEnv = (): PublicEnv => {
  const rawEnv = import.meta.env as Record<string, string | undefined>;
  const parsed = envSchema.safeParse(rawEnv);
  const envUrl = parsed.success ? sanitizeUrl(parsed.data.VITE_PUBLIC_SITE_URL ?? "") : "";
  const siteUrl = envUrl || "https://enrollurm.com";

  const allowedOrigins = (parsed.success ? parsed.data.VITE_ALLOWED_ORIGINS ?? "" : "")
    .split(",")
    .map((origin) => sanitizeUrl(origin.trim()))
    .filter(Boolean);

  const resolvedTurnstileKey = parsed.success
    ? parsed.data.VITE_TURNSTILE_SITE_KEY || ""
    : "";

  // In development, use Cloudflare's always-pass test key when no real key is configured
  const turnstileKey =
    resolvedTurnstileKey && resolvedTurnstileKey !== "replace-with-turnstile-site-key"
      ? resolvedTurnstileKey
      : import.meta.env.DEV
        ? "1x00000000000000000000AA"
        : "";

  return {
    siteUrl: siteUrl.replace(/\/$/, ""),
    ogImagePath: "/og-image.svg",
    allowedOrigins: allowedOrigins.length ? allowedOrigins : [siteUrl.replace(/\/$/, "")],
    turnstileSiteKey: turnstileKey,
    ga4Id: (parsed.success ? parsed.data.VITE_GA4_MEASUREMENT_ID ?? "" : "").trim(),
    metaPixelId: (parsed.success ? parsed.data.VITE_META_PIXEL_ID ?? "" : "").trim(),
    analyticsDebug:
      (parsed.success ? parsed.data.VITE_ANALYTICS_DEBUG ?? "" : "").trim() === "true",
  };
};
