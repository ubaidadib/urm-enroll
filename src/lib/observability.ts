export type ObservabilityConfig = {
  sentryDsn?: string;
  release?: string;
};

export const initObservability = (_config: ObservabilityConfig) => {
  // Placeholder for Sentry/OTel initialization.
};
