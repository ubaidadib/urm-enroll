
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadLocale } from "./i18n/loader";
import { detectInitialLanguage } from "./i18n/detectLanguage";
import { initAnalytics } from "@/lib/analytics";
import { bootstrapMirrorCatalogCache } from "@/lib/mirror-catalog";
import { registerServiceWorker } from "@/lib/register-service-worker";
import "./styles/index.css";

async function bootstrap() {
  initAnalytics();
  registerServiceWorker();
  await bootstrapMirrorCatalogCache();
  const initialLanguage = detectInitialLanguage();
  await loadLocale(initialLanguage);
  const { default: App } = await import("./app/App.tsx");

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
  