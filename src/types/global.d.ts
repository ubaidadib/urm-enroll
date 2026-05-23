declare global {
  interface Window {
    __INITIAL_THEME__?: "light" | "dark";
    __INITIAL_LANGUAGE__?: string;
    __PREFERS_REDUCED_MOTION__?: boolean;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

export {};
