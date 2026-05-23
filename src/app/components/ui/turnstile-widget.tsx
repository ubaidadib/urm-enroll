import { useEffect, useRef } from "react";

import { logger } from "@/lib/logger";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  siteKey: string;
  onTokenChange: (token: string) => void;
  resetKey?: string;
};

export function TurnstileWidget({ siteKey, onTokenChange, resetKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return;
    }

    let pollTimer: number | undefined;

    const ensureScript = () => {
      if (window.turnstile) return;
      if (document.querySelector("script[data-turnstile='loader']")) return;

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.setAttribute("data-turnstile", "loader");
      document.head.appendChild(script);
    };

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current) {
        return;
      }

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: "auto",
          callback: (token: string) => onTokenChange(token),
          "expired-callback": () => onTokenChange(""),
          "error-callback": () => onTokenChange(""),
        });
      } catch (error) {
        logger.warn({
          message: "Turnstile widget render failed",
          context: { error },
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      ensureScript();
      let attempts = 0;
      const maxAttempts = 40; // 10 seconds at 250ms intervals
      pollTimer = window.setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
          window.clearInterval(pollTimer);
          renderWidget();
        } else if (attempts >= maxAttempts) {
          window.clearInterval(pollTimer);
          logger.warn({ message: "Turnstile script failed to load after timeout" });
        }
      }, 250);
    }

    return () => {
      if (pollTimer) {
        window.clearInterval(pollTimer);
      }

      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          window.turnstile.reset(widgetIdRef.current);
        }
      }

      widgetIdRef.current = null;
    };
  }, [siteKey, onTokenChange]);

  useEffect(() => {
    if (!window.turnstile || !widgetIdRef.current) {
      return;
    }

    onTokenChange("");
    window.turnstile.reset(widgetIdRef.current);
  }, [resetKey, onTokenChange]);

  return <div ref={containerRef} className="min-h-[65px] w-[300px]" />;
}
