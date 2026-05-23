import { useEffect } from "react";

interface UseSystemPreferencesProps {
  onThemeChange: (theme: "light" | "dark") => void;
  hasUserThemePreference: boolean;
}

export function useSystemPreferences({
  onThemeChange,
  hasUserThemePreference,
}: UseSystemPreferencesProps) {
  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleThemeChange = (event: MediaQueryListEvent) => {
      if (!hasUserThemePreference) {
        onThemeChange(event.matches ? "dark" : "light");
      }
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("reduced-motion", event.matches);
      window.__PREFERS_REDUCED_MOTION__ = event.matches;
    };

    darkQuery.addEventListener("change", handleThemeChange);
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    return () => {
      darkQuery.removeEventListener("change", handleThemeChange);
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [hasUserThemePreference, onThemeChange]);
}
