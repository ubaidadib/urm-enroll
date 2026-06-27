import { Component, type ContextType, type ErrorInfo, type ReactNode } from "react";
import { LanguageContext } from "@/i18n/language-context-value";
import { logger } from "@/lib/logger";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static contextType = LanguageContext;
  declare context: ContextType<typeof LanguageContext>;

  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Report the crash so it is not invisible. Stack traces are still never
    // rendered to the UI — they only go to the (redacting) logger and the
    // server-side monitoring sink.
    logger.error({ message: "ErrorBoundary caught a crash", context: { name: error?.name } });

    if (typeof window === "undefined") return;

    const payload = JSON.stringify({
      message: String(error?.message || "").slice(0, 500),
      name: String(error?.name || "").slice(0, 120),
      componentStack: String(info?.componentStack || "").slice(0, 4000),
      url: window.location?.href?.slice(0, 2000),
      userAgent: navigator.userAgent?.slice(0, 500),
    });

    try {
      // keepalive so the report survives the navigation/unmount during a crash.
      void fetch("/api/client-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        credentials: "omit",
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Reporting must never throw from within the boundary.
    }
  }

  render() {
    const tx = (key: string) => this.context?.t<string>(key) ?? "";

    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-bg-tertiary text-text-primary flex items-center justify-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-text-muted mb-4">{tx("errorBoundary.notice")}</p>
          <h1 className="text-3xl font-semibold mb-4">{tx("errorBoundary.title")}</h1>
          <p className="text-text-secondary mb-8">
            {tx("errorBoundary.description")}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-linear-to-r from-accent-success to-accent-success-strong text-ink font-semibold"
          >
            {tx("errorBoundary.cta")}
          </a>
        </div>
      </div>
    );
  }
}
