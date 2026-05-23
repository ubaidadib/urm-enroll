import { Component, type ContextType, type ErrorInfo, type ReactNode } from "react";
import { LanguageContext } from "@/i18n/language-context-value";

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

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Intentionally left blank to avoid leaking stack traces in production.
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
