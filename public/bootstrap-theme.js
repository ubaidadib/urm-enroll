(function () {
  try {
    var STORAGE_KEY = "urmenroll_theme";
    var LEGACY_KEY = "urm-theme";
    var saved = localStorage.getItem(STORAGE_KEY);
    var legacy = localStorage.getItem(LEGACY_KEY);
    var preference = saved || legacy;
    var isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var theme;
    if (preference === "light" || preference === "dark") {
      theme = preference;
    } else {
      theme = isDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);

    window.__INITIAL_THEME__ = theme;
    window.__PREFERS_REDUCED_MOTION__ = reducedMotion;
  } catch (e) {
    var fallbackDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var fallbackTheme = fallbackDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", fallbackTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(fallbackTheme);
    document.documentElement.style.colorScheme = fallbackTheme;
    window.__INITIAL_THEME__ = fallbackTheme;
    window.__PREFERS_REDUCED_MOTION__ = false;
  }
})();
