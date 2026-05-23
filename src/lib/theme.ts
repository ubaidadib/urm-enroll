export type ResolvedTheme = "light" | "dark";
export type ThemePreference = ResolvedTheme | "system";

export const THEME_STORAGE_KEY = "urmenroll_theme";
export const LEGACY_THEME_STORAGE_KEY = "urm-theme";

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === "light" || value === "dark" || value === "system";
};

const readStoredTheme = (): ThemePreference | null => {
  if (typeof window === "undefined") return null;

  try {
    const current = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(current)) return current;

    const legacy = window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (isThemePreference(legacy)) {
      if (legacy === "light" || legacy === "dark") {
        window.localStorage.setItem(THEME_STORAGE_KEY, legacy);
      }
      return legacy;
    }
  } catch {
    return null;
  }

  return null;
};

export const hasUserThemePreference = (): boolean => {
  const stored = readStoredTheme();
  return stored === "light" || stored === "dark";
};

export const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const getStoredTheme = (): ThemePreference => {
  const stored = readStoredTheme();
  return stored ?? "system";
};

export const getInitialTheme = (): ResolvedTheme => {
  if (typeof window !== "undefined" && (window.__INITIAL_THEME__ === "light" || window.__INITIAL_THEME__ === "dark")) {
    return window.__INITIAL_THEME__;
  }

  return resolveTheme(getStoredTheme());
};

export const resolveTheme = (preference: ThemePreference): ResolvedTheme => {
  if (preference === "system") return getSystemTheme();
  return preference;
};

export const saveThemePreference = (theme: ThemePreference): void => {
  if (typeof window === "undefined") return;

  try {
    if (theme === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  } catch {
    // Silent fallback when storage is blocked.
  }
};

export const clearThemePreference = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  } catch {
    // Silent fallback when storage is blocked.
  }
};

export const applyTheme = (preference: ThemePreference, root: HTMLElement = document.documentElement): ResolvedTheme => {
  const resolved = resolveTheme(preference);
  root.dataset.theme = resolved;
  root.setAttribute("data-theme", resolved);
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.style.colorScheme = resolved;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("urm-theme-change", { detail: resolved }));
  }

  return resolved;
};
