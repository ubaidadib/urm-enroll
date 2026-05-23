import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  applyTheme,
  getInitialTheme,
  getStoredTheme,
  hasUserThemePreference,
  saveThemePreference,
  type ThemePreference,
} from "@/lib/theme";
import { useSystemPreferences } from "@/hooks/useSystemPreferences";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  themeSource: "system" | "manual";
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => getInitialTheme());
  const [hasUserPreference, setHasUserPreference] = useState<boolean>(() => hasUserThemePreference());

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
  }, []);

  useEffect(() => {
    const resolved = applyTheme(theme);
    setResolvedTheme(resolved);
    saveThemePreference(theme);
    setHasUserPreference(theme === "light" || theme === "dark");
  }, [theme]);

  useSystemPreferences({
    hasUserThemePreference: hasUserPreference,
    onThemeChange: (nextTheme) => {
      if (theme === "system") {
        setResolvedTheme(applyTheme(nextTheme));
      }
    },
  });

  const value = useMemo(
    () => {
      const themeSource: "system" | "manual" = hasUserPreference ? "manual" : "system";
      return {
        theme,
        resolvedTheme,
        themeSource,
        setTheme,
      };
    },
    [theme, resolvedTheme, hasUserPreference, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
