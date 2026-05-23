(function () {
  try {
    var STORAGE_KEY = "urmenroll_language";
    var LEGACY_KEY = "urm-language";
    var SUPPORTED = ["en", "ar", "de"];
    var DEFAULT = "en";
    var RTL = ["ar"];
    var pathLang = (window.location.pathname.split("/")[1] || "").toLowerCase();

    var saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    var lang = DEFAULT;

    if (SUPPORTED.indexOf(pathLang) !== -1) {
      lang = pathLang;
    } else if (saved && SUPPORTED.indexOf(saved) !== -1) {
      lang = saved;
    } else {
      var browserLangs = navigator.languages || [navigator.language || DEFAULT];
      for (var i = 0; i < browserLangs.length; i++) {
        var locale = browserLangs[i] || "";
        var base = locale.split("-")[0].toLowerCase();
        if (SUPPORTED.indexOf(base) !== -1) {
          lang = base;
          break;
        }
      }
    }

    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.indexOf(lang) !== -1 ? "rtl" : "ltr";
    window.__INITIAL_LANGUAGE__ = lang;
  } catch (e) {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    window.__INITIAL_LANGUAGE__ = "en";
  }
})();
