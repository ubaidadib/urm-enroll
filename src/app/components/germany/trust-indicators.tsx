import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

type Props = { variant?: "light" | "dark" };

export function TrustIndicators({ variant = "light" }: Props) {
  const { t } = useLanguage();
  const items = t<readonly string[]>("germany.trustBar.items");
  const isDark = variant === "dark";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${
        isDark ? "text-white/65" : "text-text-secondary"
      }`}
    >
      <span
        className={`text-[11px] uppercase tracking-[0.22em] font-semibold ${
          isDark ? "text-white/45" : "text-text-muted"
        }`}
      >
        {t<string>("germany.trustBar.title")}
      </span>
      {Array.isArray(items) &&
        items.map((label) => (
          <span key={label} className="inline-flex items-center gap-2 text-sm">
            <ShieldCheck
              className={`w-4 h-4 ${isDark ? "text-accent-primary-text" : "text-accent-success"}`}
            />
            {label}
          </span>
        ))}
    </div>
  );
}
